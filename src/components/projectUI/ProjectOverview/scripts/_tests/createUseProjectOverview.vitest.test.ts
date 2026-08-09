import type {
  StoreGeneric,
  T_piniaStoreToRefs
} from 'app/types/I_vuePiniaInjected'
import type {
  I_createUseProjectOverviewDeps
} from 'app/types/I_faProjectOverview'
import type {
  I_faProjectDocumentDistributionResult,
  I_faProjectDocumentLastOpenedItem
} from 'app/types/I_faProjectDocumentLastOpenedDomain'

import { beforeEach, expect, test, vi } from 'vitest'
import { computed, ref } from 'vue'

import { resolveHideFantasiaMascot } from 'app/src/scripts/appGlobalManagementUI/functions/resolveHideFantasiaMascot'

import { createUseProjectOverview } from '../createUseProjectOverview'

const pickRandomTipCaptionMock = vi.fn(() => 'Random tip.')
const listDocumentDistributionMock = vi.fn(async (): Promise<I_faProjectDocumentDistributionResult> => {
  return {
    counts: [],
    templates: [],
    documentTemplateTotalCount: 0,
    totalDocumentCount: 0,
    worlds: []
  }
})
const listDocumentLastOpenedMock = vi.fn(async (): Promise<{ items: I_faProjectDocumentLastOpenedItem[] }> => {
  return { items: [] }
})
const runFaActionMock = vi.fn()

const activeProjectRef = ref<{ name: string } | null>(null)
const appSettingsDialogPreviewRef = ref<{
  appTheme?: string
  hidePlushes?: boolean
  hideTooltipsProject?: boolean
} | null>(null)
const settingsRef = ref<{
  appTheme?: string
  hidePlushes: boolean
  hideTooltipsProject: boolean
  languageCode?: string
} | null>({
  appTheme: 'darkThemeFantasy',
  hidePlushes: false,
  hideTooltipsProject: false,
  languageCode: 'en-US'
})
const worldsRef = ref<Array<{ color: string, id: string, placements: unknown[] }>>([])

const onMountedHooks: Array<() => void> = []
const onUnmountedHooks: Array<() => void> = []

const useProjectOverview = createUseProjectOverview({
  FA_DIALOG_PROJECT_SETTINGS_DOCUMENT_TEMPLATES_TAB: 'documentTemplatesSettings',
  FA_DIALOG_PROJECT_SETTINGS_WORLDS_TAB: 'worldsSettings',
  S_FaActiveProject: () => ({
    activeProject: activeProjectRef.value
  }) as unknown as StoreGeneric,
  S_FaProjectHierarchyTree: () => ({
    documentCensusRefreshGeneration: 0,
    worlds: worldsRef.value
  }) as unknown as StoreGeneric,
  S_FaUserSettings: () => ({
    settings: settingsRef.value
  }) as unknown as StoreGeneric,
  buildFaColorGlyphCssCustomProperties: (baseColor) => ({
    '--fa-color-glyph-base': baseColor,
    '--fa-color-glyph-highlight-base': '58%'
  }),
  computed,
  listDocumentDistribution: listDocumentDistributionMock,
  listDocumentLastOpened: listDocumentLastOpenedMock,
  onMounted: (hook) => {
    onMountedHooks.push(hook)
  },
  onUnmounted: (hook) => {
    onUnmountedHooks.push(hook)
  },
  pickRandomTipCaption: pickRandomTipCaptionMock,
  ref,
  resolveDocumentAppearanceChromeStyle: () => undefined,
  resolveHideFantasiaMascot,
  resolveTabWorldIndicatorColor: () => null,
  runFaAction: runFaActionMock,
  storeToRefs: ((store) => {
    if ('activeProject' in store) {
      return { activeProject: activeProjectRef }
    }
    if ('worlds' in store) {
      return { worlds: worldsRef }
    }
    return {
      appSettingsDialogPreview: appSettingsDialogPreviewRef,
      settings: settingsRef
    }
  }) as T_piniaStoreToRefs,
  t: (key) => key,
  watch: ((
    source: () => unknown,
    effect: (value?: unknown) => void,
    options?: { immediate?: boolean }
  ) => {
    if (options?.immediate === true) {
      effect(source())
    }
  }) as I_createUseProjectOverviewDeps['watch']
})

