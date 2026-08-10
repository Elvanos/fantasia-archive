import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { ElectronApplication, Page } from 'playwright'
import { expect, test } from '@playwright/test'
import type { TestInfo } from '@playwright/test'
import { launchFaPlaywrightComponentHarnessWindow } from 'app/helpers/playwrightHelpers_component/faPlaywrightComponentHarnessLifecycle'
import { patchFaPlaywrightComponentHarnessStores } from 'app/helpers/playwrightHelpers_component/faPlaywrightComponentHarnessPiniaSeed'
import { FA_FRONTEND_RENDER_TIMER } from 'app/helpers/playwrightHelpers_universal/faPlaywrightElectronLaunchConstants'
import { tearDownFaPlaywrightElectronSerialSuite } from 'app/helpers/playwrightHelpers_universal/faPlaywrightSerialSuiteLifecycleTeardown'
import projectOverviewMessages from 'app/i18n/en-US/components/projectUI/ProjectOverview/L_projectOverview'
import unsortedAppTexts from 'app/i18n/en-US/globalFunctionality/L_unsortedAppTexts'
import { mdListArrayConverter } from 'app/src/scripts/_utilities/functions/mdListArrayConverter'
import type { I_faComponentTestingStoreSeed } from 'app/types/I_faComponentTestingStoreSeed'
import type { I_faOpenedDocumentTab } from 'app/types/I_faOpenedDocumentsDomain'
import type { I_faProjectDocument } from 'app/types/I_faProjectDocumentDomain'
import type {
  I_faProjectDocumentDistributionResult,
  I_faProjectDocumentLastOpenedItem
} from 'app/types/I_faProjectDocumentLastOpenedDomain'
import type { I_faProjectDocumentTemplate } from 'app/types/I_faProjectDocumentTemplateDomain'
import type { I_faProjectHierarchyTreeHeTreeNode } from 'app/types/I_faProjectHierarchyTreeDomain'
import type { I_faProjectHierarchyTreeWorkspaceWorld } from 'app/types/I_faProjectHierarchyTreeDomain'
import type { I_faProjectWorld } from 'app/types/I_faProjectWorldDomain'

const playwrightTestDir = path.dirname(fileURLToPath(import.meta.url))

/**
 * Raw tips markdown. Do not apply specialCharacterFixer here: i18n stores the fixed
 * form ({'@'} / {'|'}), but vue-i18n t() returns the literal characters shown in the tip
 * card. Matching the fixed form flakes when Math.random picks the @ tip.
 */
const tipsTricksTriviaMarkdown = fs.readFileSync(
  path.resolve(playwrightTestDir, '../../../../../i18n/en-US/documents/tipsTricksTrivia.md'),
  'utf8'
).replaceAll('\r\n', '\n').replaceAll('\r', '\n')

/**
 * Extra env settings to trigger component testing via Playwright
 */
const extraEnvSettings = {
  TEST_ENV: 'components',
  COMPONENT_NAME: 'ProjectOverview',
  COMPONENT_PROPS: JSON.stringify({})
}

/**
 * Buffer before assertions so the component-testing shell finishes rendering.
 */
const faFrontendRenderTimer: number = FA_FRONTEND_RENDER_TIMER

const PLAYWRIGHT_PROJECT_OVERVIEW_NAME = 'Playwright Aurelion Overview'
const PLAYWRIGHT_PROJECT_OVERVIEW_FILE = 'C:\\Playwright\\aurelion-overview.faproject'
const PLAYWRIGHT_PROJECT_OVERVIEW_ID = 'playwright-project-overview-id'

const WORLD_ID = '550e8400-e29b-41d4-a716-446655440001'
const TEMPLATE_ID = '7c9e6679-7425-40de-944b-e07fc1f90ae8'
const PLACEMENT_ID = '7c9e6679-7425-40de-944b-e07fc1f90ae9'
const LAST_OPENED_PLAIN_DOC_ID = '7c9e6679-7425-40de-944b-e07fc1f90afa'
const LAST_OPENED_DEAD_CATEGORY_DOC_ID = '7c9e6679-7425-40de-944b-e07fc1f90afb'

const allowedTipCaptions = mdListArrayConverter(tipsTricksTriviaMarkdown).filter((line) => {
  return line.trim().length > 0
})

if (allowedTipCaptions.length === 0) {
  throw new Error('Expected en-US tipsTricksTrivia bullets for Playwright assertions')
}

/**
 * Object of string data selectors for the component
 */
