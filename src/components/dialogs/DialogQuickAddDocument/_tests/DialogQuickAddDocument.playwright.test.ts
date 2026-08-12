import type { ElectronApplication, Page } from 'playwright'
import { expect, test } from '@playwright/test'
import type { TestInfo } from '@playwright/test'
import { launchFaPlaywrightComponentHarnessWindow } from 'app/helpers/playwrightHelpers_component/faPlaywrightComponentHarnessLifecycle'
import { patchFaPlaywrightComponentHarnessStores } from 'app/helpers/playwrightHelpers_component/faPlaywrightComponentHarnessPiniaSeed'
import { FA_FRONTEND_RENDER_TIMER } from 'app/helpers/playwrightHelpers_universal/faPlaywrightElectronLaunchConstants'
import { tearDownFaPlaywrightElectronSerialSuite } from 'app/helpers/playwrightHelpers_universal/faPlaywrightSerialSuiteLifecycleTeardown'
import quickAddMessages from 'app/i18n/en-US/dialogs/L_dialogQuickAddDocument'
import type {
  I_dialogQuickAddDocumentTemplateSource,
  I_dialogQuickAddDocumentWorldSource
} from 'app/types/I_dialogQuickAddDocument'
import type { I_faComponentTestingStoreSeed } from 'app/types/I_faComponentTestingStoreSeed'
import type { I_faProjectDocumentTemplate } from 'app/types/I_faProjectDocumentTemplateDomain'
import type { I_faProjectWorld } from 'app/types/I_faProjectWorldDomain'
import type { T_dialogName } from 'app/types/T_appDialogsAndDocuments'

/**
 * Extra env settings to trigger component testing via Playwright
 */
const extraEnvSettings = {
  COMPONENT_NAME: 'DialogQuickAddDocument',
  COMPONENT_PROPS: JSON.stringify({}),
  TEST_ENV: 'components' as const
}

/**
 * Buffer so the component-testing shell finishes rendering before assertions.
 * - Tune this constant only when this spec needs a different wait.
 */
const faFrontendRenderTimer: number = FA_FRONTEND_RENDER_TIMER

/**
 * FA_DIALOG_QUICK_ADD_DOCUMENT_TEMPLATE_FOCUS_MS is 100; allow Electron paint slack after hydrate + showPopup.
 * Enter reselect also waits QMenu transition (~350ms) before dual template openPopup.
 */
const quickAddHydrateSettleMs = 900

/**
 * Object of string data selectors for the component
 */
const selectorList = {
  closeButton: 'dialogQuickAddDocument-button-close',
  templateFilter: 'dialogQuickAddDocument-select-template-filter',
  templateOption0: 'dialogQuickAddDocument-select-template-option-0',
  templateOption1: 'dialogQuickAddDocument-select-template-option-1',
  templateSelect: 'dialogQuickAddDocument-select-template',
  templateSeparatorAlt1: 'dialogQuickAddDocument-select-template-separatorAlt-1',
  worldOption0: 'dialogQuickAddDocument-select-world-option-0',
  worldOption1: 'dialogQuickAddDocument-select-world-option-1',
  worldSelect: 'dialogQuickAddDocument-select-world',
  worldSeparatorAlt1: 'dialogQuickAddDocument-select-world-separatorAlt-1'
} as const

const quickAddDirectInput: T_dialogName = 'QuickAddDocument'

const WORLD_ID_A = '550e8400-e29b-41d4-a716-4466554400a1'
const WORLD_ID_B = '550e8400-e29b-41d4-a716-4466554400a2'
const TEMPLATE_ID_HERO = '7c9e6679-7425-40de-944b-e07fc1f90ae1'
const TEMPLATE_ID_PLACE = '7c9e6679-7425-40de-944b-e07fc1f90ae2'

const sampleActiveProject = {
  filePath: 'C:\\Playwright\\quick-add-document.faproject',
  id: 'playwright-quick-add-project-id',
  name: 'Playwright Quick Add Project'
} as const

