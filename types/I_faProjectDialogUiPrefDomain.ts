/**
 * Allowlisted project_data keys for dialog / popup UI preferences (per .faproject).
 */

export const FA_PROJECT_DIALOG_UI_PREF_KEYS = [
  'last_selected_world_id'
] as const

export type T_faProjectDialogUiPrefKey = typeof FA_PROJECT_DIALOG_UI_PREF_KEYS[number]

export const FA_PROJECT_DIALOG_UI_PREF_LAST_SELECTED_WORLD_ID =
  'last_selected_world_id' satisfies T_faProjectDialogUiPrefKey

/**
 * Get payload for one allowlisted dialog UI preference.
 */
export interface I_faProjectDialogUiPrefGetInput {
  key: T_faProjectDialogUiPrefKey
}

/**
 * Set payload for one allowlisted dialog UI preference.
 * Empty string clears the stored value (row upserted to empty text).
 */
export interface I_faProjectDialogUiPrefSetInput {
  key: T_faProjectDialogUiPrefKey
  value: string
}

/**
 * Get result: trimmed string when present and non-empty; null when missing or blank.
 */
export interface I_faProjectDialogUiPrefGetResult {
  key: T_faProjectDialogUiPrefKey
  value: string | null
}