const selectorList = {
  contextCopyDocument: 'projectHierarchyTree-nodeContextMenu-copyDocument',
  contextDeleteDocument: 'projectHierarchyTree-nodeContextMenu-deleteDocument',
  contextEditDocument: 'projectHierarchyTree-nodeContextMenu-editDocument',
  contextOpenDocument: 'projectHierarchyTree-nodeContextMenu-openDocument',
  dialogProjectSettingsTitle: 'dialogProjectSettings-title',
  dialogQuickAddClose: 'dialogQuickAddDocument-button-close',
  fantasiaMascotImage: 'fantasiaMascotImage-image',
  projectOverview: 'projectOverview',
  projectOverviewDocCountLabel: 'projectOverview-docCountLabel',
  projectOverviewEmptyCta: 'projectOverview-emptyCta',
  projectOverviewEmptyCtaButton: 'projectOverview-emptyCtaButton',
  projectOverviewEmptyCtaWelcome: 'projectOverview-emptyCtaWelcome',
  projectOverviewGraphParent: 'projectOverview-graphParent',
  projectOverviewLastOpened: 'projectOverview-lastOpened',
  projectOverviewLastOpenedTitle: 'projectOverview-lastOpenedTitle',
  projectOverviewProjectName: 'projectOverview-projectName',
  projectOverviewSubtitle: 'projectOverview-subtitle',
  projectOverviewTipCard: 'projectOverview-tipCard',
  projectOverviewTipHeading: 'projectOverview-tipHeading',
  projectOverviewTipMessage: 'projectOverview-tipMessage',
  projectOverviewWorldLegendHelpIcon: 'projectOverview-worldLegendHelpIcon'
} as const

const defaultActiveProjectSeed: I_faComponentTestingStoreSeed = {
  activeProject: {
    filePath: PLAYWRIGHT_PROJECT_OVERVIEW_FILE,
    id: PLAYWRIGHT_PROJECT_OVERVIEW_ID,
    name: PLAYWRIGHT_PROJECT_OVERVIEW_NAME
  },
  hidePlushes: false,
  hideTooltipsProject: false
}

const emptyWorldNoPlacements: I_faProjectHierarchyTreeWorkspaceWorld = {
  color: '#4caf50',
  colorPalette: '',
  displayName: 'Eldoria',
  groups: [],
  id: WORLD_ID,
  placements: [],
  sortOrder: 0
}

const worldWithPlacement: I_faProjectHierarchyTreeWorkspaceWorld = {
  ...emptyWorldNoPlacements,
  placements: [{
    categoryCount: 0,
    displayName: 'Character',
    documentCount: 0,
    documentTemplateId: TEMPLATE_ID,
    groupId: null,
    groupSortOrder: null,
    hasChildren: false,
    icon: 'mdi-account',
    id: PLACEMENT_ID,
    nickname: 'Heroes',
    rootSortOrder: 0,
    titlePluralTranslations: { 'en-US': 'Characters' },
    titleSingularTranslations: { 'en-US': 'Character' },
    worldId: WORLD_ID
  }]
}

const sampleTemplate: I_faProjectDocumentTemplate = {
  createdAtMs: 1,
  displayName: 'Characters',
  icon: 'mdi-account',
  id: TEMPLATE_ID,
  sortOrder: 0,
  titlePluralTranslations: { 'en-US': 'Characters' },
  titleSingularTranslations: { 'en-US': 'Character' },
  updatedAtMs: 1,
  worldAppendix: '',
  worldAppendixTranslations: {}
}

const sampleWorld: I_faProjectWorld = {
  color: '#4caf50',
  colorPalette: '',
  createdAtMs: 1,
  displayName: 'Eldoria',
  displayNameTranslations: { 'en-US': 'Eldoria' },
  id: WORLD_ID,
  sortOrder: 0,
  updatedAtMs: 1
}

function buildSampleDocument (input: {
  displayName: string
  id: string
  isCategory?: boolean
  isDead?: boolean
}): I_faProjectDocument {
  return {
    createdAtMs: 1,
    displayName: input.displayName,
    documentBackgroundColor: null,
    documentTextColor: null,
    extraClasses: '',
    id: input.id,
    isCategory: input.isCategory === true,
    isDead: input.isDead === true,
    isFinished: false,
    isMinor: false,
    parentDocumentId: null,
    placementId: PLACEMENT_ID,
    sortOrder: 0,
    templateId: TEMPLATE_ID,
    treeOrderNumber: Number.MIN_SAFE_INTEGER,
    updatedAtMs: 1,
    worldId: WORLD_ID
  }
}

const chartDistributionFixture: I_faProjectDocumentDistributionResult = {
  counts: [
    {
      documentCount: 2,
      templateId: TEMPLATE_ID,
      worldId: WORLD_ID
    }
  ],
  documentTemplateTotalCount: 1,
  templates: [{
    icon: 'mdi-account',
    sortOrder: 0,
    templateId: TEMPLATE_ID,
    titlePluralTranslationsJson: '{"en-US":"Characters"}'
  }],
  totalDocumentCount: 2,
  worlds: [{
    color: '#4caf50',
    displayNameTranslationsJson: '{"en-US":"Eldoria"}',
    sortOrder: 0,
    worldId: WORLD_ID
  }]
}

const lastOpenedItemsFixture: I_faProjectDocumentLastOpenedItem[] = [
  {
    displayName: 'Dead Category Hero',
    documentBackgroundColor: null,
    documentId: LAST_OPENED_DEAD_CATEGORY_DOC_ID,
    documentTextColor: null,
    isCategory: true,
    isDead: true,
    openedAtMs: 2,
    templateIcon: 'mdi-account',
    templateId: TEMPLATE_ID,
    worldId: WORLD_ID
  },
  {
    displayName: 'Plain Hero',
    documentBackgroundColor: null,
    documentId: LAST_OPENED_PLAIN_DOC_ID,
    documentTextColor: null,
    isCategory: false,
    isDead: false,
    openedAtMs: 1,
    templateIcon: 'mdi-account',
    templateId: TEMPLATE_ID,
    worldId: WORLD_ID
  }
]

