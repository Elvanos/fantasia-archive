import type { ElectronApplication, Page } from 'playwright'
import { expect, test } from '@playwright/test'
import type { TestInfo } from '@playwright/test'
import {
  e2eExpectFaActiveProjectStoreName
} from 'app/helpers/playwrightHelpers_e2e/e2eExpectFaActiveProjectStore'
import { launchFaPlaywrightE2eAppWindow } from 'app/helpers/playwrightHelpers_e2e/faPlaywrightE2eAppLifecycle'
import {
  expectFaPlaywrightE2eHashRoute
} from 'app/helpers/playwrightHelpers_e2e/faPlaywrightE2eAppShellAssertions'
import {
  navigateFaPlaywrightE2eToSplashRoute
} from 'app/helpers/playwrightHelpers_e2e/faPlaywrightE2eNavigateHome'
import {
  gotoFaPlaywrightE2eNonexistentRouteFor404
} from 'app/helpers/playwrightHelpers_e2e/faPlaywrightE2eNavigate404'
import {
  e2eExpandWorldAndPlacementNodes,
  e2eSeedHierarchyPlacementWithDocuments
} from 'app/helpers/playwrightHelpers_e2e/e2eWorkspaceHierarchyTreeHelpers'
import {
  e2eSetNextProjectCreatePath,
  tryUnlinkE2eFaprojectFixture
} from 'app/helpers/playwrightHelpers_e2e/playwrightE2eProjectPaths'
import { FA_FRONTEND_RENDER_TIMER } from 'app/helpers/playwrightHelpers_universal/faPlaywrightElectronLaunchConstants'
import {
  FA_PLAYWRIGHT_PRESS_DEFAULT_SHOW_PROJECT_DASHBOARD,
  FA_PLAYWRIGHT_PRESS_DEFAULT_TOGGLE_HIERARCHICAL_TREE
} from 'app/helpers/playwrightHelpers_universal/faPlaywrightKeyboardChords'
import { tearDownFaPlaywrightElectronSerialSuite } from 'app/helpers/playwrightHelpers_universal/faPlaywrightSerialSuiteLifecycleTeardown'
import projectOverviewMessages from 'app/i18n/en-US/components/projectUI/ProjectOverview/L_projectOverview'

/**
 * Extra env settings to trigger E2E via Playwright (isolated userData).
 */
const extraEnvSettings = {
  TEST_ENV: 'e2e' as const
}

/**
 * Object of string data selectors for the e2e
 */
const selectorList = {
  createBtn: 'dialogNewProject-button-create',
  contextCopyDocument: 'projectHierarchyTree-nodeContextMenu-copyDocument',
  contextDeleteDocument: 'projectHierarchyTree-nodeContextMenu-deleteDocument',
  contextEditDocument: 'projectHierarchyTree-nodeContextMenu-editDocument',
  contextOpenDocument: 'projectHierarchyTree-nodeContextMenu-openDocument',
  nameInput: 'dialogNewProject-input-name',
  projectAppControlBar: 'projectAppControlBar',
  projectOverview: 'projectOverview',
  projectOverviewDocCountLabel: 'projectOverview-docCountLabel',
  projectOverviewEmptyCta: 'projectOverview-emptyCta',
  projectOverviewGraphParent: 'projectOverview-graphParent',
  projectOverviewLastOpened: 'projectOverview-lastOpened',
  projectOverviewLastOpenedTitle: 'projectOverview-lastOpenedTitle',
  splashNew: 'splashPage-btn-new'
} as const

const OVERVIEW_CHART_E2E_FAPROJECT = 'e2e-project-overview-chart-last-opened.faproject'
const OVERVIEW_CHART_E2E_PROJECT_NAME = 'E2E overview chart last opened'
const OVERVIEW_CHART_E2E_DOC_LABEL = 'E2E Chart Hero'
const OVERVIEW_CHART_E2E_SECOND_DOC_LABEL = 'E2E Chart Sidekick'
const OVERVIEW_RELOAD_SETTLE_MS = 750

async function prepareRendererForGlobalShortcuts (page: Page): Promise<void> {
  await page.bringToFront()
  await page.evaluate(() => {
    const root = document.querySelector('#q-app')
    if (root instanceof HTMLElement) {
      root.tabIndex = -1
      root.focus()
    }
  })
}

async function triggerGlobalShortcut (page: Page, playwrightShortcut: string): Promise<void> {
  await prepareRendererForGlobalShortcuts(page)
  await page.keyboard.press(playwrightShortcut)
}

/**
 * openHierarchyTreeDocument looks up nodes in hierarchy treeData; expand so seeded docs are mounted.
 */