beforeEach(() => {
  onMountedHooks.length = 0
  onUnmountedHooks.length = 0
  activeProjectRef.value = null
  appSettingsDialogPreviewRef.value = null
  settingsRef.value = {
    appTheme: 'darkThemeFantasy',
    hidePlushes: false,
    hideTooltipsProject: false,
    languageCode: 'en-US'
  }
  worldsRef.value = []
  pickRandomTipCaptionMock.mockClear()
  listDocumentDistributionMock.mockClear()
  listDocumentLastOpenedMock.mockClear()
  listDocumentDistributionMock.mockResolvedValue({
    counts: [],
    templates: [],
    documentTemplateTotalCount: 0,
    totalDocumentCount: 0,
    worlds: []
  })
  listDocumentLastOpenedMock.mockResolvedValue({ items: [] })
  runFaActionMock.mockClear()
})

/**
 * createUseProjectOverview
 * Uses the active project name when a session is loaded.
 */
test('Test that useProjectOverview exposes the active project display name', () => {
  activeProjectRef.value = { name: 'FA, Ralia, Age of Magic Reborn' }

  const state = useProjectOverview()

  expect(state.projectDisplayName.value).toBe('FA, Ralia, Age of Magic Reborn')
})

/**
 * createUseProjectOverview
 * Falls back to the no-project label when nothing is loaded.
 */
test('Test that useProjectOverview uses the no-project label without an active project', () => {
  const state = useProjectOverview()

  expect(state.projectDisplayName.value).toBe('projectUI.projectOverview.noActiveProjectName')
})

/**
 * createUseProjectOverview
 * Tip card stays hidden while totalDocumentCount is zero even when tips are enabled.
 */
test('Test that useProjectOverview hides tip card when totalDocumentCount is zero', () => {
  const state = useProjectOverview()

  expect(state.showTipCard.value).toBe(false)
  expect(state.showEmptyCta.value).toBe(true)
})

/**
 * createUseProjectOverview
 * Loads overview data on mount and shows tip card only after documents exist.
 */
test('Test that useProjectOverview loads overview data and gates tip card on document count', async () => {
  listDocumentDistributionMock.mockResolvedValue({
    counts: [{
      documentCount: 2,
      templateId: 't1',
      worldId: 'w1'
    }],
    templates: [{
      icon: 'mdi-file',
      templateId: 't1',
      titlePluralTranslationsJson: '{"en-US":"Characters"}',
      sortOrder: 0
    }],
    documentTemplateTotalCount: 1,
    totalDocumentCount: 2,
    worlds: [{
      color: '#ff0000',
      displayNameTranslationsJson: '{"en-US":"World"}',
      sortOrder: 0,
      worldId: 'w1'
    }]
  })

  const state = useProjectOverview()
  onMountedHooks.forEach((hook) => hook())
  await Promise.resolve()
  await Promise.resolve()

  expect(pickRandomTipCaptionMock).toHaveBeenCalledTimes(1)
  expect(listDocumentDistributionMock).toHaveBeenCalledTimes(1)
  expect(listDocumentLastOpenedMock).toHaveBeenCalledTimes(1)
  expect(state.totalDocumentCount.value).toBe(2)
  expect(state.showTipCard.value).toBe(true)
  expect(state.showContentRow.value).toBe(true)
  expect(state.showEmptyCta.value).toBe(false)
})

/**
 * createUseProjectOverview
 * Hides tip card when hideTooltipsProject is on even with documents.
 */
test('Test that useProjectOverview hides the tip card when hideTooltipsProject is enabled', async () => {
  listDocumentDistributionMock.mockResolvedValue({
    counts: [],
    templates: [{
      icon: 'mdi-file',
      templateId: 't1',
      titlePluralTranslationsJson: '{"en-US":"Characters"}',
      sortOrder: 0
    }],
    documentTemplateTotalCount: 1,
    totalDocumentCount: 1,
    worlds: []
  })

  const state = useProjectOverview()
  onMountedHooks.forEach((hook) => hook())
  await Promise.resolve()
  await Promise.resolve()

  settingsRef.value = {
    appTheme: 'darkThemeFantasy',
    hidePlushes: true,
    hideTooltipsProject: true,
    languageCode: 'en-US'
  }

  expect(state.showTipCard.value).toBe(false)
  expect(state.showMascotInTipCard.value).toBe(false)
  expect(state.graphCardHeightPx.value).toBe(808)
  expect(state.chartHeightPx.value).toBe(666)
})

/**
 * createUseProjectOverview
 * Flat theme subtracts 23px from overview card and chart heights.
 */