function lastOpenedItemLocator (documentId: string): string {
  return `projectOverview-lastOpenedItem-${documentId}`
}

function buildPersistedOpenedTab (input: {
  displayName: string
  documentId: string
}): I_faOpenedDocumentTab {
  return {
    documentId: input.documentId,
    persistenceState: 'persisted',
    tabLabel: 'Character',
    templateIcon: 'mdi-account',
    displayNameDraft: input.displayName,
    savedDisplayName: input.displayName,
    documentTextColorDraft: '',
    savedDocumentTextColor: '',
    documentBackgroundColorDraft: '',
    savedDocumentBackgroundColor: '',
    isCategoryDraft: false,
    savedIsCategory: false,
    isFinishedDraft: false,
    isMinorDraft: false,
    isDeadDraft: false,
    savedIsFinished: false,
    savedIsMinor: false,
    savedIsDead: false,
    parentDocumentIdDraft: '',
    savedParentDocumentId: '',
    treeOrderNumberDraft: '',
    savedTreeOrderNumber: Number.MIN_SAFE_INTEGER,
    extraClassesDraft: '',
    savedExtraClasses: '',
    hasUnsavedChanges: false,
    editState: false,
    templateId: TEMPLATE_ID,
    worldId: WORLD_ID
  }
}

function buildDistributionForTotalCount (docCount: number): I_faProjectDocumentDistributionResult {
  return {
    counts: [],
    documentTemplateTotalCount: docCount > 0 ? 1 : 0,
    templates: docCount > 0
      ? [{
          icon: 'mdi-sword',
          sortOrder: 0,
          templateId: 'playwright-template',
          titlePluralTranslationsJson: '{"en-US":"Heroes"}'
        }]
      : [],
    totalDocumentCount: docCount,
    worlds: []
  }
}

async function remountProjectOverviewAfterStoreSeed (
  page: Page,
  seed: I_faComponentTestingStoreSeed,
  options?: {
    distribution?: I_faProjectDocumentDistributionResult
    lastOpenedItems?: I_faProjectDocumentLastOpenedItem[]
    routePath?: string
    totalDocumentCount?: number
  }
): Promise<void> {
  await page.waitForFunction(() => {
    return typeof window.__faComponentTestingPatchStores === 'function'
  }, { timeout: 30_000 })

  const distribution = options?.distribution ??
    buildDistributionForTotalCount(options?.totalDocumentCount ?? 0)
  const lastOpenedItems = options?.lastOpenedItems ?? []
  const routePath = options?.routePath ?? '/componentTesting/ProjectOverview'

  // Probe before store patch so census/active-project watch reloads already see stubs.
  // contextBridge freezes projectContent list methods (same class as Quick Add).
  await page.evaluate((payload) => {
    window.__faComponentTestingProjectOverviewLists = {
      distribution: payload.distribution,
      lastOpened: { items: payload.lastOpenedItems }
    }
  }, {
    distribution,
    lastOpenedItems
  })

  await page.evaluate(async () => {
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
    await router.replace({ path: '/componentTesting/ErrorCard' })
  })
  await page.waitForTimeout(faFrontendRenderTimer)

  await patchFaPlaywrightComponentHarnessStores(page, {
    activeProject: seed.activeProject,
    openedDocuments: {
      activeDocumentId: null,
      tabs: []
    },
    projectContentOverrides: seed.projectContentOverrides ?? null
  })

  await page.evaluate(async (targetPath) => {
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
    await router.replace({ path: targetPath })
  }, routePath)

  if (routePath === '/home' || routePath.startsWith('/home/')) {
    await expect.poll(async () => {
      return await page.evaluate(() => {
        return window.location.hash
      })
    }, {
      timeout: 15_000
    }).toMatch(/^#\/home(?:\/document\/[^#]*)?$/)
    await page.waitForTimeout(faFrontendRenderTimer)
  }

  await patchFaPlaywrightComponentHarnessStores(page, seed)

  await page.evaluate((payload) => {
    window.__faComponentTestingProjectOverviewLists = {
      distribution: payload.distribution,
      lastOpened: { items: payload.lastOpenedItems }
    }
    const root = document.querySelector('#q-app') as HTMLElement & {
      __vue_app__?: {
        config: {
          globalProperties: {
            $pinia?: {
              _s: Map<string, {
                bumpDocumentCensusRefreshGeneration?: () => void
              }>
            }
          }
        }
      }
    }
    const hierarchyStore = root?.__vue_app__?.config.globalProperties.$pinia?._s?.get(
      'S_FaProjectHierarchyTree'
    )
    hierarchyStore?.bumpDocumentCensusRefreshGeneration?.()
  }, {
    distribution,
    lastOpenedItems
  })

  await page.locator(`[data-test-locator="${selectorList.projectOverview}"]`).waitFor({
    state: 'visible',
    timeout: 30_000
  })
  await page.waitForTimeout(faFrontendRenderTimer)
}

async function readDialogComponentState (page: Page): Promise<{
  dialogToOpen: string
  projectSettingsInitialTab: string | null
}> {
  return await page.evaluate(() => {
    const root = document.querySelector('#q-app') as HTMLElement & {
      __vue_app__?: {
        config: {
          globalProperties: {
            $pinia?: {
              _s?: Map<string, {
                dialogToOpen?: string
                projectSettingsInitialTab?: string | null
              }>
            }
          }
        }
      }
    }
    const store = root?.__vue_app__?.config.globalProperties.$pinia?._s?.get('S_DialogComponent')
    return {
      dialogToOpen: store?.dialogToOpen ?? '',
      projectSettingsInitialTab: store?.projectSettingsInitialTab ?? null
    }
  })
}

async function resetDialogComponentState (page: Page): Promise<void> {
  await page.evaluate(() => {
    const root = document.querySelector('#q-app') as HTMLElement & {
      __vue_app__?: {
        config: {
          globalProperties: {
            $pinia?: {
              _s?: Map<string, {
                dialogToOpen?: string
                projectSettingsInitialTab?: string | null
              }>
            }
          }
        }
      }
    }
    const store = root?.__vue_app__?.config.globalProperties.$pinia?._s?.get('S_DialogComponent')
    if (store === undefined) {
      return
    }
    store.dialogToOpen = 'AboutFantasiaArchive'
    store.projectSettingsInitialTab = null
  })
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
              _s?: Map<string, {
                activeDocumentId?: string | null
                tabs?: Array<{ documentId: string }>
              }>
            }
          }
        }
      }
    }
    const store = root?.__vue_app__?.config.globalProperties.$pinia?._s?.get('S_FaOpenedDocuments')
    return {
      activeDocumentId: store?.activeDocumentId ?? null,
      tabs: (store?.tabs ?? []).map((tab) => {
        return { documentId: tab.documentId }
      })
    }
  })
}