async function ensureHierarchyTreeDocumentNodesLoaded (page: Page): Promise<void> {
  const hierarchyHost = page.locator('[data-test-locator="projectHierarchyTree-host"]')
  if (await hierarchyHost.count() === 0) {
    await page.locator(`[data-test-locator="${selectorList.projectAppControlBar}"]`).click()
    await triggerGlobalShortcut(page, FA_PLAYWRIGHT_PRESS_DEFAULT_TOGGLE_HIERARCHICAL_TREE)
  }
  await expect(hierarchyHost).toBeVisible({ timeout: 15_000 })
  await e2eExpandWorldAndPlacementNodes(page)
}

async function createE2eProjectOnHome (
  page: Page,
  electronApplication: ElectronApplication
): Promise<void> {
  await navigateFaPlaywrightE2eToSplashRoute(page)
  await e2eSetNextProjectCreatePath(electronApplication, OVERVIEW_CHART_E2E_FAPROJECT)
  await page.locator(`[data-test-locator="${selectorList.splashNew}"]`).click()
  await expect(page.locator(`[data-test-locator="${selectorList.nameInput}"]`)).toBeVisible()
  await page.locator(`[data-test-locator="${selectorList.nameInput}"]`).fill(
    OVERVIEW_CHART_E2E_PROJECT_NAME
  )
  await page.locator(`[data-test-locator="${selectorList.createBtn}"]`).click()
  await e2eExpectFaActiveProjectStoreName(page, OVERVIEW_CHART_E2E_PROJECT_NAME)
  await expectFaPlaywrightE2eHashRoute(page, '/home')
  await expect(
    page.locator(`[data-test-locator="${selectorList.projectAppControlBar}"]`)
  ).toBeVisible({ timeout: 15_000 })
}

/**
 * Seeds documents, records last-opened MRU, and remounts Project Overview on /home.
 */
async function seedOverviewChartAndLastOpenedContent (page: Page): Promise<{
  documents: Array<{ displayName: string, id: string }>
}> {
  const seeded = await e2eSeedHierarchyPlacementWithDocuments(page, {
    documents: [
      {
        displayName: OVERVIEW_CHART_E2E_DOC_LABEL,
        sortOrder: 0
      },
      {
        displayName: OVERVIEW_CHART_E2E_SECOND_DOC_LABEL,
        sortOrder: 1
      }
    ],
    templateDisplayName: 'E2E Overview Characters',
    templatePluralTitle: 'Characters',
    templateSingularTitle: 'Character'
  })
  expect(seeded.documents.length).toBe(2)
  const primaryDocument = seeded.documents[0]
  const secondaryDocument = seeded.documents[1]
  if (primaryDocument === undefined || secondaryDocument === undefined) {
    throw new Error('Expected seeded overview documents')
  }

  await page.evaluate(async (documentIds) => {
    const content = window.faContentBridgeAPIs?.projectContent
    if (typeof content?.recordDocumentLastOpened !== 'function') {
      throw new Error('recordDocumentLastOpened unavailable')
    }
    for (const documentId of documentIds) {
      await content.recordDocumentLastOpened({ documentId })
    }
  }, [secondaryDocument.id, primaryDocument.id])

  // Load document nodes into hierarchy treeData so last-opened openHierarchyTreeDocument can resolve them.
  await ensureHierarchyTreeDocumentNodesLoaded(page)

  // Leave /home then return so Project Overview remounts against seeded SQLite rows.
  await gotoFaPlaywrightE2eNonexistentRouteFor404(page)
  await triggerGlobalShortcut(page, FA_PLAYWRIGHT_PRESS_DEFAULT_SHOW_PROJECT_DASHBOARD)
  await expectFaPlaywrightE2eHashRoute(page, '/home')
  await page.waitForTimeout(OVERVIEW_RELOAD_SETTLE_MS)

  return { documents: seeded.documents }
}

function lastOpenedItemLocator (documentId: string): string {
  return `projectOverview-lastOpenedItem-${documentId}`
}

