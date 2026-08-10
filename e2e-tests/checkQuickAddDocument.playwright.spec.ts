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
  e2eSeedHierarchyPlacementWithDocuments
} from 'app/helpers/playwrightHelpers_e2e/e2eWorkspaceHierarchyTreeHelpers'
import {
  e2eSetNextProjectCreatePath,
  tryUnlinkE2eFaprojectFixture
} from 'app/helpers/playwrightHelpers_e2e/playwrightE2eProjectPaths'
import { FA_FRONTEND_RENDER_TIMER } from 'app/helpers/playwrightHelpers_universal/faPlaywrightElectronLaunchConstants'
import {
  getFaPlaywrightDefaultQuickNewDocumentPressString
} from 'app/helpers/playwrightHelpers_universal/faPlaywrightKeyboardChords'
import { tearDownFaPlaywrightElectronSerialSuite } from 'app/helpers/playwrightHelpers_universal/faPlaywrightSerialSuiteLifecycleTeardown'
import quickAddMessages from 'app/i18n/en-US/dialogs/L_dialogQuickAddDocument'

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
  closeButton: 'dialogQuickAddDocument-button-close',
  createBtn: 'dialogNewProject-button-create',
  nameInput: 'dialogNewProject-input-name',
  projectAppControlBar: 'projectAppControlBar',
  quickAddButton: 'projectAppControlBar-quickAddButton',
  splashNew: 'splashPage-btn-new',
  templateOption0: 'dialogQuickAddDocument-select-template-option-0',
  templateSelect: 'dialogQuickAddDocument-select-template',
  worldOption0: 'dialogQuickAddDocument-select-world-option-0',
  worldOption1: 'dialogQuickAddDocument-select-world-option-1',
  worldSelect: 'dialogQuickAddDocument-select-world',
  worldSeparatorAlt1: 'dialogQuickAddDocument-select-world-separatorAlt-1'
} as const

const QUICK_ADD_E2E_FAPROJECT = 'e2e-quick-add-document.faproject'
const QUICK_ADD_E2E_PROJECT_NAME = 'E2E Quick Add Document project'
const QUICK_ADD_HYDRATE_SETTLE_MS = 600

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
  await e2eSetNextProjectCreatePath(electronApplication, QUICK_ADD_E2E_FAPROJECT)
  await page.locator(`[data-test-locator="${selectorList.splashNew}"]`).click()
  await expect(page.locator(`[data-test-locator="${selectorList.nameInput}"]`)).toBeVisible()
  await page.locator(`[data-test-locator="${selectorList.nameInput}"]`).fill(QUICK_ADD_E2E_PROJECT_NAME)
  await page.locator(`[data-test-locator="${selectorList.createBtn}"]`).click()
  await e2eExpectFaActiveProjectStoreName(page, QUICK_ADD_E2E_PROJECT_NAME)
  await expectFaPlaywrightE2eHashRoute(page, '/home')
  // Empty layout may auto-hide the drawer; control bar still mounts in the workspace splitter.
  await expect(
    page.locator(`[data-test-locator="${selectorList.projectAppControlBar}"]`)
  ).toBeVisible({ timeout: 15_000 })
}

async function openQuickAddViaControlBar (page: Page): Promise<void> {
  await page.locator(`[data-test-locator="${selectorList.quickAddButton}"]`).click()
  await expect(page.locator('.q-dialog.dialogQuickAddDocument')).toBeVisible({ timeout: 15_000 })
  await expect(page.locator('#dialogQuickAddDocument-title')).toHaveText(quickAddMessages.title)
  await page.waitForTimeout(QUICK_ADD_HYDRATE_SETTLE_MS)
}

async function dismissPortaledSelectMenus (page: Page): Promise<void> {
  await page.keyboard.press('Escape')
  await page.waitForTimeout(200)
}

/**
 * Adds a second world with its own template placement without wiping the first world's layout.
 */