const sampleWorldA: I_faProjectWorld = {
  color: '#4caf50',
  colorPalette: '',
  createdAtMs: 1,
  displayName: 'Eldoria',
  displayNameTranslations: { 'en-US': 'Eldoria' },
  id: WORLD_ID_A,
  sortOrder: 0,
  updatedAtMs: 1
}

const sampleWorldB: I_faProjectWorld = {
  color: '#2196f3',
  colorPalette: '',
  createdAtMs: 1,
  displayName: 'Aurelion',
  displayNameTranslations: { 'en-US': 'Aurelion' },
  id: WORLD_ID_B,
  sortOrder: 1,
  updatedAtMs: 1
}

const sampleTemplateHero: I_faProjectDocumentTemplate = {
  createdAtMs: 1,
  displayName: 'Hero',
  icon: 'mdi-account',
  id: TEMPLATE_ID_HERO,
  sortOrder: 0,
  titlePluralTranslations: { 'en-US': 'Heroes' },
  titleSingularTranslations: { 'en-US': 'Hero' },
  updatedAtMs: 1,
  worldAppendix: '',
  worldAppendixTranslations: {}
}

const sampleTemplatePlace: I_faProjectDocumentTemplate = {
  createdAtMs: 1,
  displayName: 'Place',
  icon: 'mdi-map-marker',
  id: TEMPLATE_ID_PLACE,
  sortOrder: 1,
  titlePluralTranslations: { 'en-US': 'Places' },
  titleSingularTranslations: { 'en-US': 'Place' },
  updatedAtMs: 1,
  worldAppendix: '',
  worldAppendixTranslations: {}
}

type T_quickAddSourcesFixture = {
  templates: I_dialogQuickAddDocumentTemplateSource[]
  worlds: I_dialogQuickAddDocumentWorldSource[]
}

function buildWorldSource (input: {
  color: string
  displayName: string
  id: string
  placements: I_dialogQuickAddDocumentWorldSource['templateLayout']['placements']
  sortOrder: number
}): I_dialogQuickAddDocumentWorldSource {
  return {
    color: input.color,
    displayNameTranslations: { 'en-US': input.displayName },
    id: input.id,
    sortOrder: input.sortOrder,
    templateLayout: {
      groups: [],
      placements: [...input.placements]
    }
  }
}

function buildTemplateSource (
  template: I_faProjectDocumentTemplate
): I_dialogQuickAddDocumentTemplateSource {
  return {
    icon: template.icon,
    id: template.id,
    titlePluralTranslations: { ...template.titlePluralTranslations },
    titleSingularTranslations: { ...template.titleSingularTranslations }
  }
}

const singleWorldFixture: T_quickAddSourcesFixture = {
  templates: [
    buildTemplateSource(sampleTemplateHero),
    buildTemplateSource(sampleTemplatePlace)
  ],
  worlds: [
    buildWorldSource({
      color: sampleWorldA.color,
      displayName: 'Eldoria',
      id: WORLD_ID_A,
      placements: [
        {
          documentTemplateId: TEMPLATE_ID_HERO,
          groupId: null,
          groupSortOrder: null,
          rootSortOrder: 0
        },
        {
          documentTemplateId: TEMPLATE_ID_PLACE,
          groupId: null,
          groupSortOrder: null,
          rootSortOrder: 1
        }
      ],
      sortOrder: 0
    })
  ]
}

const twoWorldsFixture: T_quickAddSourcesFixture = {
  templates: [
    buildTemplateSource(sampleTemplateHero),
    buildTemplateSource(sampleTemplatePlace)
  ],
  worlds: [
    buildWorldSource({
      color: sampleWorldA.color,
      displayName: 'Eldoria',
      id: WORLD_ID_A,
      placements: [{
        documentTemplateId: TEMPLATE_ID_HERO,
        groupId: null,
        groupSortOrder: null,
        rootSortOrder: 0
      }],
      sortOrder: 0
    }),
    buildWorldSource({
      color: sampleWorldB.color,
      displayName: 'Aurelion',
      id: WORLD_ID_B,
      placements: [{
        documentTemplateId: TEMPLATE_ID_PLACE,
        groupId: null,
        groupSortOrder: null,
        rootSortOrder: 0
      }],
      sortOrder: 1
    })
  ]
}

