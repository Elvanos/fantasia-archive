import { expect, test, vi } from 'vitest'

import type { I_createUseDialogQuickSearchDocumentDeps } from 'app/types/I_createUseDialogQuickSearchDocument'

import {
  wireDialogQuickSearchDocumentOptionAuxClickHandler,
  wireDialogQuickSearchDocumentTrailingActionHandlers
} from '../dialogQuickSearchDocumentTrailingActionWiring'

function makeDeps (
  overrides?: Partial<I_createUseDialogQuickSearchDocumentDeps>
): Pick<I_createUseDialogQuickSearchDocumentDeps, 'runFaAction'> {
  return {
    runFaAction: vi.fn(),
    ...overrides
  }
}

/**
 * wireDialogQuickSearchDocumentTrailingActionHandlers
 * Undefined event closes and runs the plain action payload.
 */
test('Test that trailing actions without event close then run action', () => {
  const runFaAction = vi.fn()
  const closeDialog = vi.fn()
  const handlers = wireDialogQuickSearchDocumentTrailingActionHandlers(
    makeDeps({ runFaAction }) as I_createUseDialogQuickSearchDocumentDeps,
    closeDialog
  )

  handlers.onDocumentEditClick('doc-a')
  expect(closeDialog).toHaveBeenCalledTimes(1)
  expect(runFaAction).toHaveBeenCalledWith('editHierarchyTreeDocument', { documentId: 'doc-a' })
})

/**
 * wireDialogQuickSearchDocumentOptionAuxClickHandler
 * Guards empty / array / null option ids and non-mouse events.
 */
test('Test that option auxclick ignores empty ids and non-mouse events', () => {
  const runFaAction = vi.fn()
  const onDocumentOptionAuxClick = wireDialogQuickSearchDocumentOptionAuxClickHandler(
    makeDeps({ runFaAction }) as I_createUseDialogQuickSearchDocumentDeps
  )
  const middleAux = new MouseEvent('auxclick', {
    button: 1
  })

  onDocumentOptionAuxClick(null, middleAux)
  onDocumentOptionAuxClick('', middleAux)
  onDocumentOptionAuxClick([], middleAux)
  onDocumentOptionAuxClick({
    id: '',
    name: 'Empty'
  }, middleAux)
  onDocumentOptionAuxClick({
    id: 'doc-a',
    name: 'Aria'
  }, new Event('click'))

  expect(runFaAction).not.toHaveBeenCalled()
})