async function e2eSeedSecondWorldWithPlacement (page: Page): Promise<{
  templateId: string
  worldId: string
}> {
  return page.evaluate(async () => {
    const content = window.faContentBridgeAPIs?.projectContent
    if (content === undefined) {
      throw new Error('Project content bridge unavailable')
    }
    const worldsForSettings = await content.listWorldsForProjectSettings()
    const firstWorld = worldsForSettings.items[0]
    if (firstWorld === undefined) {
      throw new Error('No default world in E2E project')
    }
    const secondWorld = await content.createWorld({
      displayName: 'E2E Second World'
    })
    const secondTemplate = await content.createDocumentTemplate({
      displayName: 'E2E Place Template'
    })
    await content.saveDocumentTemplatesSnapshot([
      ...(await content.listDocumentTemplatesForProjectSettings()).items.map((template) => ({
        id: template.id,
        titlePluralTranslations: template.titlePluralTranslations,
        titleSingularTranslations: template.titleSingularTranslations,
        icon: template.icon,
        worldAppendixTranslations: template.worldAppendixTranslations
      })),
      {
        id: secondTemplate.id,
        titlePluralTranslations: { 'en-US': 'Places' },
        titleSingularTranslations: { 'en-US': 'Place' },
        icon: 'mdi-map-marker'
      }
    ])
    const secondPlacementId = crypto.randomUUID()
    await content.saveWorldsSnapshot([
      {
        id: firstWorld.id,
        displayNameTranslations: firstWorld.displayNameTranslations,
        color: firstWorld.color,
        colorPalette: firstWorld.colorPalette,
        templateLayout: {
          groups: firstWorld.templateLayout.groups.map((group) => ({
            id: group.id,
            displayName: group.displayName,
            displayNameTranslations: group.displayNameTranslations,
            rootSortOrder: group.rootSortOrder
          })),
          placements: firstWorld.templateLayout.placements.map((placement) => ({
            id: placement.id,
            documentTemplateId: placement.documentTemplateId,
            groupId: placement.groupId,
            rootSortOrder: placement.rootSortOrder,
            groupSortOrder: placement.groupSortOrder,
            nickname: placement.nickname,
            nicknamePluralTranslations: placement.nicknamePluralTranslations,
            nicknameSingularTranslations: placement.nicknameSingularTranslations
          }))
        }
      },
      {
        id: secondWorld.id,
        displayNameTranslations: { 'en-US': 'E2E Second World' },
        color: '#2196f3',
        colorPalette: '',
        templateLayout: {
          groups: [],
          placements: [{
            id: secondPlacementId,
            documentTemplateId: secondTemplate.id,
            groupId: null,
            rootSortOrder: 0,
            groupSortOrder: null,
            nickname: 'Places',
            nicknamePluralTranslations: { 'en-US': 'Places' },
            nicknameSingularTranslations: { 'en-US': 'Place' }
          }]
        }
      }
    ])
    return {
      templateId: secondTemplate.id,
      worldId: secondWorld.id
    }
  })
}

