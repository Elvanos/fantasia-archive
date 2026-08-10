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
  e2eSeedHierarchyPlacementWithDocuments
} from 'app/helpers/playwrightHelpers_e2e/e2eWorkspaceHierarchyTreeHelpers'
import {
  e2eSetNextProjectCreatePath,
  tryUnlinkE2eFaprojectFixture
} from 'app/helpers/playwrightHelpers_e2e/playwrightE2eProjectPaths'
import { FA_FRONTEND_RENDER_TIMER } from 'app/helpers/playwrightHelpers_universal/faPlaywrightElectronLaunchConstants'
import { FA_PLAYWRIGHT_PRESS_DEFAULT_SHOW_PROJECT_DASHBOARD } from 'app/helpers/playwrightHelpers_universal/faPlaywrightKeyboardChords'
import { tearDownFaPlaywrightElectronSerialSuite } from 'app/helpers/playwrightHelpers_universal/faPlaywrightSerialSuiteLifecycleTeardown'
import projectOverviewMessages from 'app/i18n/en-US/components/projectUI/ProjectOverview/L_projectOverview'

/**
 * Extra env settings to trigger E2E via Playwright (isolated userData).
 */
const extraEnvSettings = {
  TEST_ENV: 'e2e' as const
}

const selectorList = {
  createBtn: 'dialogNewProject-button-create',
  emptyCta: 'projectOverview-emptyCta',
  emptyCtaButton: 'projectOverview-emptyCtaButton',
  emptyCtaWelcome: 'projectOverview-emptyCtaWelcome',
  nameInput: 'dialogNewProject-input-name',
  projectAppControlBar: 'projectAppControlBar',
  projectOverview: 'projectOverview',
  projectSettingsTabDocumentTemplates: 'dialogProjectSettings-tab-documentTemplatesSettings',
  projectSettingsTabWorlds: 'dialogProjectSettings-tab-worldsSettings',
  projectSettingsTitle: 'dialogProjectSettings-title',
  splashNew: 'splashPage-btn-new'
} as const

const OVERVIEW_EMPTY_CTA_FAPROJECT = 'e2e-project-overview-empty-cta.faproject'
const OVERVIEW_EMPTY_CTA_PROJECT_NAME = 'E2E overview empty CTA'
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

async function remountProjectOverviewOnHome (page: Page): Promise<void> {
  await gotoFaPlaywrightE2eNonexistentRouteFor404(page)
  await triggerGlobalShortcut(page, FA_PLAYWRIGHT_PRESS_DEFAULT_SHOW_PROJECT_DASHBOARD)
  await expectFaPlaywrightE2eHashRoute(page, '/home')
  await page.waitForTimeout(OVERVIEW_RELOAD_SETTLE_MS)
}

async function createE2eProjectOnHome (
  page: Page,
  electronApplication: ElectronApplication
): Promise<void> {
  await navigateFaPlaywrightE2eToSplashRoute(page)
  await e2eSetNextProjectCreatePath(electronApplication, OVERVIEW_EMPTY_CTA_FAPROJECT)
  await page.locator(`[data-test-locator="${selectorList.splashNew}"]`).click()
  await expect(page.locator(`[data-test-locator="${selectorList.nameInput}"]`)).toBeVisible()
  await page.locator(`[data-test-locator="${selectorList.nameInput}"]`).fill(
    OVERVIEW_EMPTY_CTA_PROJECT_NAME
  )
  await page.locator(`[data-test-locator="${selectorList.createBtn}"]`).click()
  await e2eExpectFaActiveProjectStoreName(page, OVERVIEW_EMPTY_CTA_PROJECT_NAME)
  await expectFaPlaywrightE2eHashRoute(page, '/home')
  await expect(
    page.locator(`[data-test-locator="${selectorList.projectAppControlBar}"]`)
  ).toBeVisible({ timeout: 15_000 })
}

