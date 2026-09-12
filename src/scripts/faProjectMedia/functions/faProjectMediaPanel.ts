import type { T_faProjectMediaPanel } from 'app/types/I_faProjectMediaDomain'

/** Horizontal panel id for the Project Media list. */
export const FA_DIALOG_PROJECT_MEDIA_LIST_PANEL = 'mediaList'

/** Horizontal panel id for adding media. */
export const FA_DIALOG_PROJECT_MEDIA_ADD_PANEL = 'mediaAdd'

/** Horizontal panel id for pasting online media URLs. */
export const FA_DIALOG_PROJECT_MEDIA_ADD_ONLINE_URLS_PANEL = 'mediaAddOnlineUrls'

/** Horizontal panel id for editing one medium. */
export const FA_DIALOG_PROJECT_MEDIA_SINGLE_EDIT_PANEL = 'mediaSingleEdit'

/** Horizontal panel id for mass-editing media. */
export const FA_DIALOG_PROJECT_MEDIA_MASS_EDIT_PANEL = 'mediaMassEdit'

function isKnownFaProjectMediaPanel (value: unknown): value is T_faProjectMediaPanel {
  if (value === FA_DIALOG_PROJECT_MEDIA_LIST_PANEL) {
    return true
  }
  if (value === FA_DIALOG_PROJECT_MEDIA_ADD_PANEL) {
    return true
  }
  if (value === FA_DIALOG_PROJECT_MEDIA_ADD_ONLINE_URLS_PANEL) {
    return true
  }
  if (value === FA_DIALOG_PROJECT_MEDIA_SINGLE_EDIT_PANEL) {
    return true
  }
  if (value === FA_DIALOG_PROJECT_MEDIA_MASS_EDIT_PANEL) {
    return true
  }
  return false
}

/**
 * Maps an unknown open payload to a Project Media panel id. Garbage becomes list.
 */
export function normalizeFaProjectMediaPanel (value: unknown): T_faProjectMediaPanel {
  if (isKnownFaProjectMediaPanel(value)) {
    return value
  }
  return FA_DIALOG_PROJECT_MEDIA_LIST_PANEL
}

/**
 * Resolves the panel for openProjectMediaDialog.
 * Explicit known ids win. Missing or unknown ids: add when the library is empty,
 * otherwise list. Mass edit and the URL-paste slide are not open defaults.
 */
export function resolveFaProjectMediaOpenPanel (input: {
  hasAnyMedia: boolean
  initialPanelRaw: unknown
}): T_faProjectMediaPanel {
  if (isKnownFaProjectMediaPanel(input.initialPanelRaw)) {
    return input.initialPanelRaw
  }
  if (input.hasAnyMedia) {
    return FA_DIALOG_PROJECT_MEDIA_LIST_PANEL
  }
  return FA_DIALOG_PROJECT_MEDIA_ADD_PANEL
}

/**
 * Project Media q-dialog persistent flag for the active slide only.
 * Mass edit is always sticky. Add drop zone is never sticky. URL paste is sticky
 * when the textarea has non-whitespace. List stays sticky. Single edit is sticky
 * only while the loaded row is dirty.
 */
export function resolveFaProjectMediaDialogPersistent (input: {
  onlineUrlsDraft: string
  selectedPanel: T_faProjectMediaPanel
  singleEditDirty: boolean
}): boolean {
  if (input.selectedPanel === FA_DIALOG_PROJECT_MEDIA_MASS_EDIT_PANEL) {
    return true
  }
  if (input.selectedPanel === FA_DIALOG_PROJECT_MEDIA_ADD_ONLINE_URLS_PANEL) {
    return input.onlineUrlsDraft.trim().length > 0
  }
  if (input.selectedPanel === FA_DIALOG_PROJECT_MEDIA_ADD_PANEL) {
    return false
  }
  if (input.selectedPanel === FA_DIALOG_PROJECT_MEDIA_SINGLE_EDIT_PANEL) {
    return input.singleEditDirty
  }
  return true
}

/**
 * vue-i18n key for the Project Media dialog heading on the active slide.
 */
export function resolveFaProjectMediaDialogTitleI18nKey (
  selectedPanel: T_faProjectMediaPanel
): string {
  if (selectedPanel === FA_DIALOG_PROJECT_MEDIA_ADD_PANEL) {
    return 'dialogs.projectMedia.titleAdd'
  }
  if (selectedPanel === FA_DIALOG_PROJECT_MEDIA_ADD_ONLINE_URLS_PANEL) {
    return 'dialogs.projectMedia.titleAddOnline'
  }
  if (selectedPanel === FA_DIALOG_PROJECT_MEDIA_MASS_EDIT_PANEL) {
    return 'dialogs.projectMedia.titleMassEdit'
  }
  if (selectedPanel === FA_DIALOG_PROJECT_MEDIA_LIST_PANEL) {
    return 'dialogs.projectMedia.titleList'
  }
  if (selectedPanel === FA_DIALOG_PROJECT_MEDIA_SINGLE_EDIT_PANEL) {
    return 'dialogs.projectMedia.titleSingle'
  }
  return 'dialogs.projectMedia.title'
}