async function launchProjectOverviewHarness (testInfo: TestInfo): Promise<{
  appWindow: Page
  electronApp: ElectronApplication
}> {
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
  return {
    appWindow: launched.appWindow,
    electronApp: launched.electronApp
  }
}

test.describe.serial('Project overview (active project, tips card)', () => {
  let electronApp: ElectronApplication
  let appWindow: Page
  let suiteTestInfo: TestInfo

  test.beforeAll(async ({}, testInfo) => {
    suiteTestInfo = testInfo
    const launched = await launchProjectOverviewHarness(testInfo)
    electronApp = launched.electronApp
    appWindow = launched.appWindow
    await remountProjectOverviewAfterStoreSeed(appWindow, defaultActiveProjectSeed, {
      totalDocumentCount: 2
    })
  })

  test.afterAll(async ({}, afterAllTestInfo) => {
    await tearDownFaPlaywrightElectronSerialSuite({
      afterAllTestInfo,
      electronApp,
      suiteTestInfo
    })
  })

  /**
   * ProjectOverview root section is present in the component-testing shell.
   */
  test('Check that the ProjectOverview wrapper is visible', async () => {
    await expect(appWindow.locator(`[data-test-locator="${selectorList.projectOverview}"]`)).toHaveCount(1)
  })

  /**
   * Subtitle uses the en-US project overview for string and is shown on the page.
   */
  test('Check that the project overview subtitle matches en-US copy', async () => {
    const subtitle = appWindow.locator(`[data-test-locator="${selectorList.projectOverviewSubtitle}"]`)
    await expect(subtitle).toBeVisible()
    await expect(subtitle).toHaveText(projectOverviewMessages.projectOverviewFor)
  })

  /**
   * Active project display name from the seeded Pinia session appears in the title row.
   */
  test('Check that the seeded project title is shown', async () => {
    const title = appWindow.locator(`[data-test-locator="${selectorList.projectOverviewProjectName}"]`)
    await expect(title).toBeVisible()
    await expect(title).toHaveText(PLAYWRIGHT_PROJECT_OVERVIEW_NAME)
  })

  /**
   * Tips card mirrors Tips, Tricks and Trivia notify copy: Did you know heading plus a markdown bullet line.
   */
  test('Check that the project overview tips card shows Did you know and a trivia line', async () => {
    test.setTimeout(90_000)
    const tipCard = appWindow.locator(`[data-test-locator="${selectorList.projectOverviewTipCard}"]`)
    await expect(tipCard).toBeVisible()

    const heading = tipCard.locator(`[data-test-locator="${selectorList.projectOverviewTipHeading}"]`)
    await expect(heading).toHaveText(unsortedAppTexts.didYouKnow)

    const tipMessage = tipCard.locator(`[data-test-locator="${selectorList.projectOverviewTipMessage}"]`)
    await expect(tipMessage).not.toBeEmpty()

    await expect.poll(async () => {
      const message = (await tipMessage.innerText()).trim().replace(/^-\s*/, '')
      if (message.length === 0) {
        return false
      }
      return allowedTipCaptions.some((caption) => caption.trim() === message || caption.trim().replace(/^-\s*/, '') === message)
    }, { timeout: 45_000 }).toBe(true)
  })

  /**
   * Default user settings show the Fantasia mascot in the tips card (hidePlushes false).
   */
  test('Check that the tips card shows the mascot image when plushes are enabled', async () => {
    const tipCard = appWindow.locator(`[data-test-locator="${selectorList.projectOverviewTipCard}"]`)
    await expect(tipCard.locator(`[data-test-locator="${selectorList.fantasiaMascotImage}"]`)).toHaveCount(1)
    await expect(tipCard.locator('.projectOverview__hintIcon')).toHaveCount(0)
  })
})

