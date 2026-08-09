import type { I_faActionPayloadMap, T_faActionId } from 'app/types/I_faActionManagerDomain'
import type { I_computedRef } from 'app/types/I_vueCompositionShims'
import type { T_faProjectOverviewEmptyCtaMode } from 'app/types/I_faProjectOverview'

/**
 * Empty-state CTA handlers for Project overview
 * (create template / assign template / create document).
 */
export function createProjectOverviewEmptyCtaHandlers (input: {
  FA_DIALOG_PROJECT_SETTINGS_DOCUMENT_TEMPLATES_TAB: string
  FA_DIALOG_PROJECT_SETTINGS_WORLDS_TAB: string
  emptyCtaMode: I_computedRef<T_faProjectOverviewEmptyCtaMode>
  runFaAction: <TId extends T_faActionId>(
    id: TId,
    payload: I_faActionPayloadMap[TId]
  ) => void
}): {
    onEmptyCtaClick: () => void
  } {
  function onEmptyCtaClick (): void {
    const mode = input.emptyCtaMode.value
    if (mode === 'createDocument') {
      input.runFaAction('openQuickAddDocumentDialog', undefined)
      return
    }
    if (mode === 'assignTemplate') {
      input.runFaAction('openProjectSettingsDialog', {
        initialTab: input.FA_DIALOG_PROJECT_SETTINGS_WORLDS_TAB
      })
      return
    }
    input.runFaAction('openProjectSettingsDialog', {
      initialTab: input.FA_DIALOG_PROJECT_SETTINGS_DOCUMENT_TEMPLATES_TAB
    })
  }

  return { onEmptyCtaClick }
}

/**
 * Last-opened row click + context-menu actions (hierarchy tree action ids).
 */
export function createProjectOverviewLastOpenedActionHandlers (input: {
  runFaAction: <TId extends T_faActionId>(
    id: TId,
    payload: I_faActionPayloadMap[TId]
  ) => void
}): {
    onLastOpenedContextAddUnder: (documentId: string) => void
    onLastOpenedContextCopyBackgroundColor: (documentId: string) => void
    onLastOpenedContextCopyDocument: (documentId: string) => void
    onLastOpenedContextCopyName: (documentId: string) => void
    onLastOpenedContextCopyTextColor: (documentId: string) => void
    onLastOpenedContextDelete: (documentId: string) => void
    onLastOpenedContextEdit: (documentId: string) => void
    onLastOpenedContextOpen: (documentId: string) => void
    onLastOpenedRowAuxClick: (documentId: string, event: MouseEvent) => void
    onLastOpenedRowClick: (documentId: string) => void
  } {
  function onLastOpenedRowClick (documentId: string): void {
    input.runFaAction('openHierarchyTreeDocument', { documentId })
  }

  function onLastOpenedRowAuxClick (documentId: string, event: MouseEvent): void {
    if (event.button !== 1) {
      return
    }
    event.preventDefault()
    input.runFaAction('openHierarchyTreeDocument', {
      documentId,
      openMode: 'middleBackground'
    })
  }

  function onLastOpenedContextCopyName (documentId: string): void {
    input.runFaAction('copyHierarchyTreeDocumentName', { documentId })
  }

  function onLastOpenedContextCopyTextColor (documentId: string): void {
    input.runFaAction('copyHierarchyTreeDocumentTextColor', { documentId })
  }

  function onLastOpenedContextCopyBackgroundColor (documentId: string): void {
    input.runFaAction('copyHierarchyTreeDocumentBackgroundColor', { documentId })
  }

  function onLastOpenedContextOpen (documentId: string): void {
    input.runFaAction('openHierarchyTreeDocument', { documentId })
  }

  function onLastOpenedContextEdit (documentId: string): void {
    input.runFaAction('editHierarchyTreeDocument', { documentId })
  }

  function onLastOpenedContextCopyDocument (documentId: string): void {
    input.runFaAction('copyHierarchyTreeDocument', { documentId })
  }

  function onLastOpenedContextAddUnder (documentId: string): void {
    input.runFaAction('addHierarchyTreeChildDocument', { documentId })
  }

  function onLastOpenedContextDelete (documentId: string): void {
    input.runFaAction('deleteHierarchyTreeDocument', { documentId })
  }

  return {
    onLastOpenedContextAddUnder,
    onLastOpenedContextCopyBackgroundColor,
    onLastOpenedContextCopyDocument,
    onLastOpenedContextCopyName,
    onLastOpenedContextCopyTextColor,
    onLastOpenedContextDelete,
    onLastOpenedContextEdit,
    onLastOpenedContextOpen,
    onLastOpenedRowAuxClick,
    onLastOpenedRowClick
  }
}