async function seedTemplateWithoutPlacement (page: Page): Promise<void> {
  await page.evaluate(async () => {
    const content = window.faContentBridgeAPIs?.projectContent
    if (content === undefined) {
      throw new Error('Project content bridge unavailable')
    }
    const template = await content.createDocumentTemplate({
      displayName: 'E2E Unassigned Template'
    })
    await content.saveDocumentTemplatesSnapshot([{
      id: template.id,
      titlePluralTranslations: { 'en-US': 'Places' },
      titleSingularTranslations: { 'en-US': 'Place' },
      icon: 'mdi-map-marker'
    }])
  })
}

test.describe.serial('Project Overview empty CTA E2E', () => {
  let electronApp: ElectronApplication
  let appWindow: Page
  let suiteTestInfo: TestInfo

  test.describe.configure({
    timeout: 180_000
  })

  test.beforeAll(async ({}, testInfo) => {
    suiteTestInfo = testInfo
    const launched = await launchFaPlaywrightE2eAppWindow({
      afterIsolationResetBeforeLaunch (): void {
        tryUnlinkE2eFaprojectFixture(OVERVIEW_EMPTY_CTA_FAPROJECT)
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
   * Fresh project with no templates shows createTemplate empty CTA → Project Settings templates.
   */
  test('Empty CTA createTemplate opens Project Settings templates tab', async () => {
    await createE2eProjectOnHome(appWindow, electronApp)
    await remountProjectOverviewOnHome(appWindow)

    const emptyCta = appWindow.locator(`[data-test-locator="${selectorList.emptyCta}"]`)
    await expect(emptyCta).toBeVisible({ timeout: 15_000 })
    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.emptyCtaWelcome}"]`)
    ).toHaveText(projectOverviewMessages.emptyCtaWelcome)
    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.emptyCtaButton}"]`)
    ).toHaveText(projectOverviewMessages.emptyCtaCreateDocumentTemplate)

    await appWindow.locator(`[data-test-locator="${selectorList.emptyCtaButton}"]`).click()
    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.projectSettingsTitle}"]`)
    ).toBeVisible({ timeout: 15_000 })
    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.projectSettingsTabDocumentTemplates}"]`)
    ).toHaveClass(/q-tab--active/)
  })

  /**
   * Templates without placements show assignTemplate empty CTA → Project Settings worlds.
   */
  test('Empty CTA assignTemplate opens Project Settings worlds tab', async () => {
    await appWindow.keyboard.press('Escape')
    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.projectSettingsTitle}"]`)
    ).toBeHidden({ timeout: 15_000 })

    await seedTemplateWithoutPlacement(appWindow)
    await remountProjectOverviewOnHome(appWindow)

    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.emptyCtaButton}"]`)
    ).toHaveText(projectOverviewMessages.emptyCtaAssignTemplate, { timeout: 15_000 })
    await appWindow.locator(`[data-test-locator="${selectorList.emptyCtaButton}"]`).click()

    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.projectSettingsTitle}"]`)
    ).toBeVisible({ timeout: 15_000 })
    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.projectSettingsTabWorlds}"]`)
    ).toHaveClass(/q-tab--active/)
  })

  /**
   * Placements with zero documents show createDocument empty CTA → Quick Add.
   */
  test('Empty CTA createDocument opens Quick Add dialog', async () => {
    await appWindow.keyboard.press('Escape')
    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.projectSettingsTitle}"]`)
    ).toBeHidden({ timeout: 15_000 })

    await e2eSeedHierarchyPlacementWithDocuments(appWindow, {
      documents: [],
      templateDisplayName: 'E2E Empty CTA Characters',
      templatePluralTitle: 'Characters',
      templateSingularTitle: 'Character'
    })
    await remountProjectOverviewOnHome(appWindow)

    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.emptyCtaButton}"]`)
    ).toHaveText(projectOverviewMessages.emptyCtaCreateDocument, { timeout: 15_000 })
    await appWindow.locator(`[data-test-locator="${selectorList.emptyCtaButton}"]`).click()

    await expect(appWindow.locator('.q-dialog.dialogQuickAddDocument')).toBeVisible({
      timeout: 15_000
    })
  })
})
