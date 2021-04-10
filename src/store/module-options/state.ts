export interface OptionsStateInteface {
  _id: string,
  _rev?: string,
  darkMode: boolean
  textShadow: boolean
  hideDeadCrossThrough: boolean
  doubleDashDocCount: boolean
  hideWelcomeScreenSocials: boolean
  noTags: boolean
  tagsAtTop: boolean
  compactTags: boolean
  noProjectName: boolean
  invertTreeSorting: boolean
  disableDocumentToolTips: boolean
  doNotcollaseTreeOptions: boolean
  hideEmptyFields: boolean
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

  userKeybindList: any[]
  treeWidth?: number
}

function state (): OptionsStateInteface {
  return {
    _id: "settings",
    darkMode: false,
    textShadow: false,
    hideDeadCrossThrough: false,
    doubleDashDocCount: false,
    hideWelcomeScreenSocials: false,
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
    treeWidth: 374,
    userKeybindList: []
  }
}

export default state
