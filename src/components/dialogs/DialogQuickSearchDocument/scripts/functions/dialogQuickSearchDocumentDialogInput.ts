import type { T_dialogName } from 'app/types/T_appDialogsAndDocuments'

/**
 * True when a direct prop feed should open the Quick-Search Document dialog.
 */
export function isDialogQuickSearchDocumentDirectInput (
  directInput: T_dialogName | undefined
): directInput is 'QuickSearchDocument' {
  return directInput === 'QuickSearchDocument'
}

/**
 * True when centralized dialog routing targets the Quick-Search Document dialog.
 */
export function isDialogQuickSearchDocumentStoreTarget (
  dialogToOpen: unknown
): dialogToOpen is 'QuickSearchDocument' {
  return dialogToOpen === 'QuickSearchDocument'
}
