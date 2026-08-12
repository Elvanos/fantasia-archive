import type { ElectronApplication, Page } from 'playwright'
import { expect, test } from '@playwright/test'
import type { TestInfo } from '@playwright/test'
import {
  e2eExpectFaActiveProjectStoreName
} from 'app/helpers/playwrightHelpers_e2e/e2eExpectFaActiveProjectStore'
import { launchFaPlaywrightE2eAppWindow } from 'app/helpers/playwrightHelpers_e2e/faPlaywrightE2eAppLifecycle'
import {
  expectFaPlaywrightE2eHashRoute,
  readFaPlaywrightE2eHashRoute
} from 'app/helpers/playwrightHelpers_e2e/faPlaywrightE2eAppShellAssertions'
import {
  navigateFaPlaywrightE2eToSplashRoute
} from 'app/helpers/playwrightHelpers_e2e/faPlaywrightE2eNavigateHome'
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
  FA_PLAYWRIGHT_PRESS_DEFAULT_QUICK_EXISTING_DOCUMENT,
  FA_PLAYWRIGHT_PRESS_DEFAULT_TOGGLE_HIERARCHICAL_TREE
} from 'app/helpers/playwrightHelpers_universal/faPlaywrightKeyboardChords'
import { tearDownFaPlaywrightElectronSerialSuite } from 'app/helpers/playwrightHelpers_universal/faPlaywrightSerialSuiteLifecycleTeardown'
import documentsMenuMessages from 'app/i18n/en-US/components/globals/AppControlMenus/L_documents'
import quickSearchMessages from 'app/i18n/en-US/dialogs/L_dialogQuickSearchDocument'

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
  closeButton: 'dialogQuickSearchDocument-button-close',
  createBtn: 'dialogNewProject-button-create',
  documentFilter: 'dialogQuickSearchDocument-select-document-filter',
  documentOption0: 'dialogQuickSearchDocument-select-document-option-0',
  documentSelect: 'dialogQuickSearchDocument-select-document',
  nameInput: 'dialogNewProject-input-name',
  projectAppControlBar: 'projectAppControlBar',
  previewTitle: 'documentWorkspacePage-previewTitle',
  quickSearchButton: 'projectAppControlBar-quickSearchButton',
  splashNew: 'splashPage-btn-new',
  worldSelect: 'dialogQuickSearchDocument-select-world'
} as const

const QUICK_SEARCH_E2E_FAPROJECT = 'e2e-quick-search-document.faproject'
const QUICK_SEARCH_E2E_PROJECT_NAME = 'E2E Quick Search Document project'
const QUICK_SEARCH_HYDRATE_SETTLE_MS = 600
const DOC_LABEL_ARIA = 'E2E Aria'
const DOC_LABEL_BORIS = 'E2E Boris'

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

async function createE2eProjectOnHome (
  page: Page,
  electronApplication: ElectronApplication
): Promise<void> {
  await navigateFaPlaywrightE2eToSplashRoute(page)
  await e2eSetNextProjectCreatePath(electronApplication, QUICK_SEARCH_E2E_FAPROJECT)
  await page.locator(`[data-test-locator="${selectorList.splashNew}"]`).click()
  await expect(page.locator(`[data-test-locator="${selectorList.nameInput}"]`)).toBeVisible()
  await page.locator(`[data-test-locator="${selectorList.nameInput}"]`).fill(QUICK_SEARCH_E2E_PROJECT_NAME)
  await page.locator(`[data-test-locator="${selectorList.createBtn}"]`).click()
  await e2eExpectFaActiveProjectStoreName(page, QUICK_SEARCH_E2E_PROJECT_NAME)
  await expectFaPlaywrightE2eHashRoute(page, '/home')
  await expect(
    page.locator(`[data-test-locator="${selectorList.projectAppControlBar}"]`)
  ).toBeVisible({ timeout: 15_000 })
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

async function openQuickSearchViaControlBar (page: Page): Promise<void> {
  await page.locator(`[data-test-locator="${selectorList.quickSearchButton}"]`).click()
  await expect(page.locator('.q-dialog.dialogQuickSearchDocument')).toBeVisible({ timeout: 15_000 })
  await expect(page.locator('#dialogQuickSearchDocument-title')).toHaveText(quickSearchMessages.title)
  await page.waitForTimeout(QUICK_SEARCH_HYDRATE_SETTLE_MS)
}

async function dismissPortaledSelectMenus (page: Page): Promise<void> {
  await page.keyboard.press('Escape')
  await page.waitForTimeout(200)
}

async function readOpenedDocumentTabIds (page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const root = document.querySelector('#q-app') as HTMLElement & {
      __vue_app__?: {
        config: {
          globalProperties: {
            $pinia?: {
              _s: Map<string, {
                tabs?: Array<{ documentId: string }>
              }>
            }
          }
        }
      }
    }
    const store = root?.__vue_app__?.config.globalProperties.$pinia?._s?.get('S_FaOpenedDocuments')
    return [...(store?.tabs ?? [])].map((tab) => tab.documentId)
  })
}

