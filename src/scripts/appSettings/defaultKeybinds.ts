export const defaultKeybinds = [

  // Open keybind cheatsheet - CTRL + ALT + K
  {
    altKey: true,
    ctrlKey: true,
    shiftKey: false,
    which: 75,
    editable: true,
    id: "openKeybindsCheatsheet",
    tooltip: "Open keybind cheatsheet"
  },

  // Show project overview - NONE
  {
    altKey: false,
    ctrlKey: false,
    shiftKey: false,
    which: false,
    editable: true,
    id: "navigateToProjectOverview",
    tooltip: "Show project overview"
  },

  // Open app options - CTRL + ALT + J
  {
    altKey: true,
    ctrlKey: true,
    shiftKey: false,
    which: 74,
    editable: true,
    id: "openAppOptions",
    tooltip: "Open Fantasia Archive options"
  },

  // Toggle hierarchical tree - CTRL + ALT + SHIFT + T
  {
    altKey: true,
    ctrlKey: true,
    shiftKey: true,
    which: 84,
    editable: true,
    id: "toggleHierarchicalTree",
    tooltip: "Toggle hierarchical tree"
  },

  // Quick new document - CTRL + N
  {
    altKey: false,
    ctrlKey: true,
    shiftKey: false,
    which: 78,
    editable: true,
    id: "quickNewDocument",
    tooltip: "Quick-add new document"
  },

  // Quick existing document - CTRL + Q
  {
    altKey: false,
    ctrlKey: true,
    shiftKey: false,
    which: 81,
    editable: true,
    id: "quickExistingDocument",
    tooltip: "Quick-search existing document"
  },

  // Focus left tree search - CTRL + SHIFT + Q
  {
    altKey: false,
    ctrlKey: true,
    shiftKey: true,
    which: 81,
    editable: true,
    id: "focusHierarchicalTree",
    tooltip: "Focus search field in the left hierarchical tree"
  },

  // Clear input in the left tree search - CTRL + SHIFT + T
  {
    altKey: false,
    ctrlKey: true,
    shiftKey: true,
    which: 84,
    editable: true,
    id: "clearInputHierarchicalTree",
    tooltip: "Clear any input in the search field in the left hierarchical tree"
  },

  // Close tab - CTRL + W
  {
    altKey: false,
    ctrlKey: true,
    shiftKey: false,
    which: 87,
    editable: true,
    id: "closeTab",
    tooltip: "Close active document"
  },

  // Close all tabs without changes except for this - CTRL + ALT + SHIFT + W
  {
    altKey: true,
    ctrlKey: true,
    shiftKey: true,
    which: 87,
    editable: true,
    id: "closeAllTabsWithoutChangesButThis",
    tooltip: "Close all tabs without changes except for this"
  },

  // Close all tabs without changes - CTRL + SHIFT + W
  {
    altKey: false,
    ctrlKey: true,
    shiftKey: true,
    which: 87,
    editable: true,
    id: "closeAllTabsWithoutChanges",
    tooltip: "Close all tabs without changes"
  },

  // Force close all tabs except for this - NONE
  {
    altKey: false,
    ctrlKey: false,
    shiftKey: false,
    which: false,
    editable: true,
    id: "forceCloseAllTabsButThis",
    tooltip: "Force close all tabs except for this"
  },

  // Force close all tabs - NONE
  {
    altKey: false,
    ctrlKey: false,
    shiftKey: false,
    which: false,
    editable: true,
    id: "forceCloseAllTabs",
    tooltip: "Force close all tabs"
  },

  // Next tab - ALT + RIGHT ARROW
  {
    altKey: true,
    ctrlKey: false,
    shiftKey: false,
    which: 39,
    editable: true,
    id: "nextTab",
    tooltip: "Next tab"
  },

  // Previous tab - ALT + LEFT ARROW
  {
    altKey: true,
    ctrlKey: false,
    shiftKey: false,
    which: 37,
    editable: true,
    id: "previousTab",
    tooltip: "Previous tab"
  },

  // Save document - CTRL + ALT + S
  {
    altKey: true,
    ctrlKey: true,
    shiftKey: false,
    which: 83,
    editable: true,
    id: "saveDocument",
    tooltip: "Save active document"
  },

  // Save document without exiting edit mode - CTRL + S
  {
    altKey: false,
    ctrlKey: true,
    shiftKey: false,
    which: 83,
    editable: true,
    id: "saveDocumentNoExit",
    tooltip: "Save document without exiting edit mode"
  },

  // Edit document - CTRL + E
  {
    altKey: false,
    ctrlKey: true,
    shiftKey: false,
    which: 69,
    editable: true,
    id: "editDocument",
    tooltip: "Edit active document"
  },

  // Add a new document with current as parent - CTRL + SHIFT + N
  {
    altKey: false,
    ctrlKey: true,
    shiftKey: true,
    which: 78,
    editable: true,
    id: "addUnderParent",
    tooltip: "Add a new document with the currently opened one as the parent"
  },

  // Copy document - CTRL + ALT + C
  {
    altKey: true,
    ctrlKey: true,
    shiftKey: false,
    which: 67,
    editable: true,
    id: "copyDocument",
    tooltip: "Copy active document"
  },

  // Delete document - CTRL + D
  {
    altKey: false,
    ctrlKey: true,
    shiftKey: false,
    which: 68,
    editable: true,
    id: "deleteDocument",
    tooltip: "Delete active document"
  },

  // Toggle the Advanced search cheatsheet - NONE
  {
    altKey: false,
    ctrlKey: false,
    shiftKey: false,
    which: false,
    editable: true,
    id: "toggleAdvSearchCheatsheet",
    tooltip: "Toggle the Advanced search cheatsheet"
  },

  // Toggle Note Board - CTRL + ALT + SHIFT + P
  {
    altKey: true,
    ctrlKey: true,
    shiftKey: true,
    which: 80,
    editable: true,
    id: "toggleNoteCorkboard",
    tooltip: "Toggle Note board"
  },

  // Next focus - Tab
  {
    altKey: false,
    ctrlKey: false,
    shiftKey: false,
    which: 9,
    editable: false,
    id: "nextFocus",
    tooltip: "Focuses the next input field/input element/hierarchical tree node",
    note: "(functionality is the same as when using a web-browser)"
  },

  // Previous focus - Shift + Tab
  {
    altKey: false,
    ctrlKey: false,
    shiftKey: true,
    which: 9,
    editable: false,
    id: "previousFocus",
    tooltip: "Focuses the previous input field/input element/hierarchical tree node",
    note: "(functionality is the same as when using a web-browser)"
  },

  // Open document coresponding to the tree node - Enter
  {
    altKey: false,
    ctrlKey: false,
    shiftKey: false,
    which: 13,
    editable: false,
    id: "openTreeNode",
    tooltip: "Open the focused document in the left hierarchical tree",
    note: "(while the hierarchical tree item is focused)"
  },

  // Collapse/Expand hiararchical tree node - Space
  {
    altKey: false,
    ctrlKey: false,
    shiftKey: false,
    which: 32,
    editable: false,
    id: "collapseExpandeTreeNode",
    tooltip: "Collapse or open the focused category in the left hierarchical tree",
    note: "(while the hierarchical tree item is focused)"
  },

  // Toggle developer tools - CTRL + SHIFT + ALT + I
  {
    altKey: true,
    ctrlKey: true,
    shiftKey: true,
    which: 73,
    editable: true,
    id: "toggleDeveloperTools",
    tooltip: "Toggles the developer tools on/off"
  }
]
