import type { I_createUseDialogQuickSearchDocumentDeps } from 'app/types/I_createUseDialogQuickSearchDocument'
import type { T_faSelectInputModelValue } from 'app/types/I_faSelectInput'

import { isMiddleMouseButton } from 'app/src/scripts/dom/dom_manager'

function eventHasMouseButton (
  event: Event
): event is Event & Pick<MouseEvent, 'button'> {
  return 'button' in event && typeof (event as MouseEvent).button === 'number'
}

/**
 * Edit / Copy / Add under: left-click closes; middle-click keeps dialog open without resetting the menu highlight.
 */
export function wireDialogQuickSearchDocumentTrailingActionHandlers (
  deps: I_createUseDialogQuickSearchDocumentDeps,
  closeDialog: () => void
): {
    onDocumentAddUnderClick: (documentId: string, event?: Event) => void
    onDocumentCopyClick: (documentId: string, event?: Event) => void
    onDocumentEditClick: (documentId: string, event?: Event) => void
  } {
  const shouldIgnoreTrailingAuxClick = (event: Event | undefined): boolean => {
    return event !== undefined &&
      event.type === 'auxclick' &&
      !(eventHasMouseButton(event) && isMiddleMouseButton(event))
  }

  const shouldCloseAfterTrailingAction = (event: Event | undefined): boolean => {
    return !(
      event !== undefined &&
      eventHasMouseButton(event) &&
      isMiddleMouseButton(event)
    )
  }

  const runTrailingAction = (
    documentId: string,
    event: Event | undefined,
    actionId: 'editHierarchyTreeDocument' | 'copyHierarchyTreeDocument' | 'addHierarchyTreeChildDocument'
  ): void => {
    if (shouldIgnoreTrailingAuxClick(event)) {
      return
    }
    const keepDialogOpen = !shouldCloseAfterTrailingAction(event)
    if (!keepDialogOpen) {
      closeDialog()
    }
    if (keepDialogOpen) {
      deps.runFaAction(actionId, {
        documentId,
        openMode: 'middleBackground'
      })
      return
    }
    deps.runFaAction(actionId, { documentId })
  }

  const onDocumentEditClick = (documentId: string, event?: Event): void => {
    runTrailingAction(documentId, event, 'editHierarchyTreeDocument')
  }

  const onDocumentCopyClick = (documentId: string, event?: Event): void => {
    runTrailingAction(documentId, event, 'copyHierarchyTreeDocument')
  }

  const onDocumentAddUnderClick = (documentId: string, event?: Event): void => {
    runTrailingAction(documentId, event, 'addHierarchyTreeChildDocument')
  }

  return {
    onDocumentAddUnderClick,
    onDocumentCopyClick,
    onDocumentEditClick
  }
}

function resolveDialogQuickSearchDocumentOptionId (
  value: T_faSelectInputModelValue | null | undefined
): string | null {
  if (value === null || value === undefined) {
    return null
  }
  if (typeof value === 'string') {
    return value.length > 0 ? value : null
  }
  if (Array.isArray(value)) {
    return null
  }
  return value.id.length > 0 ? value.id : null
}

/**
 * Option-row middle-click: open document in preview (read) as middleBackground; keep Quick Search open.
 */
export function wireDialogQuickSearchDocumentOptionAuxClickHandler (
  deps: I_createUseDialogQuickSearchDocumentDeps
): (
    value: T_faSelectInputModelValue | null | undefined,
    event: Event
  ) => void {
  const onDocumentOptionAuxClick = (
    value: T_faSelectInputModelValue | null | undefined,
    event: Event
  ): void => {
    if (!(eventHasMouseButton(event) && isMiddleMouseButton(event))) {
      return
    }
    event.preventDefault()
    const documentId = resolveDialogQuickSearchDocumentOptionId(value)
    if (documentId === null) {
      return
    }
    deps.runFaAction('openHierarchyTreeDocument', {
      documentId,
      openMode: 'middleBackground'
    })
  }

  return onDocumentOptionAuxClick
}
