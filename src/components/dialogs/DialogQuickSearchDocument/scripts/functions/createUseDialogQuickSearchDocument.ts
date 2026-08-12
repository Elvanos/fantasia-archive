import type { I_createUseDialogQuickSearchDocumentDeps } from 'app/types/I_createUseDialogQuickSearchDocument'
import type { T_dialogName } from 'app/types/T_appDialogsAndDocuments'

/**
 * Factory for the Quick-Search Document dialog composable.
 * Session body is injected so this level-1 module stays type-import only.
 */
export function createUseDialogQuickSearchDocument (
  deps: I_createUseDialogQuickSearchDocumentDeps
): (props: { directInput?: T_dialogName | undefined }) => ReturnType<
  I_createUseDialogQuickSearchDocumentDeps['runDialogQuickSearchDocumentSession']
> {
  return (props) => deps.runDialogQuickSearchDocumentSession(deps, props)
}
