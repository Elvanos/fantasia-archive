
# Changelog

---

## 0.1.5

### Known issues

- When creating a brand new project, Fantasia Archive sometimes doesn't load the default categories in the left hierarchical tree. A temporary workaround before the issue is fixed is restarting the program - the project stays intact, can be normally edited and no data loss occurs.
- Some users report that dialog (popups) don't function the very first time you start FA. This is solved by restarting the application. The bug doesn't seem to appear again once FA has been started at least once before.

### Bugfixes & Optimizations

- Fixed a typo in `Type of being` field in the `Species/Races` document type
- Fixed a bug that was causing the relationship dropdowns sometimes not be clickable and instead caused dragging of the app window when shown over the top of the drag-bar at the top of the app
- Updated advanced search guide with missing information about full-text search
- Changes a small bug when the `New Object` dialog wasn't respecting option changes being done in the same session of the program being opened
- Fixed tag groups in hierarchical tree not respecting custom order and alphabetical order
- Fixed a rather peculiar recuring bug that could cause the database to endlessly attempt to update a document while constantly throwing errors
- Managed to fix or at least mitigate multiple memory-leaks across the app
- Optimized multiple parts of the code to run smoother
- Fixed wrong icons in some fields in some document types

### New features

- Added a dedicated button that opens the connected documents straight from the little chips in relationship fields while in edit mode
- Added support for background color for documents
- Added support for "Minor document" mode switch for better organization and visual representation of documents
- Added support for "Dead/Gone/Destroyed" mode switch for better organization and visual representation of documents

### QoL adjustments

- Updated fullscreen editor looks to work more like a proper document editor
- Reordered the basic document settings inside the app and separated them from the document content
- Adjusted maximum width of switch fields to make them look like spaggeti
- Updated the Advanced search guide with new additions and added one new Trivia popup text concerning it
- Made the app a bit more "snappy" by decreasing animation lengths when transitioning between documents
- Updated `readme` file on how to properly compile the app since I made it OSS and all... kinda important

---

## 0.1.4

### Known issues

- When creating a brand new project, Fantasia Archive sometimes doesn't load the default categories in the left hierarchical tree. A temporary workaround before the issue is fixed is restarting the program - the project stays intact, can be normally edited and no data loss occurs.

### Bugfixes

- Fixed a bug that was preventing the text editor field from closing the full-screen view upon saving via the CTRL+S shortcut while in the full-screen mode.
- Fixed a bug that was causing top-level documents to randomly expand their respect document type when opened in the active tab list
- Fixed a small bug causing newly created documents to "bounce around" or scroll roughly to the half of the document on their own
- Fixed a bug that was preventing external URL links opening from the text editor field
- Fixed a bug with filter via the document type that was causing the filter to search by document type ID instead of the actual name
- Fixed a bug where the big text editor field was also copying input text styles (colors, backgrounds, fonts)
- Globally changed a typo in the "Connected to myths. legends and stories" field
- Globally changed a typo in the tooltip of the "Tags" field
- Globally changed a typo in the tooltip of "Scientifical" to "Scientific"
- Fixed a typo in "Add under parent" strings
- Fixed a few typos in some keybind strings strings
- Fixed and unified a lot of typos/gramatical errors across multiple fields and document types
- Reworded and fixed typos in the Single and Multi relationship field tooltips
- Fixed horizontal scrollbar looks and functionality
- Fixed a bug that was causing keybinds to register and affect the UI even if a popup was opened over it
- Fixed typos of "Sentience" instead of "Sapience" in some of the "Race/Species" document type fiels

### New features

- Added a custom keybind support to the app
- Added Tips, Tricks & Trivia popup, a menu item, buttons and project screen box
- Added a resizeable hierarchical tree for all your categorical needs
  - The app also remembers the tree-size on restart so your preferred width gets transferred between your world-building sessions
- Added dark mode
- Finally added license to the software (oopsy...)
- Added a fancier Welcome screen looks
- Added social links (Discord and Patreon)
- Restyled and pimped-up text editor field to replace most of your MS-word needs (obviously supports both light and dark modes properly)!
- Added a specific field/value support for the relationship and quick-search popups
  - This also means added support for filtering by document color
