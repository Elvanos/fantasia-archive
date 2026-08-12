import type { ElectronApplication, Page } from 'playwright'
import { expect, test } from '@playwright/test'
import type { TestInfo } from '@playwright/test'
import { launchFaPlaywrightComponentHarnessWindow } from 'app/helpers/playwrightHelpers_component/faPlaywrightComponentHarnessLifecycle'
import { patchFaPlaywrightComponentHarnessStores } from 'app/helpers/playwrightHelpers_component/faPlaywrightComponentHarnessPiniaSeed'
import { FA_FRONTEND_RENDER_TIMER } from 'app/helpers/playwrightHelpers_universal/faPlaywrightElectronLaunchConstants'
import { tearDownFaPlaywrightElectronSerialSuite } from 'app/helpers/playwrightHelpers_universal/faPlaywrightSerialSuiteLifecycleTeardown'
import quickSearchMessages from 'app/i18n/en-US/dialogs/L_dialogQuickSearchDocument'
import type { I_dialogQuickSearchDocumentDocumentSource } from 'app/types/I_dialogQuickSearchDocument'
import type { I_dialogQuickSearchDocumentTemplateIconSource } from 'app/types/I_dialogQuickSearchDocument'
import type { I_dialogQuickSearchDocumentWorldSource } from 'app/types/I_dialogQuickSearchDocument'
import type { I_faComponentTestingStoreSeed } from 'app/types/I_faComponentTestingStoreSeed'
import type { I_faProjectDocument } from 'app/types/I_faProjectDocumentDomain'
import type { I_faProjectDocumentTemplate } from 'app/types/I_faProjectDocumentTemplateDomain'
import type {
  I_faProjectHierarchyTreeHeTreeNode,
  I_faProjectHierarchyTreeWorkspaceWorld
} from 'app/types/I_faProjectHierarchyTreeDomain'
import type { I_faProjectWorld } from 'app/types/I_faProjectWorldDomain'
import type { T_dialogName } from 'app/types/T_appDialogsAndDocuments'

/**
 * Extra env settings to trigger component testing via Playwright
 */
const extraEnvSettings = {
  COMPONENT_NAME: 'DialogQuickSearchDocument',
  COMPONENT_PROPS: JSON.stringify({}),
  TEST_ENV: 'components' as const
}

/**
 * Buffer so the component-testing shell finishes rendering before assertions.
 * - Tune this constant only when this spec needs a different wait.
 */
const faFrontendRenderTimer: number = FA_FRONTEND_RENDER_TIMER

/**
 * Allow hydrate + optional document popup focus delay after remount.
 */
const quickSearchHydrateSettleMs = 600

/**
 * Object of string data selectors for the component
 */
const selectorList = {
  closeButton: 'dialogQuickSearchDocument-button-close',
  contextMenu: 'dialogQuickSearchDocument-optionContextMenu',
  contextMenuOpen: 'projectHierarchyTree-nodeContextMenu-openDocument',
  documentFilter: 'dialogQuickSearchDocument-select-document-filter',
  documentOption0: 'dialogQuickSearchDocument-select-document-option-0',
  documentSelect: 'dialogQuickSearchDocument-select-document',
  optionActionAddUnderPrefix: 'dialogQuickSearchDocument-optionAction-addUnder-',
  optionActionCopyPrefix: 'dialogQuickSearchDocument-optionAction-copy-',
  optionActionEditPrefix: 'dialogQuickSearchDocument-optionAction-edit-',
  optionActions: 'dialogQuickSearchDocument-optionActions',
  worldSelect: 'dialogQuickSearchDocument-select-world'
} as const

const quickSearchDirectInput: T_dialogName = 'QuickSearchDocument'

