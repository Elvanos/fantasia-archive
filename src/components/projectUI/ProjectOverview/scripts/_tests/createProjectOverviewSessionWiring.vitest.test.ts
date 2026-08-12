import type {
  StoreGeneric,
  T_piniaStoreToRefs
} from 'app/types/I_vuePiniaInjected'
import type {
  I_createUseProjectOverviewDeps
} from 'app/types/I_faProjectOverview'

import { expect, test, vi } from 'vitest'
import { computed, ref } from 'vue'

import { createProjectOverviewSession } from '../createProjectOverviewSessionWiring'

/**
 * createProjectOverviewSession
 * Generation getters fall back to 0 when hierarchy store omits census / last-opened gens.
 */
test('Test that createProjectOverviewSession generation getters fall back when missing', () => {
  const activeProjectRef = ref<{ id?: string, name: string } | null>({
    id: 'project-1',
    name: '  '
  })
  const appSettingsDialogPreviewRef = ref(null)
  const settingsRef = ref({
    hidePlushes: false,
    hideTooltipsProject: false
  })
  const worldsRef = ref([])
  const watchSources: Array<() => unknown> = []

  createProjectOverviewSession({
    FA_DIALOG_PROJECT_SETTINGS_DOCUMENT_TEMPLATES_TAB: 'documentTemplatesSettings',
    FA_DIALOG_PROJECT_SETTINGS_WORLDS_TAB: 'worldsSettings',
    S_FaActiveProject: () => ({
      activeProject: activeProjectRef.value
    }) as unknown as StoreGeneric,
    S_FaProjectHierarchyTree: () => ({
      worlds: worldsRef.value
    }) as unknown as StoreGeneric,
    S_FaUserSettings: () => ({
      settings: settingsRef.value
    }) as unknown as StoreGeneric,
    buildFaColorGlyphCssCustomProperties: () => ({
      '--fa-color-glyph-base': '#000',
      '--fa-color-glyph-highlight-base': '58%'
    }),
    computed,
    listDocumentDistribution: vi.fn(async () => ({
      counts: [],
      documentTemplateTotalCount: 0,
      templates: [],
      totalDocumentCount: 0,
      worlds: []
    })),
    listDocumentLastOpened: vi.fn(async () => ({ items: [] })),
    onMounted: vi.fn(),
    onUnmounted: vi.fn(),
    pickRandomTipCaption: () => 'tip',
    ref,
    resolveDocumentAppearanceChromeStyle: () => undefined,
    resolveHideFantasiaMascot: () => false,
    resolveTabWorldIndicatorColor: () => null,
    runFaAction: vi.fn(),
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
    watch: ((source: () => unknown) => {
      watchSources.push(source)
    }) as I_createUseProjectOverviewDeps['watch']
  })

  expect(watchSources.length).toBeGreaterThanOrEqual(2)
  const censusWatchSource = watchSources.find((source) => {
    const value = source()
    return Array.isArray(value) && value.length === 2
  })
  const lastOpenedWatchSource = watchSources.find((source) => {
    return typeof source() === 'number'
  })
  expect(censusWatchSource?.()).toEqual(['project-1', 0])
  expect(lastOpenedWatchSource?.()).toBe(0)
})

/**
 * createProjectOverviewSession
 * Generation getters read live census / last-opened values when present.
 */
test('Test that createProjectOverviewSession generation getters read store values', () => {
  const activeProjectRef = ref<{ id?: string, name: string } | null>(null)
  const appSettingsDialogPreviewRef = ref(null)
  const settingsRef = ref({
    hidePlushes: false,
    hideTooltipsProject: false
  })
  const worldsRef = ref([])
  const watchSources: Array<() => unknown> = []

  createProjectOverviewSession({
    FA_DIALOG_PROJECT_SETTINGS_DOCUMENT_TEMPLATES_TAB: 'documentTemplatesSettings',
    FA_DIALOG_PROJECT_SETTINGS_WORLDS_TAB: 'worldsSettings',
    S_FaActiveProject: () => ({
      activeProject: activeProjectRef.value
    }) as unknown as StoreGeneric,
    S_FaProjectHierarchyTree: () => ({
      documentCensusRefreshGeneration: 4,
      documentLastOpenedRefreshGeneration: 7,
      worlds: worldsRef.value
    }) as unknown as StoreGeneric,
    S_FaUserSettings: () => ({
      settings: settingsRef.value
    }) as unknown as StoreGeneric,
    buildFaColorGlyphCssCustomProperties: () => ({
      '--fa-color-glyph-base': '#000',
      '--fa-color-glyph-highlight-base': '58%'
    }),
    computed,
    listDocumentDistribution: vi.fn(async () => ({
      counts: [],
      documentTemplateTotalCount: 0,
      templates: [],
      totalDocumentCount: 0,
      worlds: []
    })),
    listDocumentLastOpened: vi.fn(async () => ({ items: [] })),
    onMounted: vi.fn(),
    onUnmounted: vi.fn(),
    pickRandomTipCaption: () => 'tip',
    ref,
    resolveDocumentAppearanceChromeStyle: () => undefined,
    resolveHideFantasiaMascot: () => false,
    resolveTabWorldIndicatorColor: () => null,
    runFaAction: vi.fn(),
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
    watch: ((source: () => unknown) => {
      watchSources.push(source)
    }) as I_createUseProjectOverviewDeps['watch']
  })

  const censusWatchSource = watchSources.find((source) => {
    const value = source()
    return Array.isArray(value) && value.length === 2
  })
  const lastOpenedWatchSource = watchSources.find((source) => {
    return typeof source() === 'number'
  })
  expect(censusWatchSource?.()).toEqual([null, 4])
  expect(lastOpenedWatchSource?.()).toBe(7)
})