test.describe.serial('Project overview (tips card hidden)', () => {
  let electronApp: ElectronApplication
  let appWindow: Page
  let suiteTestInfo: TestInfo

  test.beforeAll(async ({}, testInfo) => {
    suiteTestInfo = testInfo
    const launched = await launchProjectOverviewHarness(testInfo)
    electronApp = launched.electronApp
    appWindow = launched.appWindow
    await remountProjectOverviewAfterStoreSeed(appWindow, {
      ...defaultActiveProjectSeed,
      hideTooltipsProject: true
    }, {
      totalDocumentCount: 2
    })
  })

  test.afterAll(async ({}, afterAllTestInfo) => {
    await tearDownFaPlaywrightElectronSerialSuite({
      afterAllTestInfo,
      electronApp,
      suiteTestInfo
    })
  })

  /**
   * Hide tips on project overview removes the tip card while the project title stays visible.
   */
  test('Check that hideTooltipsProject removes the tips card', async () => {
    await expect(appWindow.locator(`[data-test-locator="${selectorList.projectOverviewTipCard}"]`)).toHaveCount(0)
    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.projectOverviewProjectName}"]`)
    ).toHaveText(PLAYWRIGHT_PROJECT_OVERVIEW_NAME)
  })
})

test.describe.serial('Project overview (tips card help icon)', () => {
  let electronApp: ElectronApplication
  let appWindow: Page
  let suiteTestInfo: TestInfo

  test.beforeAll(async ({}, testInfo) => {
    suiteTestInfo = testInfo
    const launched = await launchProjectOverviewHarness(testInfo)
    electronApp = launched.electronApp
    appWindow = launched.appWindow
    await remountProjectOverviewAfterStoreSeed(appWindow, {
      ...defaultActiveProjectSeed,
      hidePlushes: true
    }, {
      totalDocumentCount: 2
    })
  })

  test.afterAll(async ({}, afterAllTestInfo) => {
    await tearDownFaPlaywrightElectronSerialSuite({
      afterAllTestInfo,
      electronApp,
      suiteTestInfo
    })
  })

  /**
   * hidePlushes removes the mascot from the tips card with no icon replacement.
   */
  test('Check that hidePlushes omits the mascot from the tips card', async () => {
    const tipCard = appWindow.locator(`[data-test-locator="${selectorList.projectOverviewTipCard}"]`)
    await expect(tipCard).toBeVisible()
    await expect(tipCard.locator(`[data-test-locator="${selectorList.fantasiaMascotImage}"]`)).toHaveCount(0)
    await expect(tipCard.locator('.projectOverview__hintIcon')).toHaveCount(0)
  })
})

test.describe.serial('Project overview (empty CTA createTemplate)', () => {
  let electronApp: ElectronApplication
  let appWindow: Page
  let suiteTestInfo: TestInfo

  test.beforeAll(async ({}, testInfo) => {
    suiteTestInfo = testInfo
    const launched = await launchProjectOverviewHarness(testInfo)
    electronApp = launched.electronApp
    appWindow = launched.appWindow
    await remountProjectOverviewAfterStoreSeed(appWindow, {
      ...defaultActiveProjectSeed,
      hierarchyTree: {
        worlds: [emptyWorldNoPlacements]
      },
      hideTooltipsProject: true
    }, {
      distribution: {
        counts: [],
        documentTemplateTotalCount: 0,
        templates: [],
        totalDocumentCount: 0,
        worlds: []
      }
    })
  })

  test.afterAll(async ({}, afterAllTestInfo) => {
    await tearDownFaPlaywrightElectronSerialSuite({
      afterAllTestInfo,
      electronApp,
      suiteTestInfo
    })
  })

  /**
   * Zero documents and zero templates show the welcome empty CTA and create-template button.
   */
  test('Check that empty CTA createTemplate shows welcome and create-template label', async () => {
    const emptyCta = appWindow.locator(`[data-test-locator="${selectorList.projectOverviewEmptyCta}"]`)
    await expect(emptyCta).toBeVisible()
    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.projectOverviewEmptyCtaWelcome}"]`)
    ).toHaveText(projectOverviewMessages.emptyCtaWelcome)
    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.projectOverviewEmptyCtaButton}"]`)
    ).toHaveText(projectOverviewMessages.emptyCtaCreateDocumentTemplate)
  })

  /**
   * createTemplate CTA click requests Project Settings on the document templates tab.
   */
  test('Check that empty CTA createTemplate click opens Project Settings templates', async () => {
    await resetDialogComponentState(appWindow)
    await appWindow.locator(`[data-test-locator="${selectorList.projectOverviewEmptyCtaButton}"]`).click()

    await expect.poll(async () => {
      return await readDialogComponentState(appWindow)
    }, { timeout: 15_000 }).toEqual({
      dialogToOpen: 'ProjectSettings',
      projectSettingsInitialTab: 'documentTemplatesSettings'
    })

    const settingsTitle = appWindow.locator(
      `[data-test-locator="${selectorList.dialogProjectSettingsTitle}"]`
    )
    if (await settingsTitle.count() > 0) {
      await expect(settingsTitle).toBeVisible()
    }
  })
})