- Added automatic sub-category closure in the hierarchical tree when closing the parent category
- Added new App option keybind
- Added App options
  - Added option: Dark mode
  - Added option: Accessibility - Text shadow
  - Added option: Accessibility - Pronounced count divider
  - Added option: Hide Welcome screen social links
  - Added option: Hide tips popup on start screen
  - Added option: Hide tips on project screen
  - Added option: Disable document control bar
  - Added option: Disable document guides
  - Added option: Disable document tooltips
  - Added option: Hide empty fields
  - Added option: Stop quick-search close after selection
  - Added option: Don't precheck category filter
  - Added option: Close quick popups with the same key
  - Added option: Stop sublevel collapse in tree
  - Added option: Hide project name in the tree
  - Added option: Hide document count entirely
  - Added option: Hide category count
  - Added option: Invert category position
  - Added option: Invert tree custom order sorting
  - Added option: Hide tags in the tree
  - Added option: Top tags in the tree
  - Added option: Compact tags

### QoL adjustments

- Globally renamed "Color" field to "Text Color" to allow better filtering via field-search for future addition of background color support
- Added proper coloring to custom links in the text editor field
- Added displaying category and document count in the hierarchical tree by default at first glance
- Added more contrasting text-select colors for dark mode
- Added Quick add/search popup functionality to the Project menu
- Added icons to the app menus
- Added a small debounce timer to the relationship searches to reduce the lag it was causing
- Lightly touched upon the color scheme
- Increased readability of highlit bits of the Advanced search guide
- Added an auto-select of the newly added field upon adding new text items in the list field-type

---

## 0.1.3

### Known issues

- When creating a brand new project, Fantasia Archive sometimes doesn't load the default categories in the left hierarchical tree. A temporary workaround before the issue is fixed is restarting the program - the project stays intact, can be normally edited and no data loss occurs.

### Bugfixes

- Fixed a MASSIVE two-way relationship bug that would have prevented a future integration of user-defined addition fields and document types
- Hopefully fixed a bug with keybinds not registering sometimes
- Added a missing row of connected "Sciences/Technologies" (connected, ally and enemy) to the "Sciences/Technologies" document type
- Added a missing row of connected "Religions/Teachings" (connected, ally and enemy) to the "Religions/Teachings" document type
- Added a missing row of connected "Magic/Spell" (connected, ally and enemy) to the "Magic/Spell" document type
- Fixed an occasional wrong click register on the document tree (opening document instead of expanding/collapsing)
- Fixed non-functional whitespace trimming for multiple document fields upon filling in input
- Fixed the "Name" field disappearing upon full deletion of text
- Fixed a bug with single/multi-select fields working unintuitively for adding new values (eg: Character personality traits field or Sex field)
- Fixed a tiny glitch when the hierarchical tree arrow was sometimes creating new documents instead of opening the category
- Fixed a bug of persisting opened tabs when creating new projects/importing existing project over already opened ones
- Added an auto-remover of no longer existing relationships filled in within single and multi relationship fields
- Fixed a typo with "Sciences/Technologies" missing the plural form
- Adjusted the naming of "Other/Notes" to "Lore notes/Other notes" to be functional with the new search engine (apologies for this one, a new solution might be implemented later)
- Adjusted the naming of "Myths/Legends" to "Myths/Legends/Stories" to cover a wider area of content
- Fixed a bug with a full-screen text editor overlapping the menu
- Fixed a bug where list-typed fields were properly saving temporary data when switching between tabs in the note fields
- Fixed broken padding of the document in "Chapters" and "Lore notes/Other notes"
- Fixed a typo in the "Connected Locations" field inside the "Magic/Spell" document type
- Fixed a visual glitch with icons sometimes "bouncing" or "flickering" when hovered over with the mouse

### New features

- Massive improvement to rendering and performance of the app by leveraging some of the workloads to the GPU from the CPU
- Added a safeguard dialog for new project creation in case an opened project exists
- Added a safeguard dialog for project importing in case an opened project exists
- Added automatic redirecting to the project screen upon importing an existing project or creating a new one
- Added loading transition for longer action (export, import, and creating a new project)
- Added toast messaging informing the user of how the long actions went
- Added a project title above the hierarchical tree
- Added a new 2-way relationship field "Connected characters" for all kinds of groups (Political, Religious, Magical, and Technological) that connect with 4 new respect character fields.
  - This change was done due to some characters having relationships with certain ground that didn't necessarily count as memberships, alliances, or hostilities.
