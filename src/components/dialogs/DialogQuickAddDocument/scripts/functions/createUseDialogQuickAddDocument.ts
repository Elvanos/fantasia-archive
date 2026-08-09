import type { I_createUseDialogQuickAddDocumentDeps } from 'app/types/I_createUseDialogQuickAddDocument'
import type { T_dialogName } from 'app/types/T_appDialogsAndDocuments'

/**
 * Factory for the Quick-Add Document dialog composable.
 * Session body is injected so this level-1 module stays type-import only.
 */
export function createUseDialogQuickAddDocument (
  deps: I_createUseDialogQuickAddDocumentDeps
): (props: { directInput?: T_dialogName | undefined }) => ReturnType<
  I_createUseDialogQuickAddDocumentDeps['runDialogQuickAddDocumentSession']
> {
  return (props) => deps.runDialogQuickAddDocumentSession(deps, props)
}