test.describe.serial('Project overview (empty CTA assignTemplate)', () => {
  let electronApp: ElectronApplication
  let appWindow: Page
  let suiteTestInfo: TestInfo

  test.beforeAll(async ({}, testInfo) => {
    suiteTestInfo = testInfo
    const launched = await launchProjectOverviewHarness(testInfo)
    electronApp = launched.electronApp
    appWindow = launched.appWindow
    await remountProjectOverviewAfterStoreSeed(appWindow, {
      ...defaultActiveProjectSeed,
      hierarchyTree: {
        worlds: [emptyWorldNoPlacements]
      },
      hideTooltipsProject: true
    }, {
      distribution: {
        counts: [],
        documentTemplateTotalCount: 1,
        templates: [{
          icon: 'mdi-account',
          sortOrder: 0,
          templateId: TEMPLATE_ID,
          titlePluralTranslationsJson: '{"en-US":"Characters"}'
        }],
        totalDocumentCount: 0,
        worlds: []
      }
    })
  })

  test.afterAll(async ({}, afterAllTestInfo) => {
    await tearDownFaPlaywrightElectronSerialSuite({
      afterAllTestInfo,
      electronApp,
      suiteTestInfo
    })
  })

  /**
   * Templates exist without world placements: assign-template empty CTA label.
   */
  test('Check that empty CTA assignTemplate shows Assign your template button', async () => {
    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.projectOverviewEmptyCta}"]`)
    ).toBeVisible()
    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.projectOverviewEmptyCtaButton}"]`)
    ).toHaveText(projectOverviewMessages.emptyCtaAssignTemplate)
  })

  /**
   * assignTemplate CTA click requests Project Settings on the worlds tab.
   */
  test('Check that empty CTA assignTemplate click opens Project Settings worlds', async () => {
    await resetDialogComponentState(appWindow)
    await appWindow.locator(`[data-test-locator="${selectorList.projectOverviewEmptyCtaButton}"]`).click()

    await expect.poll(async () => {
      return await readDialogComponentState(appWindow)
    }, { timeout: 15_000 }).toEqual({
      dialogToOpen: 'ProjectSettings',
      projectSettingsInitialTab: 'worldsSettings'
    })
  })
})

test.describe.serial('Project overview (empty CTA createDocument)', () => {
  let electronApp: ElectronApplication
  let appWindow: Page
  let suiteTestInfo: TestInfo

  test.beforeAll(async ({}, testInfo) => {
    suiteTestInfo = testInfo
    const launched = await launchProjectOverviewHarness(testInfo)
    electronApp = launched.electronApp
    appWindow = launched.appWindow
    await remountProjectOverviewAfterStoreSeed(appWindow, {
      ...defaultActiveProjectSeed,
      hierarchyTree: {
        worlds: [worldWithPlacement]
      },
      hideTooltipsProject: true
    }, {
      distribution: {
        counts: [],
        documentTemplateTotalCount: 1,
        templates: [{
          icon: 'mdi-account',
          sortOrder: 0,
          templateId: TEMPLATE_ID,
          titlePluralTranslationsJson: '{"en-US":"Characters"}'
        }],
        totalDocumentCount: 0,
        worlds: []
      }
    })
  })

  test.afterAll(async ({}, afterAllTestInfo) => {
    await tearDownFaPlaywrightElectronSerialSuite({
      afterAllTestInfo,
      electronApp,
      suiteTestInfo
    })
  })

  /**
   * Placed template with zero documents shows create-first-document empty CTA.
   */
  test('Check that empty CTA createDocument shows Create your first document', async () => {
    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.projectOverviewEmptyCta}"]`)
    ).toBeVisible()
    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.projectOverviewEmptyCtaButton}"]`)
    ).toHaveText(projectOverviewMessages.emptyCtaCreateDocument)
  })

  /**
   * createDocument CTA click requests Quick Add Document dialog.
   */
  test('Check that empty CTA createDocument click opens Quick Add dialog', async () => {
    await resetDialogComponentState(appWindow)
    await appWindow.locator(`[data-test-locator="${selectorList.projectOverviewEmptyCtaButton}"]`).click()

    await expect.poll(async () => {
      return (await readDialogComponentState(appWindow)).dialogToOpen
    }, { timeout: 15_000 }).toBe('QuickAddDocument')

    const quickAddClose = appWindow.locator(
      `[data-test-locator="${selectorList.dialogQuickAddClose}"]`
    )
    if (await quickAddClose.count() > 0) {
      await expect(quickAddClose).toBeVisible()
    }
  })
})

