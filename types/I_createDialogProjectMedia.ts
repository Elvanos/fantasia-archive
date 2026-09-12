import type { I_dialogComponentStoreLike } from 'app/types/I_dialogComponentStoreLike'
import type { T_dialogName } from 'app/types/T_appDialogsAndDocuments'
import type {
  I_faProjectMedia,
  I_faProjectMediaMassEditRow,
  I_faProjectMediaUpsertItem,
  T_faProjectMediaPanel
} from 'app/types/I_faProjectMediaDomain'
import type { I_computedRef, I_ref } from 'app/types/I_vueCompositionShims'
import type {
  I_bindDialogProjectMediaSingleEditBound,
  I_bindDialogProjectMediaSingleEditInput,
  I_dialogProjectMediaSingleEditKeydownEvent
} from 'app/types/I_bindDialogProjectMediaSingleEdit'

/** Injected deps for createDialogProjectMedia. */
export interface I_createDialogProjectMediaDeps {
  applyListLoad: (input: {
    generation: { value: number }
    listItems: I_ref<I_faProjectMedia[]>
    loadListMedia: () => Promise<I_faProjectMedia[]>
  }) => Promise<void>
  attachWatches: (input: {
    dialogModel: I_ref<boolean>
    getDirectInput: () => T_dialogName | undefined
    getRequestedPanel: () => T_faProjectMediaPanel
    isDialogProjectMediaDirectInput: (input: T_dialogName | undefined) => boolean
    isDialogProjectMediaStoreTarget: (dialogToOpen: unknown) => boolean
    listLoadGeneration: { value: number }
    listMediaItems: I_ref<I_faProjectMedia[]>
    loadListMedia: () => Promise<I_faProjectMedia[]>
    massEditRows: I_ref<I_faProjectMediaMassEditRow[]>
    onlineUrlsDraft: I_ref<string>
    openDialog: (input: T_dialogName) => void
    resolveDialogComponentStore: () => I_dialogComponentStoreLike | null
    selectedPanel: I_ref<T_faProjectMediaPanel>
    singleEditBaseline: I_ref<I_faProjectMediaMassEditRow | null>
    singleEditDraft: I_ref<I_faProjectMediaMassEditRow | null>
    singleEditSlideOpen: I_ref<boolean>
    watch: (source: () => unknown, effect: () => void) => void
  }) => void
  attachWindowKeydown: (
    handler: (event: I_dialogProjectMediaSingleEditKeydownEvent) => void
  ) => void
  bindSingleEdit: (
    input: I_bindDialogProjectMediaSingleEditInput
  ) => I_bindDialogProjectMediaSingleEditBound
  bindUse: (
    deps: I_createDialogProjectMediaDeps,
    props: I_dialogProjectMediaProps
  ) => I_dialogProjectMediaBound
  bindMassEditSave: (input: {
    dialogModel: I_ref<boolean>
    mapRowsToUpsertItems: (rows: I_faProjectMediaMassEditRow[]) => I_faProjectMediaUpsertItem[]
    massEditRows: I_ref<I_faProjectMediaMassEditRow[]>
    runFaActionAwait: (
      id: 'saveProjectMedia',
      payload: { items: I_faProjectMediaUpsertItem[] }
    ) => Promise<boolean>
    selectedPanel: I_ref<T_faProjectMediaPanel>
  }) => {
    saveAndBackToList: () => Promise<void>
    saveAndClose: () => Promise<void>
  }
  bindSingleEditSave: (input: {
    closeSlide: () => void
    dialogModel: I_ref<boolean>
    draft: I_ref<I_faProjectMediaMassEditRow | null>
    mapRowToUpsertItem: (row: I_faProjectMediaMassEditRow) => I_faProjectMediaUpsertItem
    rebindDraftFromList: (id: string) => void
    reloadList: () => Promise<void>
    runFaActionAwait: (
      id: 'saveProjectMedia',
      payload: { items: I_faProjectMediaUpsertItem[] }
    ) => Promise<boolean>
  }) => {
    saveAndCloseDialog: () => Promise<void>
    saveSlide: () => Promise<void>
    saveSlideStay: () => Promise<void>
  }
  computed: <T>(getter: () => T) => I_computedRef<T>
  createMassEditRowsFromOnlineUrlsDraft: (draft: string) => I_faProjectMediaMassEditRow[]
  detachWindowKeydown: (
    handler: (event: I_dialogProjectMediaSingleEditKeydownEvent) => void
  ) => void
  getRequestedPanel: () => T_faProjectMediaPanel
  hasFaProjectMediaOnlineUrlDraftContent: (draft: string) => boolean
  isDialogProjectMediaDirectInput: (input: T_dialogName | undefined) => boolean
  isDialogProjectMediaStoreTarget: (dialogToOpen: unknown) => boolean
  isMassEditRowDirty: (
    draft: I_faProjectMediaMassEditRow | null,
    baseline: I_faProjectMediaMassEditRow | null
  ) => boolean
  loadListMedia: () => Promise<I_faProjectMedia[]>
  mapMediaToMassEditRow: (item: I_faProjectMedia) => I_faProjectMediaMassEditRow
  mapRowToUpsertItem: (row: I_faProjectMediaMassEditRow) => I_faProjectMediaUpsertItem
  mapRowsToUpsertItems: (rows: I_faProjectMediaMassEditRow[]) => I_faProjectMediaUpsertItem[]
  normalizeFaProjectMediaPanel: (value: unknown) => T_faProjectMediaPanel
  onBeforeUnmount: (hook: () => void) => void
  onMounted: (hook: () => void) => void
  ref: <T>(value: T) => I_ref<T>
  registerComponentDialogStackGuard: (dialogModel: I_ref<boolean>) => void
  resolveDialogComponentStore: () => I_dialogComponentStoreLike | null
  resolveFaProjectMediaDialogPersistent: (input: {
    onlineUrlsDraft: string
    selectedPanel: T_faProjectMediaPanel
    singleEditDirty: boolean
  }) => boolean
  resolveFaProjectMediaDialogTitleI18nKey: (selectedPanel: T_faProjectMediaPanel) => string
  runFaActionAwait: (
    id: 'saveProjectMedia',
    payload: { items: I_faProjectMediaUpsertItem[] }
  ) => Promise<boolean>
  submitOnlineUrlsIntake: (input: {
    createMassEditRowsFromOnlineUrlsDraft: (draft: string) => I_faProjectMediaMassEditRow[]
    massEditRows: I_ref<I_faProjectMediaMassEditRow[]>
    onlineUrlsDraft: I_ref<string>
    selectedPanel: I_ref<T_faProjectMediaPanel>
  }) => void
  watch: (source: () => unknown, effect: () => void) => void
}