const WORLD_ID_A = '550e8400-e29b-41d4-a716-4466554400c1'
const WORLD_ID_B = '550e8400-e29b-41d4-a716-4466554400c2'
const TEMPLATE_ID_HERO = '7c9e6679-7425-40de-944b-e07fc1f90ce1'
const PLACEMENT_ID_HERO = '7c9e6679-7425-40de-944b-e07fc1f90ce9'
const DOC_ID_ARIA = '7c9e6679-7425-40de-944b-e07fc1f90cf1'
const DOC_ID_BORIS = '7c9e6679-7425-40de-944b-e07fc1f90cf2'

const sampleActiveProject = {
  filePath: 'C:\\Playwright\\quick-search-document.faproject',
  id: 'playwright-quick-search-project-id',
  name: 'Playwright Quick Search Project'
} as const

type T_quickSearchSourcesFixture = {
  documents: Array<I_dialogQuickSearchDocumentDocumentSource & { worldId: string }>
  templates: I_dialogQuickSearchDocumentTemplateIconSource[]
  worlds: I_dialogQuickSearchDocumentWorldSource[]
}

const heroTemplate: I_dialogQuickSearchDocumentTemplateIconSource = {
  icon: 'mdi-account',
  id: TEMPLATE_ID_HERO
}

const worldA: I_dialogQuickSearchDocumentWorldSource = {
  color: '#4caf50',
  displayNameTranslations: { 'en-US': 'Eldoria' },
  id: WORLD_ID_A,
  sortOrder: 0
}

const worldB: I_dialogQuickSearchDocumentWorldSource = {
  color: '#2196f3',
  displayNameTranslations: { 'en-US': 'Aurelion' },
  id: WORLD_ID_B,
  sortOrder: 1
}

const docAria: I_dialogQuickSearchDocumentDocumentSource & { worldId: string } = {
  displayName: 'Aria',
  documentTextColor: null,
  id: DOC_ID_ARIA,
  isCategory: false,
  sortOrder: 0,
  templateId: TEMPLATE_ID_HERO,
  worldId: WORLD_ID_A
}

const docBoris: I_dialogQuickSearchDocumentDocumentSource & { worldId: string } = {
  displayName: 'Boris',
  documentTextColor: null,
  id: DOC_ID_BORIS,
  isCategory: false,
  sortOrder: 0,
  templateId: TEMPLATE_ID_HERO,
  worldId: WORLD_ID_B
}

const singleWorldFixture: T_quickSearchSourcesFixture = {
  documents: [docAria],
  templates: [heroTemplate],
  worlds: [worldA]
}

const twoWorldFixture: T_quickSearchSourcesFixture = {
  documents: [docAria, docBoris],
  templates: [heroTemplate],
  worlds: [worldA, worldB]
}

const sampleWorldEntity: I_faProjectWorld = {
  color: '#4caf50',
  colorPalette: '',
  createdAtMs: 1,
  displayName: 'Eldoria',
  displayNameTranslations: { 'en-US': 'Eldoria' },
  id: WORLD_ID_A,
  sortOrder: 0,
  updatedAtMs: 1
}

