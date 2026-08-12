import { expect, test, vi } from 'vitest'

import { buildProjectAppControlBarFixedStripLeftHandlers } from '../projectAppControlBarFixedStripLeftHandlers'

test('Test that fixed strip left handlers dispatch existing faActionManager actions', () => {
  const runFaAction = vi.fn()
  const handlers = buildProjectAppControlBarFixedStripLeftHandlers({ runFaAction })

  handlers.onKeyboardShortcutsClick()
  handlers.onAdvancedSearchGuideClick()
  handlers.onTipsTricksTriviaClick()
  handlers.onToggleHierarchyTreeClick()
  handlers.onToggleAppNoteboardClick()
  handlers.onToggleProjectNoteboardClick()
  handlers.onQuickAddClick()
  handlers.onQuickSearchClick()

  expect(runFaAction).toHaveBeenCalledWith('openKeybindSettingsDialog', undefined)
  expect(runFaAction).toHaveBeenCalledWith('openAdvancedSearchGuideDialog', undefined)
  expect(runFaAction).toHaveBeenCalledWith('openTipsTricksTriviaDialog', undefined)
  expect(runFaAction).toHaveBeenCalledWith('toggleHierarchicalTree', undefined)
  expect(runFaAction).toHaveBeenCalledWith('toggleAppNoteboardWindow', undefined)
  expect(runFaAction).toHaveBeenCalledWith('toggleProjectNoteboardWindow', undefined)
  expect(runFaAction).toHaveBeenCalledWith('openQuickAddDocumentDialog', undefined)
  expect(runFaAction).toHaveBeenCalledWith('openQuickSearchDocumentDialog', undefined)
})
