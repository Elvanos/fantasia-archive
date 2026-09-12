import type {
  I_bindDialogProjectMediaSessionChromeInput,
  I_collectDialogProjectMediaBoundInput,
  I_createDialogProjectMediaDeps,
  I_dialogProjectMediaBound,
  I_dialogProjectMediaProps
} from 'app/types/I_createDialogProjectMedia'
import type { T_dialogName } from 'app/types/T_appDialogsAndDocuments'
import type {
  I_faProjectMedia,
  I_faProjectMediaMassEditRow,
  T_faProjectMediaPanel
} from 'app/types/I_faProjectMediaDomain'

import { wireDialogProjectMediaSingleEditPersistence } from './functions/dialogProjectMediaSingleEditNav'

const addOnlineUrlsPanel: T_faProjectMediaPanel = 'mediaAddOnlineUrls'
const massEditPanel: T_faProjectMediaPanel = 'mediaMassEdit'

export function bindUseDialogProjectMedia (
  deps: I_createDialogProjectMediaDeps,
  props: I_dialogProjectMediaProps
): I_dialogProjectMediaBound {
  const dialogModel = deps.ref(false)
  deps.registerComponentDialogStackGuard(dialogModel)
  const documentName = deps.ref('')
  const searchQuery = deps.ref('')
  const selectedPanel = deps.ref(deps.normalizeFaProjectMediaPanel(undefined))
  const onlineUrlsDraft = deps.ref('')
  const massEditRows = deps.ref([] as I_faProjectMediaMassEditRow[])
  const listMediaItems = deps.ref([] as I_faProjectMedia[])
  const listLoadGeneration = { value: 0 }
  const isMassEditPanel = deps.computed(() => {
    return selectedPanel.value === massEditPanel
  })
  const isAddOnlineUrlsPanel = deps.computed(() => {
    return selectedPanel.value === addOnlineUrlsPanel
  })
  const isOnlineUrlsSubmitDisabled = deps.computed(() => {
    return !deps.hasFaProjectMediaOnlineUrlDraftContent(onlineUrlsDraft.value)
  })
  const singleEdit = deps.bindSingleEdit({
    applyListLoad: deps.applyListLoad,
    attachWindowKeydown: deps.attachWindowKeydown,
    bindSingleEditSave: deps.bindSingleEditSave,
    computed: deps.computed,
    detachWindowKeydown: deps.detachWindowKeydown,
    dialogModel,
    isAddOnlineUrlsPanel,
    isDirtyFn: deps.isMassEditRowDirty,
    isMassEditPanel,
    listLoadGeneration,
    listMediaItems,
    loadListMedia: deps.loadListMedia,
    mapItemToRow: deps.mapMediaToMassEditRow,
    mapRowToUpsertItem: deps.mapRowToUpsertItem,
    onBeforeUnmount: deps.onBeforeUnmount,
    ref: deps.ref,
    runFaActionAwait: deps.runFaActionAwait,
    selectedPanel,
    watch: deps.watch,
    wirePersistence: wireDialogProjectMediaSingleEditPersistence
  })
  return bindDialogProjectMediaSessionChrome({
    deps,
    dialogModel,
    documentName,
    isAddOnlineUrlsPanel,
    isMassEditPanel,
    isOnlineUrlsSubmitDisabled,
    listLoadGeneration,
    listMediaItems,
    massEditRows,
    onlineUrlsDraft,
    props,
    searchQuery,
    selectedPanel,
    singleEdit
  })
}

function bindDialogProjectMediaSessionChrome (
  input: I_bindDialogProjectMediaSessionChromeInput
): I_dialogProjectMediaBound {
  const isPersistent = input.deps.computed(() => {
    return input.deps.resolveFaProjectMediaDialogPersistent({
      onlineUrlsDraft: input.onlineUrlsDraft.value,
      selectedPanel: input.selectedPanel.value,
      singleEditDirty: input.singleEdit.isSingleEditDirty.value
    })
  })
  const dialogTitleI18nKey = input.deps.computed(() => {
    return input.deps.resolveFaProjectMediaDialogTitleI18nKey(input.selectedPanel.value)
  })
  const { saveAndBackToList, saveAndClose } = input.deps.bindMassEditSave({
    dialogModel: input.dialogModel,
    mapRowsToUpsertItems: input.deps.mapRowsToUpsertItems,
    massEditRows: input.massEditRows,
    runFaActionAwait: input.deps.runFaActionAwait,
    selectedPanel: input.selectedPanel
  })
  const showAddOnlineUrlsPanel = bindShowAddOnlineUrlsPanel(input.selectedPanel)
  const submitOnlineUrls = bindSubmitOnlineUrls(input)
  const openDialog = bindOpenDialog(input)
  input.deps.attachWatches({
    dialogModel: input.dialogModel,
    getDirectInput: () => input.props.directInput,
    getRequestedPanel: input.deps.getRequestedPanel,
    isDialogProjectMediaDirectInput: input.deps.isDialogProjectMediaDirectInput,
    isDialogProjectMediaStoreTarget: input.deps.isDialogProjectMediaStoreTarget,
    listLoadGeneration: input.listLoadGeneration,
    listMediaItems: input.listMediaItems,
    loadListMedia: input.deps.loadListMedia,
    massEditRows: input.massEditRows,
    onlineUrlsDraft: input.onlineUrlsDraft,
    openDialog,
    resolveDialogComponentStore: input.deps.resolveDialogComponentStore,
    selectedPanel: input.selectedPanel,
    singleEditBaseline: input.singleEdit.singleEditBaseline,
    singleEditDraft: input.singleEdit.singleEditDraft,
    singleEditSlideOpen: input.singleEdit.isSingleEditSlideOpen,
    watch: input.deps.watch
  })
  input.deps.onMounted(() => {
    if (input.deps.isDialogProjectMediaDirectInput(input.props.directInput)) {
      openDialog(input.props.directInput as T_dialogName)
    }
  })
  return collectDialogProjectMediaBound({
    dialogModel: input.dialogModel,
    dialogTitleI18nKey,
    documentName: input.documentName,
    isAddOnlineUrlsPanel: input.isAddOnlineUrlsPanel,
    isMassEditPanel: input.isMassEditPanel,
    isOnlineUrlsSubmitDisabled: input.isOnlineUrlsSubmitDisabled,
    isPersistent,
    listMediaItems: input.listMediaItems,
    massEditRows: input.massEditRows,
    onlineUrlsDraft: input.onlineUrlsDraft,
    saveAndBackToList,
    saveAndClose,
    searchQuery: input.searchQuery,
    selectedPanel: input.selectedPanel,
    showAddOnlineUrlsPanel,
    singleEdit: input.singleEdit,
    submitOnlineUrls
  })
}