test.describe.serial('Project overview (chart smoke)', () => {
  let electronApp: ElectronApplication
  let appWindow: Page
  let suiteTestInfo: TestInfo

  test.beforeAll(async ({}, testInfo) => {
    suiteTestInfo = testInfo
    const launched = await launchProjectOverviewHarness(testInfo)
    electronApp = launched.electronApp
    appWindow = launched.appWindow
    await remountProjectOverviewAfterStoreSeed(appWindow, {
      ...defaultActiveProjectSeed,
      hierarchyTree: {
        worlds: [worldWithPlacement]
      },
      hideTooltipsProject: true
    }, {
      distribution: chartDistributionFixture
    })
  })

  test.afterAll(async ({}, afterAllTestInfo) => {
    await tearDownFaPlaywrightElectronSerialSuite({
      afterAllTestInfo,
      electronApp,
      suiteTestInfo
    })
  })

  /**
   * Stubbed distribution with documents shows graph parent, total count label, and world legend help.
   */
  test('Check that chart smoke shows graph parent, doc count, and legend help', async () => {
    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.projectOverviewGraphParent}"]`)
    ).toBeVisible()
    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.projectOverviewEmptyCta}"]`)
    ).toHaveCount(0)

    const docCountLabel = appWindow.locator(
      `[data-test-locator="${selectorList.projectOverviewDocCountLabel}"]`
    )
    await expect(docCountLabel).toBeVisible()
    await expect(docCountLabel).toContainText(
      projectOverviewMessages.documentDistributionTitlePrefix
    )
    await expect(docCountLabel).toContainText(String(chartDistributionFixture.totalDocumentCount))

    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.projectOverviewWorldLegendHelpIcon}"]`)
    ).toBeVisible({ timeout: 15_000 })
  })
})

const lastOpenedTreeData: I_faProjectHierarchyTreeHeTreeNode[] = [
  {
    children: [
      {
        children: [
          {
            children: [],
            childrenLoaded: true,
            documentId: LAST_OPENED_DEAD_CATEGORY_DOC_ID,
            groupId: null,
            hasChildren: false,
            icon: 'mdi-folder-open',
            id: LAST_OPENED_DEAD_CATEGORY_DOC_ID,
            isCategory: true,
            label: 'Dead Category Hero',
            nodeKind: 'document',
            placementId: PLACEMENT_ID,
            worldColor: '#4caf50',
            worldId: WORLD_ID
          },
          {
            children: [],
            childrenLoaded: true,
            documentId: LAST_OPENED_PLAIN_DOC_ID,
            groupId: null,
            hasChildren: false,
            icon: 'mdi-account',
            id: LAST_OPENED_PLAIN_DOC_ID,
            isCategory: false,
            label: 'Plain Hero',
            nodeKind: 'document',
            placementId: PLACEMENT_ID,
            worldColor: '#4caf50',
            worldId: WORLD_ID
          }
        ],
        childrenLoaded: true,
        categoryCount: 1,
        documentCount: 2,
        documentId: null,
        documentTemplateId: TEMPLATE_ID,
        groupId: null,
        hasChildren: true,
        icon: 'mdi-account',
        id: PLACEMENT_ID,
        label: 'Heroes',
        nodeKind: 'templatePlacement',
        placementId: PLACEMENT_ID,
        titlePluralTranslations: { 'en-US': 'Characters' },
        titleSingularTranslations: { 'en-US': 'Character' },
        worldColor: '#4caf50',
        worldId: WORLD_ID
      }
    ],
    childrenLoaded: true,
    documentId: null,
    groupId: null,
    hasChildren: true,
    icon: '',
    id: WORLD_ID,
    label: 'Eldoria',
    nodeKind: 'world',
    placementId: null,
    worldColor: '#4caf50',
    worldId: WORLD_ID
  }
]

