import type { I_faActionPayloadMap, T_faActionId } from 'app/types/I_faActionManagerDomain'

export function buildProjectAppControlBarFixedStripLeftHandlers (input: {
  runFaAction: <Id extends T_faActionId>(id: Id, payload: I_faActionPayloadMap[Id]) => void
}): {
    onAdvancedSearchGuideClick: () => void
    onKeyboardShortcutsClick: () => void
    onQuickAddClick: () => void
    onOpenProjectMediaClick: () => void
    onQuickSearchClick: () => void
    onTipsTricksTriviaClick: () => void
    onToggleAppNoteboardClick: () => void
    onToggleHierarchyTreeClick: () => void
    onToggleProjectNoteboardClick: () => void
  } {
  function onKeyboardShortcutsClick (): void {
    input.runFaAction('openKeybindSettingsDialog', undefined)
  }

  function onAdvancedSearchGuideClick (): void {
    input.runFaAction('openAdvancedSearchGuideDialog', undefined)
  }

  function onTipsTricksTriviaClick (): void {
    input.runFaAction('openTipsTricksTriviaDialog', undefined)
  }

  function onToggleHierarchyTreeClick (): void {
    input.runFaAction('toggleHierarchicalTree', undefined)
  }

  function onToggleAppNoteboardClick (): void {
    input.runFaAction('toggleAppNoteboardWindow', undefined)
  }

  function onToggleProjectNoteboardClick (): void {
    input.runFaAction('toggleProjectNoteboardWindow', undefined)
  }

  function onOpenProjectMediaClick (): void {
    input.runFaAction('openProjectMediaDialog', undefined)
  }

  function onQuickSearchClick (): void {
    input.runFaAction('openQuickSearchDocumentDialog', undefined)
  }

  function onQuickAddClick (): void {
    input.runFaAction('openQuickAddDocumentDialog', undefined)
  }

  return {
    onAdvancedSearchGuideClick,
    onKeyboardShortcutsClick,
    onOpenProjectMediaClick,
    onQuickAddClick,
    onQuickSearchClick,
    onTipsTricksTriviaClick,
    onToggleAppNoteboardClick,
    onToggleHierarchyTreeClick,
    onToggleProjectNoteboardClick
  }
}