function bindShowAddOnlineUrlsPanel (
  selectedPanel: I_bindDialogProjectMediaSessionChromeInput['selectedPanel']
): () => void {
  function showAddOnlineUrlsPanel (): void {
    selectedPanel.value = addOnlineUrlsPanel
  }
  return showAddOnlineUrlsPanel
}

function bindSubmitOnlineUrls (
  input: I_bindDialogProjectMediaSessionChromeInput
): () => void {
  function submitOnlineUrls (): void {
    input.deps.submitOnlineUrlsIntake({
      createMassEditRowsFromOnlineUrlsDraft: input.deps.createMassEditRowsFromOnlineUrlsDraft,
      massEditRows: input.massEditRows,
      onlineUrlsDraft: input.onlineUrlsDraft,
      selectedPanel: input.selectedPanel
    })
  }
  return submitOnlineUrls
}

function bindOpenDialog (
  input: I_bindDialogProjectMediaSessionChromeInput
): (name: T_dialogName) => void {
  function resolveOpenPanel (): T_faProjectMediaPanel {
    if (input.props.initialPanel !== undefined) {
      return input.deps.normalizeFaProjectMediaPanel(input.props.initialPanel)
    }
    return input.deps.getRequestedPanel()
  }
  function openDialog (name: T_dialogName): void {
    input.documentName.value = name
    input.selectedPanel.value = resolveOpenPanel()
    input.dialogModel.value = true
  }
  return openDialog
}

function collectDialogProjectMediaBound (
  input: I_collectDialogProjectMediaBoundInput
): I_dialogProjectMediaBound {
  const closeSingleEditDialog = input.singleEdit.closeSingleEditDialog
  const closeSingleEditSlide = input.singleEdit.closeSingleEditSlide
  const discardSingleEditSlide = input.singleEdit.discardSingleEditSlide
  const dialogModel = input.dialogModel
  const dialogTitleI18nKey = input.dialogTitleI18nKey
  const documentName = input.documentName
  const isAddOnlineUrlsPanel = input.isAddOnlineUrlsPanel
  const isMassEditPanel = input.isMassEditPanel
  const isOnlineUrlsSubmitDisabled = input.isOnlineUrlsSubmitDisabled
  const isPersistent = input.isPersistent
  const isSingleEditSaveDisabled = input.singleEdit.isSingleEditSaveDisabled
  const isSingleEditSlideOpen = input.singleEdit.isSingleEditSlideOpen
  const isSlideNextDisabled = input.singleEdit.isSlideNextDisabled
  const isSlidePreviousDisabled = input.singleEdit.isSlidePreviousDisabled
  const listMediaItems = input.listMediaItems
  const massEditRows = input.massEditRows
  const onlineUrlsDraft = input.onlineUrlsDraft
  const openSingleEditSlide = input.singleEdit.openSingleEditSlide
  const openSingleEditSlideNext = input.singleEdit.openSingleEditSlideNext
  const openSingleEditSlidePrevious = input.singleEdit.openSingleEditSlidePrevious
  const saveAndBackToList = input.saveAndBackToList
  const saveAndClose = input.saveAndClose
  const saveSingleEditAndCloseDialog = input.singleEdit.saveSingleEditAndCloseDialog
  const saveSingleEditSlide = input.singleEdit.saveSingleEditSlide
  const saveSingleEditSlideStay = input.singleEdit.saveSingleEditSlideStay
  const searchQuery = input.searchQuery
  const selectedPanel = input.selectedPanel
  const showAddOnlineUrlsPanel = input.showAddOnlineUrlsPanel
  const showGenericClose = input.singleEdit.showGenericClose
  const singleEditDraft = input.singleEdit.singleEditDraft
  const submitOnlineUrls = input.submitOnlineUrls
  return {
    closeSingleEditDialog,
    closeSingleEditSlide,
    discardSingleEditSlide,
    dialogModel,
    dialogTitleI18nKey,
    documentName,
    isAddOnlineUrlsPanel,
    isMassEditPanel,
    isOnlineUrlsSubmitDisabled,
    isPersistent,
    isSingleEditSaveDisabled,
    isSingleEditSlideOpen,
    isSlideNextDisabled,
    isSlidePreviousDisabled,
    listMediaItems,
    massEditRows,
    onlineUrlsDraft,
    openSingleEditSlide,
    openSingleEditSlideNext,
    openSingleEditSlidePrevious,
    saveAndBackToList,
    saveAndClose,
    saveSingleEditAndCloseDialog,
    saveSingleEditSlide,
    saveSingleEditSlideStay,
    searchQuery,
    selectedPanel,
    showAddOnlineUrlsPanel,
    showGenericClose,
    singleEditDraft,
    submitOnlineUrls
  }
}
