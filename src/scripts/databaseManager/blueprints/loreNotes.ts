import { I_Blueprint } from "../../../interfaces/I_Blueprint"
export const loreNotesBlueprint: I_Blueprint = {
  _id: "loreNotes",
  order: 440,
  namePlural: "Lore notes/Other notes",
  nameSingular: "Lore note/Other note",
  icon: "mdi-script-text-outline",
  category: "Story/Lore",
  extraFields: [
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
      icon: "mdi-script-text-outline",
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
        connectedObjectType: "loreNotes"
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
      sizing: 12
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
      id: "notes",
      name: "Note list",
      type: "list",
      icon: "mdi-notebook-edit-outline",
      sizing: 12
    },
    {
      id: "textNote",
      name: "Free-form notes",
      type: "wysiwyg",
      icon: "mdi-book-open-variant",
      sizing: 12
    },

    {
      id: "breakStory",
      name: "Connections - Story/Lore",
      type: "break",
      sizing: 12
    },
    {
      id: "pairedConnectedChapters",
      name: "Connected to Chapters",
      type: "manyToManyRelationship",
      icon: "mdi-file-outline",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "chapters",
        connectedField: "pairedConnectedNotes"
      }
    },
    {
      id: "pairedConnectedNote",
      name: "Connected to Lore notes/Other notes",
      type: "manyToManyRelationship",
      icon: "mdi-script-text-outline",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "loreNotes",
        connectedField: "pairedConnectedNote"
      }
    },
    {
      id: "pairedConnectedMyths",
      name: "Connected to Myths/Legends/Stories",
      type: "manyToManyRelationship",
      icon: "fas fa-journal-whills",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "myths",
        connectedField: "pairedConnectedNotes"
      }
    },

    {
      id: "breakWorld",
      name: "Connections - World",
      type: "break",
      sizing: 12
    },
    {
      id: "pairedConnectedCharacter",
      name: "Connected to Characters",
      type: "manyToManyRelationship",
      icon: "mdi-account",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "characters",
        connectedField: "pairedConnectedNotes"
      }
    },
    {
      id: "pairedConnectedLocation",
      name: "Connected to Locations/Geography",
      type: "manyToManyRelationship",
      icon: "mdi-map-marker-radius",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "locations",
        connectedField: "pairedConnectedNotes"
      }
    },
    {
      id: "pairedConnectedEvents",
      name: "Connected to Events",
      type: "manyToManyRelationship",
      icon: "mdi-calendar-text",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "events",
        connectedField: "pairedConnectedNotes"
      }
    },
    {
      id: "pairedConnectedRaces",
      name: "Connected to Species/Races/Flora/Fauna",
      type: "manyToManyRelationship",
      icon: "fas fa-dragon",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "races",
        connectedField: "pairedConnectedNotes"
      }
    },
    {
      id: "localLanguages",
      name: "Connected to Languages",
      type: "manyToManyRelationship",
      icon: "mdi-book-alphabet",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "languages",
        connectedField: "pairedConnectedNotes"
      }
    },
    {
      id: "pairedConnectedCultures",
      name: "Connected to Culture/Art",
      type: "manyToManyRelationship",
      icon: "fas fa-archway",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "culture",
        connectedField: "pairedConnectedNotes"
      }
    },

    {
      id: "breakGroups",
      name: "Connections - Groups/Teachings",
      type: "break",
      sizing: 12
    },
    {
      id: "pairedConnectedPolGroups",
      name: "Connected to Ideologies/Political groups",
      type: "manyToManyRelationship",
      icon: "mdi-bank-outline",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "politicalGroups",
        connectedField: "pairedConnectedNotes"
      }
    },
    {
      id: "pairedConnectedOtherGroups",
      name: "Connected to Organizations/Other groups",
      type: "manyToManyRelationship",
      icon: "mdi-account-group",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "guilds",
        connectedField: "pairedConnectedNotes"
      }
    },
    {
      id: "pairedConnectedRelGroups",
      name: "Connected to Teachings/Religious groups",
      type: "manyToManyRelationship",
      icon: "fas fa-ankh",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "religions",
        connectedField: "pairedConnectedNotes"
      }
    },
    {
      id: "pairedConnectedMagicGroups",
      name: "Connected to Schools of Magic/Magical groups",
      type: "manyToManyRelationship",
      icon: "fas fa-hat-wizard",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "magic",
        connectedField: "pairedConnectedNotes"
      }
    },
    {
      id: "pairedConnectedTechGroups",
      name: "Connected to Sciences/Technological groups",
      type: "manyToManyRelationship",
      icon: "fas fa-wrench",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "tech",
        connectedField: "pairedConnectedNotes"
      }
    },
    {
      id: "breakDetails",
      name: "Connections - Details",
      type: "break",
      sizing: 12
    },
    {
      id: "pairedConnectedSkills",
      name: "Connected to Skills/Spells/Other",
      type: "manyToManyRelationship",
      icon: "mdi-sword-cross",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "skills",
        connectedField: "pairedConnectedNotes"
      }
    },
    {
      id: "pairedConnectedItems",
      name: "Connected to Items",
      type: "manyToManyRelationship",
      icon: "mdi-sword",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "items",
        connectedField: "pairedConnectedNotes"
      }
    },

    {
      id: "pairedConnectedProfessions",
      name: "Connected to Occupations/Classes",
      type: "manyToManyRelationship",
      icon: "fab fa-pied-piper-hat",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "professions",
        connectedField: "pairedConnectedNotes"
      }
    },
    {
      id: "pairedConnectedConditions",
      name: "Connected to Afflictions/Boons/Conditions",
      type: "manyToManyRelationship",
      icon: "mdi-virus",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "conditions",
        connectedField: "pairedConnectedNotes"
      }
    },
    {
      id: "pairedConnectedResources",
      name: "Connected to Resources/Materials",
      type: "manyToManyRelationship",
      icon: "mdi-gold",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "resources",
        connectedField: "pairedConnectedNotes"
      }
    },
    {
      id: "localCurrencies",
      name: "Connected to Currencies",
      type: "manyToManyRelationship",
      icon: "fas fa-coins",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "currencies",
        connectedField: "pairedConnectedNotes"
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
