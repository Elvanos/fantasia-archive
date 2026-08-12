import type { I_faKeybindCommandDefinition } from 'app/types/I_faKeybindsDomain'

/**
 * App chrome / dialog keybind command definitions (excludes document tab chords).
 */
export const FA_KEYBIND_COMMAND_DEFINITIONS_APP: I_faKeybindCommandDefinition[] = [
  {
    defaultChord: {
      code: 'F12',
      mods: ['primary']
    },
    editable: true,
    firesInEditableFields: true,
    id: 'toggleDeveloperTools',
    messageKey: 'dialogs.keybindSettings.commands.toggleDeveloperTools'
  },
  {
    defaultChord: {
      code: 'KeyL',
      mods: [
        'alt',
        'primary',
        'shift'
      ]
    },
    editable: true,
    firesInEditableFields: true,
    id: 'openAppSettings',
    messageKey: 'dialogs.keybindSettings.commands.openAppSettings'
  },
  {
    defaultChord: {
      code: 'KeyK',
      mods: [
        'alt',
        'primary',
        'shift'
      ]
    },
    editable: true,
    firesInEditableFields: true,
    id: 'openKeybindSettings',
    messageKey: 'dialogs.keybindSettings.commands.openKeybindSettings'
  },
  {
    defaultChord: {
      code: 'KeyJ',
      mods: [
        'alt',
        'primary',
        'shift'
      ]
    },
    editable: true,
    firesInEditableFields: true,
    id: 'openAppStyling',
    messageKey: 'dialogs.keybindSettings.commands.openAppStyling'
  },
  {
    defaultChord: {
      code: 'KeyJ',
      mods: [
        'ctrl',
        'shift'
      ]
    },
    editable: true,
    firesInEditableFields: true,
    id: 'openProjectStyling',
    messageKey: 'dialogs.keybindSettings.commands.openProjectStyling'
  },
  {
    defaultChord: {
      code: 'KeyP',
      mods: [
        'alt',
        'ctrl',
        'shift'
      ]
    },
    editable: true,
    firesInEditableFields: true,
    id: 'openProjectSettings',
    messageKey: 'dialogs.keybindSettings.commands.openProjectSettings'
  },
  {
    defaultChord: {
      code: 'KeyN',
      mods: ['primary']
    },
    editable: true,
    firesInEditableFields: true,
    id: 'quickNewDocument',
    messageKey: 'dialogs.keybindSettings.commands.quickNewDocument'
  },
  {
    defaultChord: {
      code: 'KeyQ',
      mods: ['ctrl']
    },
    editable: true,
    firesInEditableFields: true,
    id: 'quickExistingDocument',
    messageKey: 'dialogs.keybindSettings.commands.quickExistingDocument'
  },
  {
    defaultChord: {
      code: 'KeyO',
      mods: [
        'alt',
        'ctrl',
        'shift'
      ]
    },
    editable: true,
    firesInEditableFields: true,
    id: 'showProjectDashboard',
    messageKey: 'dialogs.keybindSettings.commands.showProjectDashboard'
  },
  {
    defaultChord: {
      code: 'KeyE',
      mods: [
        'alt',
        'ctrl'
      ]
    },
    editable: true,
    firesInEditableFields: true,
    id: 'toggleAppNoteboard',
    messageKey: 'dialogs.keybindSettings.commands.toggleAppNoteboard'
  },
  {
    defaultChord: {
      code: 'KeyD',
      mods: [
        'alt',
        'ctrl'
      ]
    },
    editable: true,
    firesInEditableFields: true,
    id: 'toggleProjectNoteboard',
    messageKey: 'dialogs.keybindSettings.commands.toggleProjectNoteboard'
  },
  {
    defaultChord: {
      code: 'KeyT',
      mods: [
        'alt',
        'ctrl',
        'shift'
      ]
    },
    editable: true,
    firesInEditableFields: true,
    id: 'toggleHierarchicalTree',
    messageKey: 'dialogs.keybindSettings.commands.toggleHierarchicalTree'
  },
  {
    defaultChord: {
      code: 'F11',
      mods: ['primary']
    },
    editable: true,
    firesInEditableFields: true,
    id: 'openActionMonitor',
    messageKey: 'dialogs.keybindSettings.commands.openActionMonitor'
  },
  {
    defaultChord: {
      code: 'KeyG',
      mods: [
        'alt',
        'ctrl',
        'shift'
      ]
    },
    editable: true,
    firesInEditableFields: true,
    id: 'openAdvancedSearchGuide',
    messageKey: 'dialogs.keybindSettings.commands.openAdvancedSearchGuide'
  }
]