const defaultStoreSeed: I_faComponentTestingStoreSeed = {
  activeProject: { ...sampleActiveProject },
  openedDocuments: {
    activeDocumentId: null,
    tabs: []
  },
  projectContentOverrides: {
    templatesById: {
      [TEMPLATE_ID_HERO]: sampleTemplateHero,
      [TEMPLATE_ID_PLACE]: sampleTemplatePlace
    },
    worldsById: {
      [WORLD_ID_A]: sampleWorldA,
      [WORLD_ID_B]: sampleWorldB
    }
  }
}

/**
 * Seeds Quick Add hydrate sources via renderer probe.
 * contextBridge freezes projectContent list methods, so page.evaluate assign cannot replace IPC.
 */
async function seedQuickAddDocumentSourcesProbe (
  page: Page,
  fixture: T_quickAddSourcesFixture
): Promise<void> {
  await page.evaluate((payload) => {
    window.__faComponentTestingQuickAddDocumentSources = payload
  }, fixture)
}

async function replaceComponentTestingPath (page: Page, path: string): Promise<void> {
  await page.evaluate(async (routePath) => {
    const root = document.querySelector('#q-app') as HTMLElement & {
      __vue_app__?: {
        config: {
          globalProperties: {
            $router: {
              replace: (location: { path: string }) => Promise<void>
            }
          }
        }
      }
    }
    const router = root?.__vue_app__?.config.globalProperties.$router
    if (router === undefined) {
      throw new Error('Vue router missing in component harness')
    }
    await router.replace({ path: routePath })
  }, path)
}

async function reopenQuickAddViaDialogStore (page: Page): Promise<void> {
  await page.evaluate(() => {
    const root = document.querySelector('#q-app') as HTMLElement & {
      __vue_app__?: {
        config: {
          globalProperties: {
            $pinia?: {
              _s: Map<string, {
                dialogToOpen: string
                generateDialogUUID: () => void
              }>
            }
          }
        }
      }
    }
    const store = root?.__vue_app__?.config.globalProperties.$pinia?._s?.get('S_DialogComponent')
    if (store === undefined) {
      throw new Error('S_DialogComponent missing in component harness')
    }
    store.dialogToOpen = 'QuickAddDocument'
    store.generateDialogUUID()
  })
}

async function installCreateTemporaryDocumentSpy (page: Page): Promise<void> {
  await page.evaluate(() => {
    const root = document.querySelector('#q-app') as HTMLElement & {
      __vue_app__?: {
        config: {
          globalProperties: {
            $pinia?: {
              _s: Map<string, {
                createTemporaryDocument: (input: {
                  displayName: string
                  templateId: string
                  worldId: string
                }) => Promise<string>
              }>
            }
          }
        }
      }
    }
    const store = root?.__vue_app__?.config.globalProperties.$pinia?._s?.get('S_FaOpenedDocuments')
    if (store === undefined) {
      throw new Error('S_FaOpenedDocuments missing in component harness')
    }
    const original = store.createTemporaryDocument.bind(store)
    window.__faQuickAddCreateTemporarySpyCalls = []
    store.createTemporaryDocument = async (input) => {
      window.__faQuickAddCreateTemporarySpyCalls?.push({
        displayName: input.displayName,
        templateId: input.templateId,
        worldId: input.worldId
      })
      return await original(input)
    }
  })
}

async function readCreateTemporaryDocumentSpyCalls (page: Page): Promise<Array<{
  displayName: string
  templateId: string
  worldId: string
}>> {
  return await page.evaluate(() => {
    return [...(window.__faQuickAddCreateTemporarySpyCalls ?? [])]
  })
}

async function dismissPortaledSelectMenus (page: Page): Promise<void> {
  await page.keyboard.press('Escape')
  await page.waitForTimeout(200)
}

/**
 * Seeds Pinia + Quick Add probe, then remounts DialogQuickAddDocument so onDialogShow hydrates probe data.
 */