test.describe.serial('Quick Add Document E2E', () => {
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
        tryUnlinkE2eFaprojectFixture(QUICK_ADD_E2E_FAPROJECT)
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
   * Control bar Quick Add opens the dialog; single-world layout hides the world select.
   */
  test('Open Quick Add from control bar hides world select for a single world', async () => {
    await createE2eProjectOnHome(appWindow, electronApp)
    await e2eSeedHierarchyPlacementWithDocuments(appWindow, {
      documents: [],
      templateDisplayName: 'E2E Hero Template',
      templatePluralTitle: 'Heroes',
      templateSingularTitle: 'Hero'
    })

    await openQuickAddViaControlBar(appWindow)

    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.worldSelect}"]`)
    ).toHaveCount(0)
    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.templateSelect}"]`)
    ).toHaveCount(1)
    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.templateOption0}"]`)
    ).toContainText('Heroes', { timeout: 15_000 })
  })

  /**
   * Picking a template creates a temporary opened document and dismisses Quick Add.
   */
  test('Pick template creates a temporary document and closes Quick Add', async () => {
    await expect(appWindow.locator('.q-dialog.dialogQuickAddDocument')).toBeVisible()
    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.templateOption0}"]`)
    ).toBeVisible({ timeout: 15_000 })

    await appWindow.locator(
      `[data-test-locator="${selectorList.templateOption0}"]`
    ).click()

    await expect(appWindow.locator('.q-dialog.dialogQuickAddDocument')).toBeHidden({
      timeout: 15_000
    })
    // Temporary docs open in edit mode — name field, not preview title.
    const nameInput = appWindow.locator('[data-test-locator="documentWorkspacePage-nameInput"]')
    await expect(nameInput).toBeVisible({ timeout: 15_000 })
    await expect(nameInput).toHaveValue(/New hero/i)
  })

  /**
   * Close dismisses Quick Add without creating another document.
   */
  test('Close button dismisses Quick Add opened via keybind', async () => {
    await triggerGlobalShortcut(
      appWindow,
      getFaPlaywrightDefaultQuickNewDocumentPressString()
    )
    await expect(appWindow.locator('.q-dialog.dialogQuickAddDocument')).toBeVisible({
      timeout: 15_000
    })
    await appWindow.waitForTimeout(QUICK_ADD_HYDRATE_SETTLE_MS)

    await dismissPortaledSelectMenus(appWindow)
    await appWindow.locator(`[data-test-locator="${selectorList.closeButton}"]`).click()
    await expect(appWindow.locator('.q-dialog.dialogQuickAddDocument')).toBeHidden({
      timeout: 15_000
    })
  })

  /**
   * Two worlds show the world select with separatorAlt between options.
   */
  test('Multi-world layout shows world select with separatorAlt', async () => {
    const seeded = await e2eSeedSecondWorldWithPlacement(appWindow)
    expect(seeded.worldId.length).toBeGreaterThan(0)

    await openQuickAddViaControlBar(appWindow)

    const worldSelect = appWindow.locator(`[data-test-locator="${selectorList.worldSelect}"]`)
    await expect(worldSelect).toHaveCount(1)
    await worldSelect.click()
    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.worldOption1}"]`)
    ).toBeVisible({ timeout: 15_000 })
    await expect(
      appWindow.locator(`[data-test-locator-separator-alt="${selectorList.worldSeparatorAlt1}"]`)
    ).toHaveCount(1)

    await dismissPortaledSelectMenus(appWindow)
    await appWindow.locator(`[data-test-locator="${selectorList.closeButton}"]`).click()
    await expect(appWindow.locator('.q-dialog.dialogQuickAddDocument')).toBeHidden({
      timeout: 15_000
    })
  })

  /**
   * Switching to the second world and picking its template creates a temporary document.
   */
  test('Multi-world switch and template pick creates a temporary document', async () => {
    await openQuickAddViaControlBar(appWindow)

    const worldSelect = appWindow.locator(`[data-test-locator="${selectorList.worldSelect}"]`)
    await expect(worldSelect).toHaveCount(1)
    await worldSelect.click()
    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.worldOption1}"]`)
    ).toBeVisible({ timeout: 15_000 })
    await appWindow.locator(`[data-test-locator="${selectorList.worldOption1}"]`).click()
    await appWindow.waitForTimeout(QUICK_ADD_HYDRATE_SETTLE_MS)

    const templateOption0 = appWindow.locator(
      `[data-test-locator="${selectorList.templateOption0}"]`
    )
    await expect(templateOption0).toBeVisible({ timeout: 15_000 })
    await expect(templateOption0).toContainText('Places')
    await templateOption0.click()

    await expect(appWindow.locator('.q-dialog.dialogQuickAddDocument')).toBeHidden({
      timeout: 15_000
    })
    const nameInput = appWindow.locator('[data-test-locator="documentWorkspacePage-nameInput"]')
    await expect(nameInput).toBeVisible({ timeout: 15_000 })
    await expect(nameInput).toHaveValue(/New place/i)
  })

  /**
   * Re-clicking the already-selected world reopens the template popup.
   */
  test('Re-clicking the current world reopens the template menu', async () => {
    await triggerGlobalShortcut(
      appWindow,
      getFaPlaywrightDefaultQuickNewDocumentPressString()
    )
    await expect(appWindow.locator('.q-dialog.dialogQuickAddDocument')).toBeVisible({
      timeout: 15_000
    })
    await appWindow.waitForTimeout(QUICK_ADD_HYDRATE_SETTLE_MS)

    const templateOption0 = appWindow.locator(
      `[data-test-locator="${selectorList.templateOption0}"]`
    )
    await expect(templateOption0).toBeVisible({ timeout: 15_000 })
    await dismissPortaledSelectMenus(appWindow)
    await expect(templateOption0).toBeHidden({ timeout: 15_000 })

    const worldSelect = appWindow.locator(`[data-test-locator="${selectorList.worldSelect}"]`)
    await worldSelect.click()
    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.worldOption0}"]`)
    ).toBeVisible({ timeout: 15_000 })
    await appWindow.locator(`[data-test-locator="${selectorList.worldOption0}"]`).click()
    await appWindow.waitForTimeout(QUICK_ADD_HYDRATE_SETTLE_MS)

    await expect(templateOption0).toBeVisible({ timeout: 15_000 })

    await dismissPortaledSelectMenus(appWindow)
    await appWindow.locator(`[data-test-locator="${selectorList.closeButton}"]`).click()
    await expect(appWindow.locator('.q-dialog.dialogQuickAddDocument')).toBeHidden({
      timeout: 15_000
    })
  })
})
