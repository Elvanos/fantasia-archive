import type { I_createUseDialogQuickSearchDocumentDeps } from 'app/types/I_createUseDialogQuickSearchDocument'

/**
 * Option context menu (same rows as Last opened): always close Quick Search then run the hierarchy action.
 */
export function wireDialogQuickSearchDocumentContextMenuHandlers (
  deps: I_createUseDialogQuickSearchDocumentDeps,
  closeDialog: () => void
): {
    onDocumentContextAddUnder: (documentId: string) => void
    onDocumentContextCopyBackgroundColor: (documentId: string) => void
    onDocumentContextCopyDocument: (documentId: string) => void
    onDocumentContextCopyName: (documentId: string) => void
    onDocumentContextCopyTextColor: (documentId: string) => void
    onDocumentContextDelete: (documentId: string) => void
    onDocumentContextEdit: (documentId: string) => void
    onDocumentContextOpen: (documentId: string) => void
  } {
  const runContextAction = (
    actionId:
      | 'openHierarchyTreeDocument'
      | 'editHierarchyTreeDocument'
      | 'copyHierarchyTreeDocument'
      | 'addHierarchyTreeChildDocument'
      | 'copyHierarchyTreeDocumentName'
      | 'copyHierarchyTreeDocumentTextColor'
      | 'copyHierarchyTreeDocumentBackgroundColor'
      | 'deleteHierarchyTreeDocument',
    documentId: string
  ): void => {
    closeDialog()
    deps.runFaAction(actionId, { documentId })
  }

  const onDocumentContextCopyName = (documentId: string): void => {
    runContextAction('copyHierarchyTreeDocumentName', documentId)
  }

  const onDocumentContextCopyTextColor = (documentId: string): void => {
    runContextAction('copyHierarchyTreeDocumentTextColor', documentId)
  }

  const onDocumentContextCopyBackgroundColor = (documentId: string): void => {
    runContextAction('copyHierarchyTreeDocumentBackgroundColor', documentId)
  }

  const onDocumentContextOpen = (documentId: string): void => {
    runContextAction('openHierarchyTreeDocument', documentId)
  }

  const onDocumentContextEdit = (documentId: string): void => {
    runContextAction('editHierarchyTreeDocument', documentId)
  }

  const onDocumentContextCopyDocument = (documentId: string): void => {
    runContextAction('copyHierarchyTreeDocument', documentId)
  }

  const onDocumentContextAddUnder = (documentId: string): void => {
    runContextAction('addHierarchyTreeChildDocument', documentId)
  }

  const onDocumentContextDelete = (documentId: string): void => {
    runContextAction('deleteHierarchyTreeDocument', documentId)
  }

  return {
    onDocumentContextAddUnder,
    onDocumentContextCopyBackgroundColor,
    onDocumentContextCopyDocument,
    onDocumentContextCopyName,
    onDocumentContextCopyTextColor,
    onDocumentContextDelete,
    onDocumentContextEdit,
    onDocumentContextOpen
  }
}