test.describe.serial('Quick Search Document E2E', () => {
  let electronApp: ElectronApplication
  let appWindow: Page
  let suiteTestInfo: TestInfo
  let seededDocAriaId = ''
  let seededDocBorisId = ''

  test.describe.configure({
    timeout: 180_000
  })

  test.beforeAll(async ({}, testInfo) => {
    suiteTestInfo = testInfo
    const launched = await launchFaPlaywrightE2eAppWindow({
      afterIsolationResetBeforeLaunch (): void {
        tryUnlinkE2eFaprojectFixture(QUICK_SEARCH_E2E_FAPROJECT)
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
   * Control bar Quick Search opens the dialog; single-world layout hides the world select.
   */
  test('Open Quick Search from control bar hides world select for a single world', async () => {
    await createE2eProjectOnHome(appWindow, electronApp)
    const seeded = await e2eSeedHierarchyPlacementWithDocuments(appWindow, {
      documents: [
        { displayName: DOC_LABEL_ARIA },
        { displayName: DOC_LABEL_BORIS }
      ],
      templateDisplayName: 'E2E Hero Template',
      templatePluralTitle: 'Heroes',
      templateSingularTitle: 'Hero'
    })
    const aria = seeded.documents.find((row) => row.displayName === DOC_LABEL_ARIA)
    const boris = seeded.documents.find((row) => row.displayName === DOC_LABEL_BORIS)
    expect(aria?.id.length).toBeGreaterThan(0)
    expect(boris?.id.length).toBeGreaterThan(0)
    seededDocAriaId = aria?.id ?? ''
    seededDocBorisId = boris?.id ?? ''

    // Load document nodes into hierarchy treeData so openHierarchyTreeDocument can resolve them.
    await ensureHierarchyTreeDocumentNodesLoaded(appWindow)

    await openQuickSearchViaControlBar(appWindow)

    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.worldSelect}"]`)
    ).toHaveCount(0)
    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.documentSelect}"]`)
    ).toHaveCount(1)
  })

  /**
   * Filtering by name and left-click opens the document workspace route and closes Quick Search.
   */
  test('Search and left-click opens the document and closes Quick Search', async () => {
    await expect(appWindow.locator('.q-dialog.dialogQuickSearchDocument')).toBeVisible()

    const documentFilter = appWindow.locator(
      `[data-test-locator-filter="${selectorList.documentFilter}"]`
    )
    const documentOption0 = appWindow.locator(
      `[data-test-locator="${selectorList.documentOption0}"]`
    )
    await expect(documentFilter).toHaveCount(1)
    await documentFilter.click()
    await documentFilter.fill('Aria')
    await expect(documentOption0).toBeVisible({ timeout: 15_000 })
    await expect(documentOption0).toContainText(DOC_LABEL_ARIA)

    await documentOption0.click()
    await expect(appWindow.locator('.q-dialog.dialogQuickSearchDocument')).toBeHidden({
      timeout: 15_000
    })
    await expect.poll(() => {
      return readFaPlaywrightE2eHashRoute(appWindow.url())
    }, { timeout: 15_000 }).toBe(`/home/document/${seededDocAriaId}`)
    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.previewTitle}"]`)
    ).toContainText(DOC_LABEL_ARIA, { timeout: 15_000 })
  })

  /**
   * Default quickExistingDocument chord is literal Control+Q on every host OS.
   */
  test('Control+Q opens Quick Search then Close dismisses it', async () => {
    await triggerGlobalShortcut(
      appWindow,
      FA_PLAYWRIGHT_PRESS_DEFAULT_QUICK_EXISTING_DOCUMENT
    )
    await expect(appWindow.locator('.q-dialog.dialogQuickSearchDocument')).toBeVisible({
      timeout: 15_000
    })
    await appWindow.waitForTimeout(QUICK_SEARCH_HYDRATE_SETTLE_MS)

    await dismissPortaledSelectMenus(appWindow)
    await appWindow.locator(`[data-test-locator="${selectorList.closeButton}"]`).click()
    await expect(appWindow.locator('.q-dialog.dialogQuickSearchDocument')).toBeHidden({
      timeout: 15_000
    })
  })

  /**
   * Content menu Quick-Search Existing Document opens the same dialog.
   */
  test('Content menu Quick-Search Existing Document opens Quick Search', async () => {
    await appWindow.getByRole('button', {
      exact: true,
      name: documentsMenuMessages.title
    }).click()
    await appWindow.getByText(documentsMenuMessages.items.quickSearchDocument, {
      exact: true
    }).click()
    await expect(appWindow.locator('.q-dialog.dialogQuickSearchDocument')).toBeVisible({
      timeout: 15_000
    })
    await expect(appWindow.locator('#dialogQuickSearchDocument-title')).toHaveText(
      quickSearchMessages.title
    )
    await appWindow.waitForTimeout(QUICK_SEARCH_HYDRATE_SETTLE_MS)

    await dismissPortaledSelectMenus(appWindow)
    await appWindow.locator(`[data-test-locator="${selectorList.closeButton}"]`).click()
    await expect(appWindow.locator('.q-dialog.dialogQuickSearchDocument')).toBeHidden({
      timeout: 15_000
    })
  })

  /**
   * Middle-click appends a background tab and keeps the prior document route.
   */
  test('Middle-click option appends a background tab without changing the route', async () => {
    await expectFaPlaywrightE2eHashRoute(appWindow, `/home/document/${seededDocAriaId}`)

    await openQuickSearchViaControlBar(appWindow)

    const documentFilter = appWindow.locator(
      `[data-test-locator-filter="${selectorList.documentFilter}"]`
    )
    const documentOption0 = appWindow.locator(
      `[data-test-locator="${selectorList.documentOption0}"]`
    )
    await documentFilter.click()
    await documentFilter.fill('Boris')
    await expect(documentOption0).toBeVisible({ timeout: 15_000 })
    await expect(documentOption0).toContainText(DOC_LABEL_BORIS)

    await documentOption0.click({ button: 'middle' })
    await expect(appWindow.locator('.q-dialog.dialogQuickSearchDocument')).toBeVisible({
      timeout: 15_000
    })
    await expectFaPlaywrightE2eHashRoute(appWindow, `/home/document/${seededDocAriaId}`)
    await expect.poll(async () => {
      const tabIds = await readOpenedDocumentTabIds(appWindow)
      return tabIds.includes(seededDocBorisId)
    }, { timeout: 15_000 }).toBe(true)

    await dismissPortaledSelectMenus(appWindow)
    await appWindow.locator(`[data-test-locator="${selectorList.closeButton}"]`).click()
    await expect(appWindow.locator('.q-dialog.dialogQuickSearchDocument')).toBeHidden({
      timeout: 15_000
    })
  })
})