test.describe.serial('Project Overview chart and last opened E2E', () => {
  let electronApp: ElectronApplication
  let appWindow: Page
  let suiteTestInfo: TestInfo
  let primaryDocumentId = ''
  let secondaryDocumentId = ''

  test.describe.configure({
    timeout: 180_000
  })

  test.beforeAll(async ({}, testInfo) => {
    suiteTestInfo = testInfo
    const launched = await launchFaPlaywrightE2eAppWindow({
      afterIsolationResetBeforeLaunch (): void {
        tryUnlinkE2eFaprojectFixture(OVERVIEW_CHART_E2E_FAPROJECT)
      },
      buildLaunchEnv (): Record<string, string> {
        return {
          TEST_ENV: extraEnvSettings.TEST_ENV
        }
      },
      dismissStartupTips: true,
      renderDelayMs: FA_FRONTEND_RENDER_TIMER,
      testInfo
    })
    electronApp = launched.electronApp
    appWindow = launched.appWindow
  })

  test.afterAll(async ({}, afterAllTestInfo) => {
    await tearDownFaPlaywrightElectronSerialSuite({
      afterAllTestInfo,
      electronApp,
      suiteTestInfo
    })
  })

  /**
   * Seeded project content shows the distribution chart and last-opened list on Project Overview.
   */
  test('Project Overview shows distribution chart and last-opened list', async () => {
    await createE2eProjectOnHome(appWindow, electronApp)
    const seeded = await seedOverviewChartAndLastOpenedContent(appWindow)
    const primaryDocument = seeded.documents[0]
    const secondaryDocument = seeded.documents[1]
    if (primaryDocument === undefined || secondaryDocument === undefined) {
      throw new Error('Expected seeded overview documents')
    }
    primaryDocumentId = primaryDocument.id
    secondaryDocumentId = secondaryDocument.id

    const overview = appWindow.locator(`[data-test-locator="${selectorList.projectOverview}"]`)
    await expect(overview).toBeVisible({ timeout: 15_000 })
    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.projectOverviewEmptyCta}"]`)
    ).toHaveCount(0)
    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.projectOverviewGraphParent}"]`)
    ).toBeVisible({ timeout: 15_000 })
    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.projectOverviewDocCountLabel}"]`)
    ).toContainText('2', { timeout: 15_000 })

    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.projectOverviewLastOpened}"]`)
    ).toBeVisible({ timeout: 15_000 })
    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.projectOverviewLastOpenedTitle}"]`)
    ).toHaveText(projectOverviewMessages.lastOpenedTitle)
    await expect(
      appWindow.locator(`[data-test-locator="${lastOpenedItemLocator(primaryDocumentId)}"]`)
    ).toBeVisible({ timeout: 15_000 })
    await expect(
      appWindow.locator(`[data-test-locator="${lastOpenedItemLocator(primaryDocumentId)}"]`)
    ).toContainText(OVERVIEW_CHART_E2E_DOC_LABEL)
    await expect(
      appWindow.locator(`[data-test-locator="${lastOpenedItemLocator(secondaryDocumentId)}"]`)
    ).toBeVisible({ timeout: 15_000 })
  })

  /**
   * Clicking a last-opened row opens that document in the workspace.
   */
  test('Click last-opened row opens the document', async () => {
    expect(primaryDocumentId.length).toBeGreaterThan(0)

    await appWindow.locator(
      `[data-test-locator="${lastOpenedItemLocator(primaryDocumentId)}"]`
    ).click()

    await expect.poll(() => {
      return appWindow.url()
    }, { timeout: 15_000 }).toContain(`/home/document/${primaryDocumentId}`)
    await expect(
      appWindow.locator('[data-test-locator="documentWorkspacePage-previewTitle"]')
    ).toHaveText(OVERVIEW_CHART_E2E_DOC_LABEL, { timeout: 15_000 })
  })

  /**
   * Middle-click opens another last-opened document without dropping the first tab.
   */
  test('Middle-click last-opened row opens a background tab', async () => {
    expect(primaryDocumentId.length).toBeGreaterThan(0)
    expect(secondaryDocumentId.length).toBeGreaterThan(0)

    await triggerGlobalShortcut(appWindow, FA_PLAYWRIGHT_PRESS_DEFAULT_SHOW_PROJECT_DASHBOARD)
    await expectFaPlaywrightE2eHashRoute(appWindow, '/home')
    await appWindow.waitForTimeout(OVERVIEW_RELOAD_SETTLE_MS)

    await appWindow.locator(
      `[data-test-locator="${lastOpenedItemLocator(secondaryDocumentId)}"]`
    ).click({
      button: 'middle'
    })

    await expect(
      appWindow.locator(`[data-test-locator="projectAppControlBar-tab-${secondaryDocumentId}"]`)
    ).toBeVisible({ timeout: 15_000 })
    await expect(
      appWindow.locator(`[data-test-locator="projectAppControlBar-tab-${primaryDocumentId}"]`)
    ).toBeVisible()
  })

  /**
   * Right-click last-opened row exposes document open/edit/copy/delete actions.
   */
  test('Last-opened context menu shows open edit copy and delete', async () => {
    expect(primaryDocumentId.length).toBeGreaterThan(0)

    await triggerGlobalShortcut(appWindow, FA_PLAYWRIGHT_PRESS_DEFAULT_SHOW_PROJECT_DASHBOARD)
    await expectFaPlaywrightE2eHashRoute(appWindow, '/home')
    await appWindow.waitForTimeout(OVERVIEW_RELOAD_SETTLE_MS)

    await appWindow.locator(
      `[data-test-locator="${lastOpenedItemLocator(primaryDocumentId)}"]`
    ).click({
      button: 'right'
    })

    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.contextOpenDocument}"]`)
    ).toBeVisible({ timeout: 15_000 })
    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.contextEditDocument}"]`)
    ).toBeVisible()
    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.contextCopyDocument}"]`)
    ).toBeVisible()
    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.contextDeleteDocument}"]`)
    ).toBeVisible()
  })
})