test.describe.serial('Project overview (last opened)', () => {
  let electronApp: ElectronApplication
  let appWindow: Page
  let suiteTestInfo: TestInfo

  const lastOpenedSeed: I_faComponentTestingStoreSeed = {
    ...defaultActiveProjectSeed,
    hierarchyTree: {
      treeData: lastOpenedTreeData,
      worlds: [worldWithPlacement]
    },
    hideTooltipsProject: true,
    openedDocuments: {
      activeDocumentId: null,
      tabs: []
    },
    projectContentOverrides: {
      documentsById: {
        [LAST_OPENED_DEAD_CATEGORY_DOC_ID]: buildSampleDocument({
          displayName: 'Dead Category Hero',
          id: LAST_OPENED_DEAD_CATEGORY_DOC_ID,
          isCategory: true,
          isDead: true
        }),
        [LAST_OPENED_PLAIN_DOC_ID]: buildSampleDocument({
          displayName: 'Plain Hero',
          id: LAST_OPENED_PLAIN_DOC_ID
        })
      },
      templatesById: {
        [TEMPLATE_ID]: sampleTemplate
      },
      worldsById: {
        [WORLD_ID]: sampleWorld
      }
    }
  }

  test.describe.configure({
    timeout: 180_000
  })

  test.beforeAll(async ({}, testInfo) => {
    suiteTestInfo = testInfo
    const launched = await launchProjectOverviewHarness(testInfo)
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
   * Stubbed last-opened items render the list with dead-category and plain rows.
   */
  test('Check that last opened list shows stubbed dead category and plain items', async () => {
    await remountProjectOverviewAfterStoreSeed(appWindow, lastOpenedSeed, {
      distribution: chartDistributionFixture,
      lastOpenedItems: lastOpenedItemsFixture
    })

    const lastOpened = appWindow.locator(`[data-test-locator="${selectorList.projectOverviewLastOpened}"]`)
    await expect(lastOpened).toBeVisible()
    await expect(
      lastOpened.locator(`[data-test-locator="${selectorList.projectOverviewLastOpenedTitle}"]`)
    ).toHaveText(projectOverviewMessages.lastOpenedTitle)

    const deadCategoryItem = appWindow.locator(
      `[data-test-locator="${lastOpenedItemLocator(LAST_OPENED_DEAD_CATEGORY_DOC_ID)}"]`
    )
    const plainItem = appWindow.locator(
      `[data-test-locator="${lastOpenedItemLocator(LAST_OPENED_PLAIN_DOC_ID)}"]`
    )
    await expect(deadCategoryItem).toBeVisible()
    await expect(plainItem).toBeVisible()
    await expect(deadCategoryItem).toContainText('Dead Category Hero')
    await expect(deadCategoryItem.locator('.projectOverview__lastOpenedDeadMarker')).toHaveText('†')
    await expect(plainItem).toContainText('Plain Hero')
  })

  /**
   * Left-click on a last-opened row opens that document via openHierarchyTreeDocument.
   */
  test('Check that last opened left-click opens the document', async () => {
    await remountProjectOverviewAfterStoreSeed(appWindow, lastOpenedSeed, {
      distribution: chartDistributionFixture,
      lastOpenedItems: lastOpenedItemsFixture,
      routePath: '/home'
    })

    await appWindow.locator(
      `[data-test-locator="${lastOpenedItemLocator(LAST_OPENED_PLAIN_DOC_ID)}"]`
    ).click()

    await expect.poll(async () => {
      const session = await readOpenedDocumentsSession(appWindow)
      return session.activeDocumentId
    }, { timeout: 15_000 }).toBe(LAST_OPENED_PLAIN_DOC_ID)

    const session = await readOpenedDocumentsSession(appWindow)
    expect(session.tabs.some((tab) => tab.documentId === LAST_OPENED_PLAIN_DOC_ID)).toBe(true)
  })

  /**
   * Middle-click (auxclick button 1) opens via middleBackground openMode.
   */
  test('Check that last opened middle-click opens the document in background mode', async () => {
    await remountProjectOverviewAfterStoreSeed(appWindow, lastOpenedSeed, {
      distribution: chartDistributionFixture,
      lastOpenedItems: lastOpenedItemsFixture,
      routePath: '/home'
    })

    await appWindow.locator(
      `[data-test-locator="${lastOpenedItemLocator(LAST_OPENED_PLAIN_DOC_ID)}"]`
    ).click()
    await expect.poll(async () => {
      return (await readOpenedDocumentsSession(appWindow)).activeDocumentId
    }, { timeout: 15_000 }).toBe(LAST_OPENED_PLAIN_DOC_ID)

    await remountProjectOverviewAfterStoreSeed(appWindow, {
      ...lastOpenedSeed,
      openedDocuments: {
        activeDocumentId: LAST_OPENED_PLAIN_DOC_ID,
        tabs: [
          buildPersistedOpenedTab({
            displayName: 'Plain Hero',
            documentId: LAST_OPENED_PLAIN_DOC_ID
          })
        ]
      }
    }, {
      distribution: chartDistributionFixture,
      lastOpenedItems: lastOpenedItemsFixture,
      routePath: '/home'
    })

    await appWindow.locator(
      `[data-test-locator="${lastOpenedItemLocator(LAST_OPENED_DEAD_CATEGORY_DOC_ID)}"]`
    ).click({
      button: 'middle'
    })

    await expect.poll(async () => {
      const session = await readOpenedDocumentsSession(appWindow)
      return session.tabs.some((tab) => tab.documentId === LAST_OPENED_DEAD_CATEGORY_DOC_ID)
    }, { timeout: 15_000 }).toBe(true)
  })

  /**
   * Context menu on a last-opened row exposes open, edit, copy, and delete actions.
   */
  test('Check that last opened context menu shows open edit copy and delete', async () => {
    await remountProjectOverviewAfterStoreSeed(appWindow, lastOpenedSeed, {
      distribution: chartDistributionFixture,
      lastOpenedItems: lastOpenedItemsFixture,
      routePath: '/home'
    })

    await appWindow.locator(
      `[data-test-locator="${lastOpenedItemLocator(LAST_OPENED_PLAIN_DOC_ID)}"]`
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
