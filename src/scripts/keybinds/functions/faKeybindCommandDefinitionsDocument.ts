import type { I_faKeybindCommandDefinition } from 'app/types/I_faKeybindsDomain'

/**
 * Document workspace keybind command definitions (edit/save/tab focus/move).
 */
export const FA_KEYBIND_COMMAND_DEFINITIONS_DOCUMENT: I_faKeybindCommandDefinition[] = [
  {
    defaultChord: {
      code: 'KeyE',
      mods: ['primary']
    },
    editable: true,
    firesInEditableFields: true,
    id: 'editDocument',
    messageKey: 'dialogs.keybindSettings.commands.editDocument'
  },
  {
    defaultChord: {
      code: 'KeyS',
      mods: ['primary']
    },
    editable: true,
    firesInEditableFields: true,
    id: 'saveDocumentKeepEditMode',
    messageKey: 'dialogs.keybindSettings.commands.saveDocumentKeepEditMode'
  },
  {
    defaultChord: {
      code: 'KeyS',
      mods: [
        'alt',
        'ctrl'
      ]
    },
    editable: true,
    firesInEditableFields: true,
    id: 'saveDocument',
    messageKey: 'dialogs.keybindSettings.commands.saveDocument'
  },
  {
    defaultChord: {
      code: 'ArrowLeft',
      mods: ['alt']
    },
    editable: true,
    firesInEditableFields: true,
    id: 'focusPreviousDocumentTab',
    messageKey: 'dialogs.keybindSettings.commands.focusPreviousDocumentTab'
  },
  {
    defaultChord: {
      code: 'ArrowRight',
      mods: ['alt']
    },
    editable: true,
    firesInEditableFields: true,
    id: 'focusNextDocumentTab',
    messageKey: 'dialogs.keybindSettings.commands.focusNextDocumentTab'
  },
  {
    defaultChord: {
      code: 'ArrowLeft',
      mods: [
        'alt',
        'shift'
      ]
    },
    editable: true,
    firesInEditableFields: true,
    id: 'moveDocumentTabLeft',
    messageKey: 'dialogs.keybindSettings.commands.moveDocumentTabLeft'
  },
  {
    defaultChord: {
      code: 'ArrowRight',
      mods: [
        'alt',
        'shift'
      ]
    },
    editable: true,
    firesInEditableFields: true,
    id: 'moveDocumentTabRight',
    messageKey: 'dialogs.keybindSettings.commands.moveDocumentTabRight'
  }
]
