# Changelog

## 0.1.3

### Bugfixes

- Fixed the "Name" field disappearing upon full deletion of text

### New features

- A new logo added to the app (better visibility of the logo in small scales and icons)
- Massive overhaul of the search engine used by the Quick opening existing document and single/multi relationship fields (now supports tags, categories, document types, inteligent filtering and inteligent sorting via importance of the found values)

### QoL adjustments

- Added a hierarchical path to Quick opening existing document and single/multi relationship fields
- Added color support to single/multi relationship fields
- Added filtering to include or exclude documents that are considered categories in the  Quick opening existing document dialog
- Improved performance by reducing the amount of time the side-tree re-renders
- Added automatic opening of hierarchical tree branches upon adding/moving documents under/among them
- Alligned custom order sorting for both nodes with and without children
- All popup dialogs have been unified to dark-color mode
- Added a small filter over the big white areas to ease-up on the user's eyes before darkmode is added

## 0.1.2

### Bugfixes

- Fixed a safeguard for opening multiple overlapping dialogs unintentionally

### New features

- Reworked hierarchical left tree
- Added "Add under parent" button to the hierarchical tree, document page view, and quick search existing documents
- Added mouse button support and improved keyboard support to the hierarchical tree
- Reworked the top bar of the app to include tabs, window control elements, and basic menus of the app
- Added a check upon closing the app to avoid unintentional loss of data due to unsaved documents

### QoL adjustments

- Added middle-click closing for the tabs
- Added automatical opening of the project page after opening an existing project from a folder
- Reversed default custom sorting for the "Order" field in the left side tree
- Modified auto-closing behavior of hierarchical left tree nodes when moving/adding/removing documents
- Added a delay for tooltip popups on fields of documents
- Remove persistence from the document with an active edits confirmation dialog
- Unified graphical interface coloring of Quick-add and Quick-search dialogs to work consistently with the coloring of individual documents/document types same as the left hierarchical tre

## 0.1.1

### Bugfixes

- Fixed a bunch of typos
- Fixed names not changing with single/multi relatinships if one gets name updated showing on the others properly
- Fixed forced lower-case for notes in lists and relashionship fields
- Fixed a bug that prevented documents with the same names properly working in the hierarchical tree

### New features

- Added keyboard shortcut support
- Added quick-add new document pop-up
- Added quick-search existing document pop-up
- Added keybinds cheatsheet pop-up
- Added control buttons for keybinds cheatsheet, quick search, and quick add
- Added document coloring support for the document hierarchical tree and tabs on the top
- Added category/document switch for handling custom subcategories
- Added tooltip support for all input fields
- Added "Color picker" type field
- Added "Switch" type field

### QoL adjustments

- Alphabetically sorted most predefined lists (eg: types of political groups) with "Other/Unique" fields at the bottom. The fields that are ordered logically (eg: severity of racial weakness/strength) remain ordered via logical sorting and not by alphabet
- Added explanation via tooltip to "Belongs under", "Order" and "Color" fields
- Adjusted tooltip font-size to be actually readable
- Added program FAVICON support
- Moved the document edit/save/delete buttons to the top
- Adjusted text selection to look better with the aesthetics of the app
- Adjusted scrollbars to look better with the aesthetics of the app
- Added auto-focus on name field when opening edit mode of a document
- Added auto-focus AND auto-select of all text of the name field when creating a new document
- Renamed "Lore notes" to "Other/Notes" for more intuitive usage
- Renamed "Other names" to "Other names & Epithets" across all document types
- Renamed "Power level" to "Combat rating" in "Characters" document type
- Renamed "Level of sentience" to "Level of sapience" in "Species/Races" document type
- Added "Oldest known" and "Average adulthood" fields to "Species/Races" document type
- Added "Continent" and "Landmass" to prefilled options to "Location type" field in "Locations" document type
- Added "Ethnicity" field in "Characters" document type
- Added "Titles" field in "Characters" document type

---

## 0.1.0

### Innitial release