test('Test that useProjectOverview shortens graph heights in flat theme', async () => {
  listDocumentDistributionMock.mockResolvedValue({
    counts: [],
    templates: [{
      icon: 'mdi-file',
      templateId: 't1',
      titlePluralTranslationsJson: '{"en-US":"Characters"}',
      sortOrder: 0
    }],
    documentTemplateTotalCount: 1,
    totalDocumentCount: 1,
    worlds: []
  })

  settingsRef.value = {
    appTheme: 'darkThemeFlat',
    hidePlushes: false,
    hideTooltipsProject: true,
    languageCode: 'en-US'
  }

  const state = useProjectOverview()
  onMountedHooks.forEach((hook) => hook())
  await Promise.resolve()
  await Promise.resolve()

  expect(state.graphCardHeightPx.value).toBe(785)
  expect(state.chartHeightPx.value).toBe(643)
})

/**
 * createUseProjectOverview
 * App Settings dialog preview for hideTooltipsProject does not change overview until Save.
 */
test('Test that useProjectOverview ignores hideTooltipsProject app settings dialog preview', async () => {
  listDocumentDistributionMock.mockResolvedValue({
    counts: [],
    templates: [],
    documentTemplateTotalCount: 0,
    totalDocumentCount: 1,
    worlds: []
  })
  settingsRef.value = {
    appTheme: 'darkThemeFantasy',
    hidePlushes: false,
    hideTooltipsProject: false,
    languageCode: 'en-US'
  }
  appSettingsDialogPreviewRef.value = {
    hideTooltipsProject: true
  }

  const state = useProjectOverview()
  onMountedHooks.forEach((hook) => hook())
  await Promise.resolve()
  await Promise.resolve()

  expect(state.showTipCard.value).toBe(true)
  expect(state.graphCardHeightPx.value).toBe(587)
  expect(state.chartHeightPx.value).toBe(445)
})

/**
 * createUseProjectOverview
 * Empty CTA opens Project Settings worlds tab when templates exist without placements.
 */
test('Test that useProjectOverview empty CTA opens worlds tab when templates need assign', async () => {
  listDocumentDistributionMock.mockResolvedValue({
    counts: [],
    templates: [{
      icon: 'mdi-file',
      templateId: 't1',
      titlePluralTranslationsJson: '{"en-US":"Characters"}',
      sortOrder: 0
    }],
    documentTemplateTotalCount: 1,
    totalDocumentCount: 0,
    worlds: []
  })
  worldsRef.value = [{
    color: '#111',
    id: 'w1',
    placements: []
  }]

  const state = useProjectOverview()
  onMountedHooks.forEach((hook) => hook())
  await Promise.resolve()
  await Promise.resolve()

  expect(state.emptyCtaMode.value).toBe('assignTemplate')
  state.onEmptyCtaClick()
  expect(runFaActionMock).toHaveBeenCalledWith('openProjectSettingsDialog', {
    initialTab: 'worldsSettings'
  })
})

/**
 * createUseProjectOverview
 * Empty CTA opens quick-add when templates are placed on a world.
 */
test('Test that useProjectOverview empty CTA opens quick-add when templates exist', async () => {
  listDocumentDistributionMock.mockResolvedValue({
    counts: [],
    templates: [{
      icon: 'mdi-file',
      templateId: 't1',
      titlePluralTranslationsJson: '{"en-US":"Characters"}',
      sortOrder: 0
    }],
    documentTemplateTotalCount: 1,
    totalDocumentCount: 0,
    worlds: []
  })
  worldsRef.value = [{
    color: '#111',
    id: 'w1',
    placements: [{}]
  }]

  const state = useProjectOverview()
  onMountedHooks.forEach((hook) => hook())
  await Promise.resolve()
  await Promise.resolve()

  expect(state.emptyCtaMode.value).toBe('createDocument')
  state.onEmptyCtaClick()
  expect(runFaActionMock).toHaveBeenCalledWith('openQuickAddDocumentDialog', undefined)
})

/**
 * createUseProjectOverview
 * Empty CTA opens Project Settings document templates tab when no templates exist.
 */
test('Test that useProjectOverview empty CTA opens Project Settings templates tab without templates', async () => {
  const state = useProjectOverview()
  onMountedHooks.forEach((hook) => hook())
  await Promise.resolve()
  await Promise.resolve()

  expect(state.emptyCtaMode.value).toBe('createTemplate')
  state.onEmptyCtaClick()
  expect(runFaActionMock).toHaveBeenCalledWith('openProjectSettingsDialog', {
    initialTab: 'documentTemplatesSettings'
  })
})

/**
 * createUseProjectOverview
 * Last-opened row click navigates via openHierarchyTreeDocument.
 */
test('Test that useProjectOverview last-opened click opens the hierarchy document', () => {
  const state = useProjectOverview()
  state.onLastOpenedRowClick('doc-1')
  expect(runFaActionMock).toHaveBeenCalledWith('openHierarchyTreeDocument', { documentId: 'doc-1' })
})
