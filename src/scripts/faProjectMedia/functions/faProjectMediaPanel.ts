import type { T_faProjectMediaPanel } from 'app/types/I_faProjectMediaDomain'

/** Horizontal panel id for the Project Media list. */
export const FA_DIALOG_PROJECT_MEDIA_LIST_PANEL = 'mediaList'

/** Horizontal panel id for adding media. */
export const FA_DIALOG_PROJECT_MEDIA_ADD_PANEL = 'mediaAdd'

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
 * Explicit known ids win. Otherwise empty library defaults to add; nonempty to list.
 */
export function resolveFaProjectMediaOpenPanel (input: {
  hasAnyMedia: boolean
  initialPanelRaw: unknown
}): T_faProjectMediaPanel {
  if (isKnownFaProjectMediaPanel(input.initialPanelRaw)) {
    return input.initialPanelRaw
  }
  if (!input.hasAnyMedia) {
    return FA_DIALOG_PROJECT_MEDIA_ADD_PANEL
  }
  return FA_DIALOG_PROJECT_MEDIA_LIST_PANEL
}