const sampleTemplateEntity: I_faProjectDocumentTemplate = {
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

const sampleDocumentEntity: I_faProjectDocument = {
  createdAtMs: 1,
  displayName: 'Aria',
  documentBackgroundColor: null,
  documentTextColor: null,
  extraClasses: '',
  id: DOC_ID_ARIA,
  isCategory: false,
  isDead: false,
  isFinished: false,
  isMinor: false,
  parentDocumentId: null,
  placementId: PLACEMENT_ID_HERO,
  sortOrder: 0,
  templateId: TEMPLATE_ID_HERO,
  treeOrderNumber: 0,
  updatedAtMs: 1,
  worldId: WORLD_ID_A
}

const sampleTreeData: I_faProjectHierarchyTreeHeTreeNode[] = [
  {
    children: [
      {
        children: [
          {
            children: [],
            childrenLoaded: true,
            documentId: DOC_ID_ARIA,
            groupId: null,
            hasChildren: false,
            icon: 'mdi-account',
            id: DOC_ID_ARIA,
            isCategory: false,
            label: 'Aria',
            nodeKind: 'document',
            placementId: PLACEMENT_ID_HERO,
            worldColor: '#4caf50',
            worldId: WORLD_ID_A
          }
        ],
        childrenLoaded: true,
        documentCount: 1,
        documentId: null,
        documentTemplateId: TEMPLATE_ID_HERO,
        groupId: null,
        hasChildren: true,
        icon: 'mdi-account',
        id: PLACEMENT_ID_HERO,
        label: 'Heroes',
        nodeKind: 'templatePlacement',
        placementId: PLACEMENT_ID_HERO,
        titlePluralTranslations: { 'en-US': 'Heroes' },
        titleSingularTranslations: { 'en-US': 'Hero' },
        worldColor: '#4caf50',
        worldId: WORLD_ID_A
      }
    ],
    childrenLoaded: true,
    documentId: null,
    groupId: null,
    hasChildren: true,
    icon: '',
    id: WORLD_ID_A,
    label: 'Eldoria',
    nodeKind: 'world',
    placementId: null,
    worldColor: '#4caf50',
    worldId: WORLD_ID_A
  }
]

const sampleHierarchyWorlds: I_faProjectHierarchyTreeWorkspaceWorld[] = [
  {
    color: '#4caf50',
    colorPalette: '',
    displayName: 'Eldoria',
    groups: [],
    id: WORLD_ID_A,
    placements: [
      {
        categoryCount: 0,
        displayName: 'Hero',
        documentCount: 1,
        documentTemplateId: TEMPLATE_ID_HERO,
        groupId: null,
        groupSortOrder: null,
        hasChildren: true,
        icon: 'mdi-account',
        id: PLACEMENT_ID_HERO,
        nickname: 'Heroes',
        rootSortOrder: 0,
        titlePluralTranslations: { 'en-US': 'Heroes' },
        titleSingularTranslations: { 'en-US': 'Hero' },
        worldId: WORLD_ID_A
      }
    ],
    sortOrder: 0
  }
]

const defaultStoreSeed: I_faComponentTestingStoreSeed = {
  activeProject: { ...sampleActiveProject },
  hierarchyTree: {
    treeData: sampleTreeData,
    worlds: sampleHierarchyWorlds
  },
  openedDocuments: {
    activeDocumentId: null,
    tabs: []
  },
  projectContentOverrides: {
    documentsById: {
      [DOC_ID_ARIA]: sampleDocumentEntity
    },
    templatesById: {
      [TEMPLATE_ID_HERO]: sampleTemplateEntity
    },
    worldsById: {
      [WORLD_ID_A]: sampleWorldEntity
    }
  }
}

/**
 * Seeds Quick Search hydrate sources via renderer probe.
 * contextBridge freezes projectContent list methods, so page.evaluate assign cannot replace IPC.
 */
async function seedQuickSearchDocumentSourcesProbe (
  page: Page,
  fixture: T_quickSearchSourcesFixture
): Promise<void> {
  await page.evaluate((payload) => {
    window.__faComponentTestingQuickSearchDocumentSources = payload
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

/**
 * Patches S_FaUserSettings.disableCloseAfterSelectQuickSearch (not on I_faComponentTestingStoreSeed).
 */
async function patchDisableCloseAfterSelectQuickSearch (
  page: Page,
  enabled: boolean
): Promise<void> {
  await page.evaluate((value) => {
    const root = document.querySelector('#q-app') as HTMLElement & {
      __vue_app__?: {
        config: {
          globalProperties: {
            $pinia?: {
              _s: Map<string, {
                $patch: (partial: { settings: Record<string, unknown> }) => void
                settings?: Record<string, unknown> | null
              }>
            }
          }
        }
      }
    }
    const store = root?.__vue_app__?.config.globalProperties.$pinia?._s?.get('S_FaUserSettings')
    if (store === undefined) {
      throw new Error('S_FaUserSettings missing in component harness')
    }
    store.$patch({
      settings: {
        ...(store.settings ?? {}),
        disableCloseAfterSelectQuickSearch: value
      }
    })
  }, enabled)
}

async function readOpenedDocumentsSession (page: Page): Promise<{
  activeDocumentId: string | null
  tabs: Array<{ documentId: string }>
}> {
  return await page.evaluate(() => {
    const root = document.querySelector('#q-app') as HTMLElement & {
      __vue_app__?: {
        config: {
          globalProperties: {
            $pinia?: {
              _s: Map<string, {
                activeDocumentId?: string | null
                tabs?: Array<{ documentId: string }>
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
    return {
      activeDocumentId: store.activeDocumentId ?? null,
      tabs: [...(store.tabs ?? [])].map((tab) => {
        return { documentId: tab.documentId }
      })
    }
  })
}

async function dismissPortaledSelectMenus (page: Page): Promise<void> {
  await page.keyboard.press('Escape')
  await page.waitForTimeout(200)
}

/**
 * Seeds Pinia + Quick Search probe, then remounts DialogQuickSearchDocument so onDialogShow hydrates.
 */
async function prepareQuickSearchHarness (
  page: Page,
  fixture: T_quickSearchSourcesFixture,
  options?: {
    disableCloseAfterSelectQuickSearch?: boolean
  }
): Promise<void> {
  await page.waitForFunction(() => {
    return typeof window.__faComponentTestingPatchStores === 'function'
  }, { timeout: 30_000 })
  await replaceComponentTestingPath(page, '/componentTesting/ErrorCard')
  await page.waitForTimeout(faFrontendRenderTimer)
  await patchFaPlaywrightComponentHarnessStores(page, defaultStoreSeed)
  if (options?.disableCloseAfterSelectQuickSearch === true) {
    await patchDisableCloseAfterSelectQuickSearch(page, true)
  } else {
    await patchDisableCloseAfterSelectQuickSearch(page, false)
  }
  await seedQuickSearchDocumentSourcesProbe(page, fixture)
  await replaceComponentTestingPath(page, '/componentTesting/DialogQuickSearchDocument')
  await page.locator('#dialogQuickSearchDocument-title').waitFor({
    state: 'visible',
    timeout: 30_000
  })
  // Re-apply hierarchy + content after remount so openHierarchyTreeDocument can resolve the node.
  await patchFaPlaywrightComponentHarnessStores(page, {
    hierarchyTree: defaultStoreSeed.hierarchyTree,
    openedDocuments: defaultStoreSeed.openedDocuments,
    projectContentOverrides: defaultStoreSeed.projectContentOverrides
  })
  if (options?.disableCloseAfterSelectQuickSearch === true) {
    await patchDisableCloseAfterSelectQuickSearch(page, true)
  }
  await page.waitForTimeout(quickSearchHydrateSettleMs)
}

test.describe.serial('Quick Search Document dialog', () => {
  let electronApp: ElectronApplication
  let appWindow: Page
  let suiteTestInfo: TestInfo

  test.describe.configure({
    timeout: 60_000
  })

  test.beforeAll(async ({}, testInfo) => {
    suiteTestInfo = testInfo
    extraEnvSettings.COMPONENT_PROPS = JSON.stringify({
      directInput: quickSearchDirectInput
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
   * directInput opens the shell; title and close control match en-US dialogs.quickSearchDocument.
   */
  test('Check that Quick Search shell shows title and close button', async () => {
    await prepareQuickSearchHarness(appWindow, singleWorldFixture)

    const title = appWindow.locator('#dialogQuickSearchDocument-title')
    const closeButton = appWindow.locator(`[data-test-locator="${selectorList.closeButton}"]`)

    await expect(title).toHaveCount(1)
    await expect(title).toHaveText(quickSearchMessages.title)
    await expect(closeButton).toHaveCount(1)
    await expect(closeButton).toBeVisible()
    await expect(closeButton).toHaveText(quickSearchMessages.closeButton)
  })

  /**
   * One world hides the world select; document select remains for name search.
   */
  test('Check that single world hides world select and shows document select', async () => {
    await prepareQuickSearchHarness(appWindow, singleWorldFixture)

    const worldSelect = appWindow.locator(`[data-test-locator="${selectorList.worldSelect}"]`)
    const documentSelect = appWindow.locator(`[data-test-locator="${selectorList.documentSelect}"]`)

    await expect(worldSelect).toHaveCount(0)
    await expect(documentSelect).toHaveCount(1)
    await expect(documentSelect).toBeVisible()
  })

  /**
   * Two worlds show the world select so the user can switch search scope.
   */
  test('Check that two worlds show world select and document select', async () => {
    await prepareQuickSearchHarness(appWindow, twoWorldFixture)

    const worldSelect = appWindow.locator(`[data-test-locator="${selectorList.worldSelect}"]`)
    const documentSelect = appWindow.locator(`[data-test-locator="${selectorList.documentSelect}"]`)

    await expect(worldSelect).toHaveCount(1)
    await expect(worldSelect).toBeVisible()
    await expect(documentSelect).toHaveCount(1)
    await expect(documentSelect).toBeVisible()
  })

  /**
   * Typing a name filter shows matching options; Enter activates open and closes Quick Search.
   */
  test('Check that typing a query shows options and Enter opens the document', async () => {
    await prepareQuickSearchHarness(appWindow, singleWorldFixture)

    const documentFilter = appWindow.locator(
      `[data-test-locator-filter="${selectorList.documentFilter}"]`
    )
    const documentOption0 = appWindow.locator(
      `[data-test-locator="${selectorList.documentOption0}"]`
    )

    await expect(documentFilter).toHaveCount(1)
    await documentFilter.click()
    await documentFilter.fill('Ari')
    await expect(documentOption0).toBeVisible({ timeout: 15_000 })
    await expect(documentOption0).toContainText('Aria')

    await appWindow.keyboard.press('Enter')
    await expect(appWindow.locator('.q-dialog.dialogQuickSearchDocument')).toBeHidden({
      timeout: 15_000
    })
    await expect.poll(async () => {
      const session = await readOpenedDocumentsSession(appWindow)
      return session.activeDocumentId
    }, { timeout: 15_000 }).toBe(DOC_ID_ARIA)
  })

  /**
   * Left-click on a filtered option opens the document and closes Quick Search.
   */
  test('Check that left-click on an option opens the document', async () => {
    await prepareQuickSearchHarness(appWindow, singleWorldFixture)

    const documentOption0 = appWindow.locator(
      `[data-test-locator="${selectorList.documentOption0}"]`
    )
    await expect(documentOption0).toBeVisible({ timeout: 15_000 })
    await expect(documentOption0).toContainText('Aria')

    await documentOption0.click()
    await expect(appWindow.locator('.q-dialog.dialogQuickSearchDocument')).toBeHidden({
      timeout: 15_000
    })
    await expect.poll(async () => {
      const session = await readOpenedDocumentsSession(appWindow)
      return session.activeDocumentId
    }, { timeout: 15_000 }).toBe(DOC_ID_ARIA)
  })

  /**
   * Middle-click opens in middleBackground: tab appends, dialog stays open, active id unchanged.
   */
  test('Check that middle-click opens a background tab and keeps Quick Search open', async () => {
    await prepareQuickSearchHarness(appWindow, singleWorldFixture)

    const documentOption0 = appWindow.locator(
      `[data-test-locator="${selectorList.documentOption0}"]`
    )
    await expect(documentOption0).toBeVisible({ timeout: 15_000 })

    await documentOption0.click({ button: 'middle' })
    await expect(appWindow.locator('.q-dialog.dialogQuickSearchDocument')).toBeVisible({
      timeout: 15_000
    })
    await expect.poll(async () => {
      const session = await readOpenedDocumentsSession(appWindow)
      return session.tabs.some((tab) => tab.documentId === DOC_ID_ARIA)
    }, { timeout: 15_000 }).toBe(true)
    const session = await readOpenedDocumentsSession(appWindow)
    expect(session.activeDocumentId).toBeNull()
  })

  /**
   * Trailing Edit / Copy / Add under mount on options; Edit left-click closes and focuses edit.
   */
  test('Check that trailing Edit Copy Add under mount and Edit closes Quick Search', async () => {
    await prepareQuickSearchHarness(appWindow, singleWorldFixture)

    const documentOption0 = appWindow.locator(
      `[data-test-locator="${selectorList.documentOption0}"]`
    )
    await expect(documentOption0).toBeVisible({ timeout: 15_000 })

    const editButton = appWindow.locator(
      `[data-test-locator="${selectorList.optionActionEditPrefix}${DOC_ID_ARIA}"]`
    )
    const copyButton = appWindow.locator(
      `[data-test-locator="${selectorList.optionActionCopyPrefix}${DOC_ID_ARIA}"]`
    )
    const addUnderButton = appWindow.locator(
      `[data-test-locator="${selectorList.optionActionAddUnderPrefix}${DOC_ID_ARIA}"]`
    )

    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.optionActions}"]`)
    ).toHaveCount(1)
    await expect(editButton).toBeVisible()
    await expect(copyButton).toBeVisible()
    await expect(addUnderButton).toBeVisible()

    await editButton.click()
    await expect(appWindow.locator('.q-dialog.dialogQuickSearchDocument')).toBeHidden({
      timeout: 15_000
    })
    await expect.poll(async () => {
      const session = await readOpenedDocumentsSession(appWindow)
      return session.activeDocumentId
    }, { timeout: 15_000 }).toBe(DOC_ID_ARIA)
  })

  /**
   * Right-click on an option mounts the hierarchy-style context menu with Open Document.
   */
  test('Check that option context menu mounts with Open Document', async () => {
    await prepareQuickSearchHarness(appWindow, singleWorldFixture)

    const documentOption0 = appWindow.locator(
      `[data-test-locator="${selectorList.documentOption0}"]`
    )
    await expect(documentOption0).toBeVisible({ timeout: 15_000 })

    await documentOption0.click({ button: 'right' })
    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.contextMenu}"]`)
    ).toBeVisible({ timeout: 15_000 })
    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.contextMenuOpen}"]`)
    ).toBeVisible()

    await dismissPortaledSelectMenus(appWindow)
  })

  /**
   * disableCloseAfterSelectQuickSearch keeps dialog open, opens middleBackground, leaves filter unstuffed.
   */
  test('Check that disableCloseAfterSelectQuickSearch stays open without stuffing the select', async () => {
    await prepareQuickSearchHarness(appWindow, singleWorldFixture, {
      disableCloseAfterSelectQuickSearch: true
    })

    const documentFilter = appWindow.locator(
      `[data-test-locator-filter="${selectorList.documentFilter}"]`
    )
    const documentOption0 = appWindow.locator(
      `[data-test-locator="${selectorList.documentOption0}"]`
    )
    await expect(documentOption0).toBeVisible({ timeout: 15_000 })
    await documentFilter.fill('Ari')
    await expect(documentOption0).toContainText('Aria')

    await documentOption0.click()
    await expect(appWindow.locator('.q-dialog.dialogQuickSearchDocument')).toBeVisible({
      timeout: 15_000
    })
    await expect.poll(async () => {
      const session = await readOpenedDocumentsSession(appWindow)
      return session.tabs.some((tab) => tab.documentId === DOC_ID_ARIA)
    }, { timeout: 15_000 }).toBe(true)
    const session = await readOpenedDocumentsSession(appWindow)
    expect(session.activeDocumentId).toBeNull()
    await expect(documentFilter).toHaveValue(/Ari/i)
  })
})
