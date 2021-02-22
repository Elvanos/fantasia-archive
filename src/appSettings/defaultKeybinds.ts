export const defaultKeybinds = [

  // Open keybind cheatsheet - CTRL + ALT + K
  {
    altKey: true,
    ctrlKey: true,
    shiftKey: false,
    keyCode: 75,
    editable: true,
    id: "openKeybindsCheatsheet",
    tooltip: "Open keybind cheatsheet"
  },

  // Quick new document - CTRL + N
  {
    altKey: false,
    ctrlKey: true,
    shiftKey: false,
    keyCode: 78,
    editable: true,
    id: "quickNewDocument",
    tooltip: "Quick-add new document"
  },

  // Quick existing document - CTRL + Q
  {
    altKey: false,
    ctrlKey: true,
    shiftKey: false,
    keyCode: 81,
    editable: true,
    id: "quickExistingDocument",
    tooltip: "Quick-search existing document"
  },

  // Focus left tree search - CTRL + SHIFT + Q
  {
    altKey: false,
    ctrlKey: true,
    shiftKey: true,
    keyCode: 81,
    editable: true,
    id: "focusHierarchicalTree",
    tooltip: "Focus search field in the left hierarchical tree"
  },

  // Clear input in the left tree search - CTRL + SHIFT + W
  {
    altKey: false,
    ctrlKey: true,
    shiftKey: true,
    keyCode: 87,
    editable: true,
    id: "clearInputHierarchicalTree",
    tooltip: "Clears any input in the search field in the left hierarchical tree"
  },

  // Close tab - CTRL + W
  {
    altKey: false,
    ctrlKey: true,
    shiftKey: false,
    keyCode: 87,
    editable: true,
    id: "closeTab",
    tooltip: "Close active document"
  },

  // Next tab - ALT + RIGHT ARROW
  {
    altKey: true,
    ctrlKey: false,
    shiftKey: false,
    keyCode: 39,
    editable: true,
    id: "nextTab",
    tooltip: "Next tab"
  },

  // Previous tab - ALT + LEFT ARROW
  {
    altKey: true,
    ctrlKey: false,
    shiftKey: false,
    keyCode: 37,
    editable: true,
    id: "previousTab",
    tooltip: "Previous tab"
  },

  // Save document - CTRL + S
  {
    altKey: false,
    ctrlKey: true,
    shiftKey: false,
    keyCode: 83,
    editable: true,
    id: "saveDocument",
    tooltip: "Save active document"
  },

  // Edit document - CTRL + E
  {
    altKey: false,
    ctrlKey: true,
    shiftKey: false,
    keyCode: 69,
    editable: true,
    id: "editDocument",
    tooltip: "Edit active document"
  },

  // Delete document - CTRL + D
  {
    altKey: false,
    ctrlKey: true,
    shiftKey: false,
    keyCode: 68,
    editable: true,
    id: "deleteDocument",
    tooltip: "Delete active document"
  },

  // Next focus - Tab
  {
    altKey: false,
    ctrlKey: false,
    shiftKey: false,
    keyCode: 9,
    editable: false,
    id: "nextFocus",
    tooltip: "Focuses next input field/input element/hierarchical tree node",
    note: "(functionality is the same as when using a web-browser)"
  },

  // Previous focus - Shift + Tab
  {
    altKey: false,
    ctrlKey: false,
    shiftKey: true,
    keyCode: 9,
    editable: false,
    id: "previousFocus",
    tooltip: "Focuses previous input field/input element/hierarchical tree node",
    note: "(functionality is the same as when using a web-browser)"
  },

  // Open document coresponding to the tre node - Enter
  {
    altKey: false,
    ctrlKey: false,
    shiftKey: false,
    keyCode: 13,
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
    keyCode: 32,
    editable: false,
    id: "collapseExpandeTreeNode",
    tooltip: "Collapse or open the focused category in the left hierarchical tree",
    note: "(while the hierarchical tree item is focused)"
  }
]
