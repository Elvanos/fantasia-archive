import type { CSSProperties } from 'vue'

import type {
  I_faProjectDocumentDistributionResult,
  I_faProjectDocumentLastOpenedItem
} from 'app/types/I_faProjectDocumentLastOpenedDomain'
import type { I_faDocumentAppearanceChromeStyle } from 'app/types/I_faDocumentAppearanceChromeStyle'
import type { I_faColorGlyphCssCustomProperties } from 'app/types/I_faColorContrast'
import type { I_faProjectHierarchyTreeWorkspaceWorld } from 'app/types/I_faProjectHierarchyTreeDomain'
import type { I_faProjectOverviewChartSeries } from 'app/types/I_faProjectOverviewChart'
import type { I_faUserSettings } from 'app/types/I_faUserSettingsDomain'
import type { I_computedRef, I_ref } from 'app/types/I_vueCompositionShims'
import type {
  StoreGeneric,
  T_piniaStoreToRefs
} from 'app/types/I_vuePiniaInjected'
import type { I_faActionPayloadMap, T_faActionId } from 'app/types/I_faActionManagerDomain'

/**
 * Empty-project CTA action when total document count is zero.
 */
export type T_faProjectOverviewEmptyCtaMode =
  | 'assignTemplate'
  | 'createDocument'
  | 'createTemplate'

/**
 * Injected deps for createUseProjectOverview.
 */
export interface I_createUseProjectOverviewDeps {
  FA_DIALOG_PROJECT_SETTINGS_DOCUMENT_TEMPLATES_TAB: string
  FA_DIALOG_PROJECT_SETTINGS_WORLDS_TAB: string
  S_FaActiveProject: () => StoreGeneric
  S_FaProjectHierarchyTree: () => StoreGeneric
  S_FaUserSettings: () => StoreGeneric
  buildFaColorGlyphCssCustomProperties: (
    baseColor: string
  ) => I_faColorGlyphCssCustomProperties
  computed: <T>(getter: () => T) => I_computedRef<T>
  listDocumentDistribution: () => Promise<I_faProjectDocumentDistributionResult>
  listDocumentLastOpened: () => Promise<{ items: I_faProjectDocumentLastOpenedItem[] }>
  onMounted: (hook: () => void) => void
  onUnmounted: (hook: () => void) => void
  pickRandomTipCaption: () => string
  ref: <T>(value: T) => I_ref<T>
  resolveDocumentAppearanceChromeStyle: (input: {
    documentBackgroundColor: string
    documentTextColor: string
  }) => I_faDocumentAppearanceChromeStyle | undefined
  resolveHideFantasiaMascot: (
    settings: I_faUserSettings | null,
    preview: Partial<I_faUserSettings> | null
  ) => boolean
  resolveTabWorldIndicatorColor: (input: {
    projectWorldCount: number
    tab: { worldId: string }
    worlds: readonly Pick<I_faProjectHierarchyTreeWorkspaceWorld, 'color' | 'id'>[]
  }) => string | null
  runFaAction: <TId extends T_faActionId>(
    id: TId,
    payload: I_faActionPayloadMap[TId]
  ) => void
  storeToRefs: T_piniaStoreToRefs
  t: (key: string) => string
  watch: {
    (
      source: () => readonly [string | null, number],
      effect: () => void
    ): void
    (
      source: () => number,
      effect: () => void
    ): void
    (
      source: () => boolean,
      effect: (active: boolean) => void,
      options?: { immediate?: boolean }
    ): void
  }
}

/**
 * Public API returned by useProjectOverview.
 */
