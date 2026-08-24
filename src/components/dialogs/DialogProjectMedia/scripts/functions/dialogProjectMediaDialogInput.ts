import type { T_dialogName } from 'app/types/T_appDialogsAndDocuments'

/**
 * True when a direct prop feed should open the Project Media dialog.
 */
export function isDialogProjectMediaDirectInput (
  directInput: T_dialogName | undefined
): directInput is 'ProjectMedia' {
  return directInput === 'ProjectMedia'
}

/**
 * True when centralized dialog routing targets Project Media.
 */
export function isDialogProjectMediaStoreTarget (
  dialogToOpen: unknown
): dialogToOpen is 'ProjectMedia' {
  return dialogToOpen === 'ProjectMedia'
}
