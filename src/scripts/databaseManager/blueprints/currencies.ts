import { I_Blueprint } from "../../../interfaces/I_Blueprint"
export const currenciesBlueprint: I_Blueprint = {
  _id: "currencies",
  order: 8,
  namePlural: "Currencies",
  nameSingular: "Currency",
  icon: "fas fa-coins",
  category: "Details",
  extraFields: [
    {
      id: "pairedItems",
      name: "Connected to Items",
      type: "manyToManyRelationship",
      icon: "mdi-sword",
      tooltip: `
        This field is obsolete and no longer serves any purpose.
        <br>
        Pleae move your data to the corresponding new fields.
        <br>
        This field will automatically disappear once all data is gone from it.
      `,
      isLegacy: true,
      sizing: 12,
      relationshipSettings: {
        connectedObjectType: "items",
        connectedField: "pairedCurrencies"
      }
    },
    {
      id: "breakDocumentSettings",
      name: "Document settings",
      type: "break",
      sizing: 12
    },
    {
      id: "name",
      name: "Name",
      type: "text",
      icon: "fas fa-coins",
      sizing: 3
    },
    {
      id: "parentDoc",
      name: "Belongs under",
      type: "singleToNoneRelationship",
      tooltip:
        `This field is used to build up custom hierarchical tree structure in the main list of items in the left side of the app.
        <br> You can use this for an infinite amount of sub-levels to the hierarchical structure.
        <br> An example would be multiple sub-groups (provinces) of Roman Empire belonging under the main political group called "Roman Empire".
        `,
      sizing: 3,
      relationshipSettings: {
        connectedObjectType: "currencies"
      }
    },
    {
      id: "documentColor",
      name: "Text color",
      type: "colorPicker",
      icon: "mdi-eyedropper",
      tooltip:
        `This field allows for custom-coloring your document to any available HEX or RBG color.
        <br>The selected color will show on the icon and name of the document both in the hierarchical tree on the left and in the top tabs.
        `,
      sizing: 2
    },
    {
      id: "documentBackgroundColor",
      name: "Background color",
      type: "colorPicker",
      icon: "mdi-format-color-fill",
      tooltip:
        `This field allows for custom-coloring your document to any available HEX or RBG color.
        <br>The selected color will show as a background both in the hierarchical tree on the left and in the top tabs.
        `,
      sizing: 2
    },
    {
      id: "finishedSwitch",
      name: "Is finished",
      type: "switch",
      icon: "mdi-check-bold",
      tooltip:
        `This setting allows for setting the current document to finished document mode.
        <br>
        A document with finished document mode toggled on will not show any un-filled fields in view mode and will function as if "Hide empty fields" was turned on in the settings.      
        `,
      sizing: 2
    },
    {
      id: "minorSwitch",
      name: "Is a minor document",
      type: "switch",
      icon: "mdi-magnify-minus-outline",
      tooltip:
        `This setting allows for setting the current document to minor document mode.
        <br>
        A document with minor document mode toggled on will not show in any other relationship searches.<br>
        The idea behind this setting is to allow for creation of documents that will not clutter the search, but could be theoretically relevant in some very specific cases to the story (eg: distant relatives of a character).
        `,
      sizing: 3
    },
    {
      id: "deadSwitch",
      name: "Is Dead/Gone/Destroyed",
      type: "switch",
      icon: "mdi-skull-crossbones",
      tooltip:
        `This setting allows for setting the current document to dead/gone/destroyed mode.
        <br>
        A document with dead/gone/destroyed mode toggled on will have a crossed-over text modifier applied to it - showing that it is no longer a part of the current timeline.
        `,
      sizing: 3
    },
    {
      id: "categorySwitch",
      name: "Is a category",
      type: "switch",
      icon: "fas fa-folder-open",
      tooltip:
        `This setting allows for setting the current document to category mode.
        <br>
        A document with category mode toggled on will have most of its fields hidden and will not show in any other relationship searches except for "Belongs under".
        `,
      sizing: 3
    },
    {
      id: "order",
      name: "Order number",
      type: "number",
      icon: "mdi-file-tree",
      tooltip:
        `In case the default sorting via alphabet in the hierarchical tree on the left is inadequite for your needs, this field allows you to fill custom numbers to order by that get placed before the default alphabetical order.
        <br>It is heavily suggested to "pad-out" the custom order numbers by writing for example 100 (or least 10) instead of 1.
        <br>This allows for extra "padding" between the items in case a new one needs to be added in the middle without needing to redo the custom order on all documents.
        `,
      sizing: 3
    },
    {
      id: "tags",
      name: "Tags",
      type: "tags",
      icon: "mdi-tag",
      tooltip:
        `Tags are used to sort the same (or even different) document types into a custom groups based on your needs.
        <br>
        A document may have any number of tags, but each tag can be present only once.
        <br>
        This limitation also applies to any variation of lower or upper case iterations of the same tag.
        <br>
        Example: A tag called "Player Party" will be considered the same tag as "player party", "PlAyER PaRtY" or anything similar.
        `,
      sizing: 8
    },
    {
      id: "docTemplate",
      name: "Document Template",
      type: "documentTemplate",
      icon: "mdi-script-text-outline",
      tooltip:
        `
        Document templates are used to determine which fields will the current
        <br>
        document show both in view and edit mode.
        <br>
        Due to current technical limitations, new templates can be added and existing can
        <br>
        be edited/deleted only from the "Export project/document" popup.
        <br>
        Please also note that the updates to the template need a document tab reload.
        <br>
        This can be achieved either by closing an opening the current tab or switching
        <br>
        to another one and then back to this one.
        `,
      sizing: 4
    },
    {
      id: "otherNames",
      name: "Other Names & Epithets",
      type: "list",
      icon: "mdi-book-plus",
      sizing: 12
    },
    {
      id: "categoryDescription",
      name: "Category description",
      type: "wysiwyg",
      icon: "mdi-folder-edit-outline",
      sizing: 12
    },
    {
      id: "breakBasic",
      name: "Basic information",
      type: "break",
      sizing: 12
    },
    {
      id: "traits",
      name: "Defining Features/Traits",
      type: "list",
      icon: "mdi-guy-fawkes-mask",
      sizing: 12,
      predefinedListExtras: {
        affix: "Note",
        extraSelectValueList: [
        ]
      }
    },
    {
      id: "priceCurrencies",
      name: "Exchange rates to other Currencies",
      type: "manyToNoneRelationship",
      icon: "fas fa-coins",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "currencies"
      }
    },
    {
      id: "madeFromResources",
      name: "Made from Resources/Materials",
      type: "manyToNoneRelationship",
      icon: "mdi-gold",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "resources"
      }
    },
    {
      id: "pairedLocations",
      name: "Used in Locations",
      type: "manyToManyRelationship",
      icon: "mdi-map-marker-radius",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "locations",
        connectedField: "pairedCurrencies"
      }
    },
    {
      id: "usedByRaces",
      name: "Used by Races",
      type: "manyToManyRelationship",
      icon: "fas fa-dragon",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "races",
        connectedField: "localCurrencies"
      }
    },
    {
      id: "usedInPoliticalGroups",
      name: "Used by Ideologies/Political groups",
      type: "manyToManyRelationship",
      icon: "mdi-bank-outline",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "politicalGroups",
        connectedField: "localCurrencies"
      }
    },
    {
      id: "usedInOtherGroups",
      name: "Used by Organizations/Other groups",
      type: "manyToManyRelationship",
      icon: "mdi-account-group",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "guilds",
        connectedField: "localCurrencies"
      }
    },
    {
      id: "description",
      name: "Description & History",
      type: "wysiwyg",
      icon: "mdi-book-open-page-variant-outline",
      sizing: 12
    },
    {
      id: "breakNotes",
      name: "Notes",
      type: "break",
      sizing: 12
    },
    {
      id: "pairedConnectedNotes",
      name: "Connected to Lore notes/Other notes",
      type: "manyToManyRelationship",
      icon: "mdi-script-text-outline",
      sizing: 12,
      relationshipSettings: {
        connectedObjectType: "loreNotes",
        connectedField: "localCurrencies"
      }
    },
    {
      id: "breakSpoilers",
      name: "Secrets/Spoilers/DM notes",
      type: "break",
      sizing: 12,
      isSpoiler: true
    },
    {
      id: "spoilerNotes",
      name: "Secrets/Spoilers/DM notes",
      type: "wysiwyg",
      icon: "fas fa-mask",
      sizing: 12,
      isSpoiler: true,
      tooltip:
        `This field will not export by default when using the Export document functionality.
        <br>
        Instead it needs to be manually included if the user wishes to export it.
        `
    }

  ]
}