export interface I_useProjectOverviewApi {
  chartLoading: I_ref<boolean>
  chartHeightPx: I_computedRef<number>
  chartOptions: I_ref<Record<string, unknown>>
  chartSeries: I_ref<I_faProjectOverviewChartSeries[]>
  emptyCtaMode: I_computedRef<T_faProjectOverviewEmptyCtaMode>
  graphCardHeightPx: I_computedRef<number>
  graphCardWidthPx: I_ref<number>
  hasDocumentTemplates: I_ref<boolean>
  lastOpenedItems: I_ref<I_faProjectDocumentLastOpenedItem[]>
  onEmptyCtaClick: () => void
  onLastOpenedRowClick: (documentId: string) => void
  onLastOpenedContextAddUnder: (documentId: string) => void
  onLastOpenedContextCopyBackgroundColor: (documentId: string) => void
  onLastOpenedContextCopyDocument: (documentId: string) => void
  onLastOpenedContextCopyName: (documentId: string) => void
  onLastOpenedContextCopyTextColor: (documentId: string) => void
  onLastOpenedContextDelete: (documentId: string) => void
  onLastOpenedContextEdit: (documentId: string) => void
  onLastOpenedContextOpen: (documentId: string) => void
  onLastOpenedRowAuxClick: (documentId: string, event: MouseEvent) => void
  projectDisplayName: I_computedRef<string>
  randomTipCaption: I_ref<string>
  resolveLastOpenedItemChromeStyle: (
    item: I_faProjectDocumentLastOpenedItem
  ) => CSSProperties | undefined
  resolveLastOpenedWorldIndicatorColor: (
    item: I_faProjectDocumentLastOpenedItem
  ) => string | null
  showContentRow: I_computedRef<boolean>
  showEmptyCta: I_computedRef<boolean>
  showMascotInTipCard: I_computedRef<boolean>
  showTipCard: I_computedRef<boolean>
  showWorldIndicators: I_computedRef<boolean>
  totalDocumentCount: I_ref<number>
}

/**
 * Input for wireProjectOverviewSessionBehaviors.
 */
export interface I_wireProjectOverviewSessionBehaviorsInput {
  appSettingsDialogPreview: I_ref<Partial<I_faUserSettings> | null | undefined>
  chartLoading: I_ref<boolean>
  chartOptions: I_ref<Record<string, unknown>>
  chartSeries: I_ref<I_faProjectOverviewChartSeries[]>
  deps: I_createUseProjectOverviewDeps
  graphCardWidthPx: I_ref<number>
  hasDocumentTemplates: I_ref<boolean>
  lastOpenedItems: I_ref<I_faProjectDocumentLastOpenedItem[]>
  settings: I_ref<I_faUserSettings | null | undefined>
  totalDocumentCount: I_ref<number>
  worlds: I_ref<I_faProjectHierarchyTreeWorkspaceWorld[] | undefined>
}

/**
 * Behavior bindings produced by wireProjectOverviewSessionBehaviors.
 */
export interface I_wireProjectOverviewSessionBehaviorsResult {
  clearChartSettleTimer: () => void
  chartHeightPx: I_useProjectOverviewApi['chartHeightPx']
  emptyCtaMode: I_useProjectOverviewApi['emptyCtaMode']
  graphCardHeightPx: I_useProjectOverviewApi['graphCardHeightPx']
  loadOverviewData: () => Promise<void>
  refreshLastOpenedAfterMru: () => Promise<void>
  onEmptyCtaClick: () => void
  onLastOpenedContextAddUnder: (documentId: string) => void
  onLastOpenedContextCopyBackgroundColor: (documentId: string) => void
  onLastOpenedContextCopyDocument: (documentId: string) => void
  onLastOpenedContextCopyName: (documentId: string) => void
  onLastOpenedContextCopyTextColor: (documentId: string) => void
  onLastOpenedContextDelete: (documentId: string) => void
  onLastOpenedContextEdit: (documentId: string) => void
  onLastOpenedContextOpen: (documentId: string) => void
  onLastOpenedRowAuxClick: (documentId: string, event: MouseEvent) => void
  onLastOpenedRowClick: (documentId: string) => void
  resolveLastOpenedItemChromeStyle: I_useProjectOverviewApi['resolveLastOpenedItemChromeStyle']
  resolveLastOpenedWorldIndicatorColor: I_useProjectOverviewApi['resolveLastOpenedWorldIndicatorColor']
  showContentRow: I_useProjectOverviewApi['showContentRow']
  showEmptyCta: I_useProjectOverviewApi['showEmptyCta']
  showMascotInTipCard: I_useProjectOverviewApi['showMascotInTipCard']
  showTipCard: I_useProjectOverviewApi['showTipCard']
  showWorldIndicators: I_useProjectOverviewApi['showWorldIndicators']
}