async function prepareQuickAddHarness (
  page: Page,
  fixture: T_quickAddSourcesFixture
): Promise<void> {
  await page.waitForFunction(() => {
    return typeof window.__faComponentTestingPatchStores === 'function'
  }, { timeout: 30_000 })
  await replaceComponentTestingPath(page, '/componentTesting/ErrorCard')
  await page.waitForTimeout(faFrontendRenderTimer)
  await patchFaPlaywrightComponentHarnessStores(page, defaultStoreSeed)
  await seedQuickAddDocumentSourcesProbe(page, fixture)
  await replaceComponentTestingPath(page, '/componentTesting/DialogQuickAddDocument')
  await page.locator('#dialogQuickAddDocument-title').waitFor({
    state: 'visible',
    timeout: 30_000
  })
  await page.waitForTimeout(quickAddHydrateSettleMs)
}

test.describe.serial('Quick Add Document dialog', () => {
  let electronApp: ElectronApplication
  let appWindow: Page
  let suiteTestInfo: TestInfo

  test.describe.configure({
    timeout: 60_000
  })

  test.beforeAll(async ({}, testInfo) => {
    suiteTestInfo = testInfo
    extraEnvSettings.COMPONENT_PROPS = JSON.stringify({
      directInput: quickAddDirectInput
    })
    const launched = await launchFaPlaywrightComponentHarnessWindow({
      buildLaunchEnv (): Record<string, string> {
        return {
          COMPONENT_NAME: extraEnvSettings.COMPONENT_NAME,
          COMPONENT_PROPS: extraEnvSettings.COMPONENT_PROPS,
          TEST_ENV: extraEnvSettings.TEST_ENV
        }
      },
      renderDelayMs: faFrontendRenderTimer,
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
   * directInput opens the shell; title and close control match en-US dialogs.quickAddDocument.
   */
  test('Check that Quick Add shell shows title and close button', async () => {
    await prepareQuickAddHarness(appWindow, singleWorldFixture)

    // Prepare the title and close locators
    const title = appWindow.locator('#dialogQuickAddDocument-title')
    const closeButton = appWindow.locator(`[data-test-locator="${selectorList.closeButton}"]`)

    // Check if title and close are visible with en-US copy
    await expect(title).toHaveCount(1)
    await expect(title).toHaveText(quickAddMessages.title)
    await expect(closeButton).toHaveCount(1)
    await expect(closeButton).toBeVisible()
    await expect(closeButton).toHaveText(quickAddMessages.closeButton)
  })

  /**
   * One world with placements hides the world select; template select lists placed templates;
   * picking a template creates a temporary opened document via S_FaOpenedDocuments.
   */
  test('Check that single world hides world select and template pick creates temporary document', async () => {
    await prepareQuickAddHarness(appWindow, singleWorldFixture)

    // Prepare the select locators
    const worldSelect = appWindow.locator(`[data-test-locator="${selectorList.worldSelect}"]`)
    const templateSelect = appWindow.locator(`[data-test-locator="${selectorList.templateSelect}"]`)
    const firstTemplateOption = appWindow.locator(
      `[data-test-locator="${selectorList.templateOption0}"]`
    )

    // Check if world select is absent and template select is present
    await expect(worldSelect).toHaveCount(0)
    await expect(templateSelect).toHaveCount(1)
    await expect(firstTemplateOption).toBeVisible({ timeout: 15_000 })
    await expect(firstTemplateOption).toContainText('Heroes')
    await expect(
      appWindow.locator(`[data-test-locator-separator-alt="${selectorList.templateSeparatorAlt1}"]`)
    ).toHaveCount(1)

    // Check if picking Heroes creates a temporary opened document
    await installCreateTemporaryDocumentSpy(appWindow)
    await firstTemplateOption.click()
    await expect(appWindow.locator('.q-dialog.dialogQuickAddDocument')).toBeHidden({
      timeout: 15_000
    })
    await expect.poll(async () => {
      const calls = await readCreateTemporaryDocumentSpyCalls(appWindow)
      return calls.length
    }, { timeout: 15_000 }).toBe(1)

    const calls = await readCreateTemporaryDocumentSpyCalls(appWindow)
    expect(calls[0]).toEqual({
      displayName: 'New hero',
      templateId: TEMPLATE_ID_HERO,
      worldId: WORLD_ID_A
    })
  })

  /**
   * Two worlds show world select with separatorAlt; switching worlds rebuilds template options.
   */
  test('Check that two worlds show world select separatorAlt and switch rebuilds templates', async () => {
    await prepareQuickAddHarness(appWindow, twoWorldsFixture)

    // Prepare the world and template locators
    const worldSelect = appWindow.locator(`[data-test-locator="${selectorList.worldSelect}"]`)
    const templateSelect = appWindow.locator(`[data-test-locator="${selectorList.templateSelect}"]`)

    // Check if world select is visible and first world templates show Heroes
    await expect(worldSelect).toHaveCount(1)
    await expect(templateSelect).toHaveCount(1)
    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.templateOption0}"]`)
    ).toContainText('Heroes', { timeout: 15_000 })
    await expect(appWindow.getByText('Places', { exact: true })).toHaveCount(0)

    // Check if world menu shows separatorAlt between Eldoria and Aurelion
    await worldSelect.click()
    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.worldOption0}"]`)
    ).toBeVisible({ timeout: 15_000 })
    await expect(
      appWindow.locator(`[data-test-locator-separator-alt="${selectorList.worldSeparatorAlt1}"]`)
    ).toHaveCount(1)
    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.worldOption1}"]`)
    ).toContainText('Aurelion')

    // Check if switching to Aurelion rebuilds templates to Places
    await appWindow.locator(`[data-test-locator="${selectorList.worldOption1}"]`).click()
    await appWindow.waitForTimeout(quickAddHydrateSettleMs)
    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.templateOption0}"]`)
    ).toContainText('Places', { timeout: 15_000 })
    await expect(appWindow.getByText('Heroes', { exact: true })).toHaveCount(0)
  })

  /**
   * Close dismisses the dialog; S_DialogComponent UUID reopen brings it back with hydrated shell.
   */
  test('Check that close dismisses Quick Add and store reopen restores it', async () => {
    await prepareQuickAddHarness(appWindow, singleWorldFixture)

    // Prepare the dialog shell and close button
    const dialogShell = appWindow.locator('.q-dialog.dialogQuickAddDocument')
    const closeButton = appWindow.locator(`[data-test-locator="${selectorList.closeButton}"]`)

    // Check if close hides the dialog
    await expect(dialogShell).toBeVisible()
    await expect(closeButton).toHaveCount(1)
    await dismissPortaledSelectMenus(appWindow)
    await closeButton.click()
    await expect(dialogShell).toBeHidden({ timeout: 15_000 })

    // Check if dialog store reopen restores the shell
    await reopenQuickAddViaDialogStore(appWindow)
    await expect(dialogShell).toBeVisible({ timeout: 15_000 })
    await expect(appWindow.locator('#dialogQuickAddDocument-title')).toHaveText(quickAddMessages.title)
    await expect(closeButton).toBeVisible()
  })

  /**
   * Template FaSelectInput filter — type into open menu filter; options shrink to match.
   */
  test('Check that template filter keeps matching options only', async () => {
    await prepareQuickAddHarness(appWindow, singleWorldFixture)

    const templateSelect = appWindow.locator(`[data-test-locator="${selectorList.templateSelect}"]`)
    const templateFilter = appWindow.locator(
      `[data-test-locator-filter="${selectorList.templateFilter}"]`
    )
    const templateOption0 = appWindow.locator(
      `[data-test-locator="${selectorList.templateOption0}"]`
    )
    await expect(templateSelect).toHaveCount(1)
    await expect(templateFilter).toHaveCount(1)
    // Hydrate focuses + opens template menu — type filter while that focus holds.
    await expect(templateOption0).toBeVisible({ timeout: 15_000 })
    await appWindow.keyboard.type('Place')
    await appWindow.waitForTimeout(200)

    await expect(templateOption0).toContainText('Places', { timeout: 15_000 })
    await expect(appWindow.getByText('Heroes', { exact: true })).toHaveCount(0)
  })

  /**
   * Re-activating the already-selected world (option-activate) reopens the template menu.
   */
  test('Check that reselecting the current world reopens the template menu', async () => {
    await prepareQuickAddHarness(appWindow, twoWorldsFixture)

    const worldSelect = appWindow.locator(`[data-test-locator="${selectorList.worldSelect}"]`)
    const templateOption0 = appWindow.locator(
      `[data-test-locator="${selectorList.templateOption0}"]`
    )
    await expect(templateOption0).toBeVisible({ timeout: 15_000 })
    await dismissPortaledSelectMenus(appWindow)
    await expect(templateOption0).toBeHidden({ timeout: 15_000 })

    await worldSelect.click()
    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.worldOption0}"]`)
    ).toBeVisible({ timeout: 15_000 })
    await appWindow.locator(`[data-test-locator="${selectorList.worldOption0}"]`).click()
    await appWindow.waitForTimeout(quickAddHydrateSettleMs)

    await expect(templateOption0).toBeVisible({ timeout: 15_000 })
    await expect(templateOption0).toContainText('Heroes')
  })

  /**
   * Enter on the world select filter (same selected world) schedules template openPopup.
   */
  test('Check that Enter on the current world option reopens the template menu', async () => {
    await prepareQuickAddHarness(appWindow, twoWorldsFixture)

    const worldSelect = appWindow.locator(`[data-test-locator="${selectorList.worldSelect}"]`)
    const templateOption0 = appWindow.locator(
      `[data-test-locator="${selectorList.templateOption0}"]`
    )
    await expect(templateOption0).toBeVisible({ timeout: 15_000 })
    await dismissPortaledSelectMenus(appWindow)
    await expect(templateOption0).toBeHidden({ timeout: 15_000 })

    await worldSelect.click()
    const worldOption0 = appWindow.locator(`[data-test-locator="${selectorList.worldOption0}"]`)
    await expect(worldOption0).toBeVisible({ timeout: 15_000 })
    await appWindow.keyboard.press('Enter')
    // Enter path: hidePopup + dual openPopup settle (2x templateFocusMs) + paint slack.
    await appWindow.waitForTimeout(quickAddHydrateSettleMs)

    await expect(templateOption0).toBeVisible({ timeout: 15_000 })
  })

  /**
   * Tab keyup into the template select opens its popup (focus alone does not).
   */
  test('Check that Tab into the template select opens the template menu', async () => {
    await prepareQuickAddHarness(appWindow, twoWorldsFixture)

    const templateSelect = appWindow.locator(`[data-test-locator="${selectorList.templateSelect}"]`)
    const templateOption0 = appWindow.locator(
      `[data-test-locator="${selectorList.templateOption0}"]`
    )
    await expect(templateOption0).toBeVisible({ timeout: 15_000 })
    await dismissPortaledSelectMenus(appWindow)
    await expect(templateOption0).toBeHidden({ timeout: 15_000 })

    await appWindow.evaluate(() => {
      const templateWrap = document.querySelector('.dialogQuickAddDocument__templateSelect')
      if (!(templateWrap instanceof HTMLElement) || !(templateWrap.parentElement instanceof HTMLElement)) {
        throw new Error('template select wrap missing')
      }
      const existing = document.getElementById('dialogQuickAddDocument-pw-tab-probe')
      if (existing instanceof HTMLButtonElement) {
        return
      }
      const probe = document.createElement('button')
      probe.id = 'dialogQuickAddDocument-pw-tab-probe'
      probe.type = 'button'
      probe.textContent = 'Tab probe'
      templateWrap.parentElement.insertBefore(probe, templateWrap)
    })

    await appWindow.locator('#dialogQuickAddDocument-pw-tab-probe').focus()
    await appWindow.keyboard.press('Tab')
    await expect(templateSelect).toBeVisible()
    await expect(templateOption0).toBeVisible({ timeout: 15_000 })
  })
})