- Added support for opening connected document in single and multi-relationships without focusing on the document itself and instead just open it in the tab list
- Added continuous closing of tabs via holding down CTRL + W
- Added an "Advanced search guide" dialog with a manual on how to use the advanced search
- Added a "Changelog" dialog - you might be reading it right now!
- Added an option of "Raw magical energy manipulation" to "General schools of magic" in "Magic/Spell" document type (for those of us who like our characters throwing half a city at each other anime-style!)
- Added "About Fantasia Archive" dialog showing current app version (more details will be added in the future)
- New control bar added for documents and project control along with a more intelligent button redesign
- A new logo added to the app (better visibility of the logo in small scales and icons)
- Massive overhaul of the search engine used by the Quick opening existing document and single/multi relationship fields (now supports tags, categories, document types, intelligent filtering, and intelligent sorting via the importance of the found values)
- Added color support to single/multi relationship fields
- Added a hierarchical path to Quick opening existing document and single/multi relationship fields
- Added filtering to include or exclude documents that are considered categories in the  Quick opening existing document dialog
- Removed "Practitioners/Engineers" field from "Sciences/Technologies" document type as it was a duplicate of another one and was causing issues
- Added automatic opening of hierarchical tree branches upon adding/moving documents under/among them
- Added tags support

### QoL adjustments

- Adjusted animations through the app to make it feel a bit more responsive
- Lightly modified the app color-scheme to offer better readability of contrast
- Adjusted document display screen for easier legibility, quicker navigation, and fancy-schmancy look
- Changed icon for the button triggering quick-adding of new documents
- Reworked the way tab closing works - now mimicks the functionality of how web-browsers handle it
- Added syncing of opened tabs to the matching item in the hierarchical tree
- Changed "Character traits" field name to "Traits & Characteristics" in the "Character" document type
- Hierarchical tree looks optimized for more streamlined looks and better space-usage
- Changed the looks of tooltips, relationship fields, and selects to go well with the current app looks
- Adjusted tab-list width to allow for more content to show
- Improved scroll behavior in the keybind cheatsheet dialog (looks a little strange now, but will work better as more keybinds are added)
- Improved response time from the Quick-search popup upon opening
- Renamed "Notable practitioners/scientists" to "Technology/Science users" from "Sciences/Technologies" document type
- Added a highlight for the save document button in case the current document has edits
- Added a tooltip showing how many of the objects in the hierarchical tree are documents and how many are categories
- Hierarchical tree search bar is now attached on the top of the tree and no longer scrolls along with the rest of the content of the tree to allow better useability. The search now also expands to full app width on focus via user's interaction. The search icon was moved to the right and the field reset icon was moved to the left.
- Modified selected and activity indicators for already selected/active items in dropdown lists to not clash with the highlighting from the filter results
- Slightly modified the scrollbar visuals to be less intrusive
- Added a light golden tint to the background of the app to go easy on the user's eyes before the dark mode is added
- Improved performance by reducing the amount of time the side-tree re-renders
- Visually aligned custom order badge for both nodes with and without children
- Added dark visuals to the single-select and multi-select fields to align with the rest of the app
- All popup dialogs have been unified to a dark-color mode
- Prettified a dialog popup for confirmation of closing a document with active edits
- Added a small filter over the big white areas to ease-up on the user's eyes before the dark mode is added

---

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
- Unified graphical interface coloring of Quick-add and Quick-search dialogs to work consistently with the coloring of individual documents/document types same as the left hierarchical tree

---

## 0.1.1

### Bugfixes

- Fixed a bunch of typos
- Fixed names not changing with single/multi relationships if one gets name updated showing on the others properly
- Fixed forced lower-case for notes in lists and relationship fields
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
- Added "Oldest known" and "Average adulthood" fields to the "Species/Races" document type
- Added "Continent" and "Landmass" to prefilled options to the "Location type" field in the "Locations" document type
- Added "Ethnicity" field in "Characters" document type
- Added "Titles" field in "Characters" document type

---

## 0.1.0

### Innitial release