/** Props for useDialogProjectMedia. */
export interface I_dialogProjectMediaProps {
  directInput?: T_dialogName | undefined
  initialPanel?: T_faProjectMediaPanel | undefined
}

/** Inner chrome bind after single-edit session exists. */
export interface I_bindDialogProjectMediaSessionChromeInput {
  deps: I_createDialogProjectMediaDeps
  dialogModel: I_ref<boolean>
  documentName: I_ref<string>
  isAddOnlineUrlsPanel: I_computedRef<boolean>
  isMassEditPanel: I_computedRef<boolean>
  isOnlineUrlsSubmitDisabled: I_computedRef<boolean>
  listLoadGeneration: { value: number }
  listMediaItems: I_ref<I_faProjectMedia[]>
  massEditRows: I_ref<I_faProjectMediaMassEditRow[]>
  onlineUrlsDraft: I_ref<string>
  props: I_dialogProjectMediaProps
  searchQuery: I_ref<string>
  selectedPanel: I_ref<T_faProjectMediaPanel>
  singleEdit: I_bindDialogProjectMediaSingleEditBound
}

/** Inputs for collectDialogProjectMediaBound. */
export interface I_collectDialogProjectMediaBoundInput {
  dialogModel: I_ref<boolean>
  dialogTitleI18nKey: I_computedRef<string>
  documentName: I_ref<string>
  isAddOnlineUrlsPanel: I_computedRef<boolean>
  isMassEditPanel: I_computedRef<boolean>
  isOnlineUrlsSubmitDisabled: I_computedRef<boolean>
  isPersistent: I_computedRef<boolean>
  listMediaItems: I_ref<I_faProjectMedia[]>
  massEditRows: I_ref<I_faProjectMediaMassEditRow[]>
  onlineUrlsDraft: I_ref<string>
  saveAndBackToList: () => Promise<void>
  saveAndClose: () => Promise<void>
  searchQuery: I_ref<string>
  selectedPanel: I_ref<T_faProjectMediaPanel>
  showAddOnlineUrlsPanel: () => void
  singleEdit: I_bindDialogProjectMediaSingleEditBound
  submitOnlineUrls: () => void
}

/** Bound DialogProjectMedia session. */
export interface I_dialogProjectMediaBound {
  closeSingleEditDialog: () => void
  closeSingleEditSlide: () => void
  discardSingleEditSlide: () => void
  dialogModel: I_ref<boolean>
  dialogTitleI18nKey: I_computedRef<string>
  documentName: I_ref<string>
  isAddOnlineUrlsPanel: I_computedRef<boolean>
  isMassEditPanel: I_computedRef<boolean>
  isOnlineUrlsSubmitDisabled: I_computedRef<boolean>
  isPersistent: I_computedRef<boolean>
  isSingleEditSaveDisabled: I_computedRef<boolean>
  isSingleEditSlideOpen: I_ref<boolean>
  listMediaItems: I_ref<I_faProjectMedia[]>
  massEditRows: I_ref<I_faProjectMediaMassEditRow[]>
  onlineUrlsDraft: I_ref<string>
  isSlideNextDisabled: I_computedRef<boolean>
  isSlidePreviousDisabled: I_computedRef<boolean>
  openSingleEditSlide: (item: I_faProjectMedia) => void
  openSingleEditSlideNext: () => void
  openSingleEditSlidePrevious: () => void
  saveAndBackToList: () => Promise<void>
  saveAndClose: () => Promise<void>
  saveSingleEditAndCloseDialog: () => Promise<void>
  saveSingleEditSlide: () => Promise<void>
  saveSingleEditSlideStay: () => Promise<void>
  searchQuery: I_ref<string>
  selectedPanel: I_ref<T_faProjectMediaPanel>
  showAddOnlineUrlsPanel: () => void
  showGenericClose: I_computedRef<boolean>
  singleEditDraft: I_ref<I_faProjectMediaMassEditRow | null>
  submitOnlineUrls: () => void
}
