import type { T_dialogName } from 'app/types/T_appDialogsAndDocuments'

/**
 * True when a direct prop feed should open the Quick-Add Document dialog.
 */
export function isDialogQuickAddDocumentDirectInput (
  directInput: T_dialogName | undefined
): directInput is 'QuickAddDocument' {
  return directInput === 'QuickAddDocument'
}

/**
 * True when centralized dialog routing targets the Quick-Add Document dialog.
 */
export function isDialogQuickAddDocumentStoreTarget (
  dialogToOpen: unknown
): dialogToOpen is 'QuickAddDocument' {
  return dialogToOpen === 'QuickAddDocument'
}
