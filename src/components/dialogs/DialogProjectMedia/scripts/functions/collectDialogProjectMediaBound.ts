import type {
  I_collectDialogProjectMediaBoundInput,
  I_dialogProjectMediaBound
} from 'app/types/I_createDialogProjectMedia'

/**
 * Flatten the single-edit session plus dialog chrome into the bound API.
 */
export function collectDialogProjectMediaBound (
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
