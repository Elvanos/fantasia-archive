export interface OptionsStateInteface {
  _id: string,
  _rev?: string,
  darkMode: boolean
  disableSpellCheck: boolean
  agressiveRelationshipFilter: boolean
  preventFilledNoteBoardPopup: boolean
  preventAutoScroll: boolean
  hideAdvSearchCheatsheetButton: boolean
  textShadow: boolean
  hideDeadCrossThrough: boolean
  doubleDashDocCount: boolean
  hideWelcomeScreenSocials: boolean
  hideHierarchyTree: boolean
  noTags: boolean
  tagsAtTop: boolean
  compactTags: boolean
  noProjectName: boolean
  invertTreeSorting: boolean
  disableDocumentToolTips: boolean
  doNotcollaseTreeOptions: boolean
  hideEmptyFields: boolean
  hideDocumentTitles: boolean
  disableDocumentControlBar: boolean
  disableDocumentControlBarGuides: boolean
  disableCloseAftertSelectQuickSearch: boolean
  disableQuickSearchCategoryPrecheck: boolean
  allowQuickPopupSameKeyClose: boolean
  disableDocumentCounts: boolean
  compactDocumentCount: boolean
  invertCategoryPosition: boolean
  hideTooltipsStart: boolean
  hideTooltipsProject: boolean
  hideTreeOrderNumbers: boolean
  hideTreeExtraIcons: boolean
  hideTreeIconAddUnder: boolean
  hideTreeIconEdit: boolean
  hideTreeIconView: boolean
  hidePlushes: boolean
  showDocumentID: boolean

  preventPreviewsTree: boolean
  preventPreviewsTabs: boolean
  preventPreviewsPopups: boolean
  preventPreviewsDocuments: boolean

  userKeybindList: any[]
  treeWidth?: number
  pre017check?: boolean,
  legacyFieldsCheck018?: boolean
}

function state (): OptionsStateInteface {
  return {
    _id: "settings",
    darkMode: false,
    disableSpellCheck: false,
    agressiveRelationshipFilter: false,
    preventFilledNoteBoardPopup: false,
    preventAutoScroll: false,
    hideAdvSearchCheatsheetButton: false,
    textShadow: false,
    hideDeadCrossThrough: false,
    doubleDashDocCount: false,
    hideWelcomeScreenSocials: false,
    hideDocumentTitles: false,
    hidePlushes: false,
    hideHierarchyTree: false,
    noTags: false,
    tagsAtTop: false,
    compactTags: false,
    noProjectName: false,
    invertTreeSorting: false,
    disableDocumentToolTips: false,
    doNotcollaseTreeOptions: false,
    disableDocumentControlBar: false,
    disableDocumentControlBarGuides: false,
    disableCloseAftertSelectQuickSearch: false,
    disableQuickSearchCategoryPrecheck: false,
    allowQuickPopupSameKeyClose: false,
    hideEmptyFields: false,
    disableDocumentCounts: false,
    compactDocumentCount: false,
    invertCategoryPosition: false,
    hideTooltipsStart: false,
    hideTooltipsProject: false,
    hideTreeOrderNumbers: false,
    hideTreeExtraIcons: false,
    hideTreeIconAddUnder: false,
    hideTreeIconEdit: false,
    hideTreeIconView: false,
    showDocumentID: false,
    preventPreviewsTree: true,
    preventPreviewsTabs: true,
    preventPreviewsPopups: false,
    preventPreviewsDocuments: false,
    treeWidth: 374,
    userKeybindList: [],
    pre017check: true,
    legacyFieldsCheck018: true
  }
}

export default state
