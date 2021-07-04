import { RPGSystemsStats } from "./../extraFieldLists/RPGSystemsStats"
import { I_Blueprint } from "../../../interfaces/I_Blueprint"
export const racesBlueprint: I_Blueprint = {
  _id: "races",
  order: 340,
  namePlural: "Species/Races/Flora/Fauna",
  nameSingular: "Species/Race/Flora/Fauna",
  icon: "fas fa-dragon",
  category: "World",
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
      icon: "fas fa-dragon",
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
        connectedObjectType: "races"
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
        `In case the default sorting via alphabet in the hierarchical tree on the left is inadequate for your needs, this field allows you to fill custom numbers to order by that get placed before the default alphabetical order.
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
      id: "relatedRaces",
      name: "Related Species/Races/Flora/Fauna",
      type: "manyToManyRelationship",
      icon: "fas fa-dragon",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "races",
        connectedField: "relatedRaces"
      }
    },
    {
      id: "evolvedIntoRaces",
      name: "Evolved into Species/Races/Flora/Fauna",
      type: "manyToManyRelationship",
      icon: "fas fa-dragon",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "races",
        connectedField: "evolvedFromRaces"
      }
    },
    {
      id: "evolvedFromRaces",
      name: "Evolved from Species/Races/Flora/Fauna",
      type: "manyToManyRelationship",
      icon: "fas fa-dragon",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "races",
        connectedField: "evolvedIntoRaces"
      }
    },
    {
      id: "memberCount",
      name: "Estimated population",
      type: "text",
      icon: "mdi-account-group",
      sizing: 3
    },
    {
      id: "age",
      name: "Average lifespan",
      type: "text",
      icon: "mdi-timer-sand-empty",
      sizing: 3
    },
    {
      id: "ageAdult",
      name: "Average adulthood",
      type: "text",
      icon: "mdi-timer-sand",
      sizing: 3
    },
    {
      id: "ageOldest",
      name: "Oldest known",
      type: "text",
      icon: "mdi-timer-sand-full",
      sizing: 3
    },
    {
      id: "height",
      name: "Average size",
      type: "text",
      icon: "mdi-human-male-height-variant",
      sizing: 2
    },
    {
      id: "weight",
      name: "Average weight",
      type: "text",
      icon: "mdi-weight",
      sizing: 2
    },
    {
      id: "beingType",
      name: "Type of being",
      type: "multiSelect",
      icon: "fas fa-paw",
      sizing: 4,
      predefinedSelectValues: [
        "Amphibian",
        "Animal",
        "Artificial",
        "Bacteria",
        "Bird",
        "Draconoid",
        "Elemental",
        "Fish",
        "Humanoid",
        "Insect",
        "Lichen",
        "Mammal",
        "Mushroom",
        "Plant",
        "Reptile",
        "Spiritual",
        "Virus",
        "Other"
      ]
    },
    {
      id: "sentience",
      name: "Level of sapience",
      type: "multiSelect",
      icon: "fas fa-brain",
      sizing: 4,
      predefinedSelectValues: [
        "Ascended",
        "Half-sapient",
        "Hivemind",
        "Non-sapient",
        "Sapient",
        "Other"
      ]
    },
    {
      id: "pairedCharacter",
      name: "Characters of Species/Races/Flora/Fauna",
      type: "manyToManyRelationship",
      icon: "mdi-account",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "characters",
        connectedField: "pairedRace"
      }
    },
    {
      id: "pairedConnectedPlaces",
      name: "Inhabited Locations",
      type: "manyToManyRelationship",
      icon: "mdi-map-marker-radius",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "locations",
        connectedField: "pairedConnectedRaces"
      }
    },
    {
      id: "relatedCultures",
      name: "Connected to Culture/Art",
      type: "manyToManyRelationship",
      icon: "fas fa-archway",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "culture",
        connectedField: "relatedRaces"
      }
    },
    {
      id: "localCurrencies",
      name: "Commonly used Currencies",
      type: "manyToManyRelationship",
      icon: "fas fa-coins",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "currencies",
        connectedField: "usedByRaces"
      }
    },
    {
      id: "localLanguages",
      name: "Commonly spoken Languages",
      type: "manyToManyRelationship",
      icon: "mdi-book-alphabet",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "languages",
        connectedField: "usedByRaces"
      }
    },
    {
      id: "pairedSkills",
      name: "Common Skills/Spells/Other",
      type: "manyToManyRelationship",
      icon: "mdi-sword-cross",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "skills",
        connectedField: "pairedRacesSkills"
      }
    },
    {
      id: "commonProfessions",
      name: "Common Occupations/Classes",
      type: "manyToManyRelationship",
      icon: "fab fa-pied-piper-hat",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "professions",
        connectedField: "commonRaces"
      }
    },
    {
      id: "pairedProducedFromResources",
      name: "Resources/Materials produced from the Species/Race/Flora/Fauna",
      type: "manyToManyRelationship",
      icon: "mdi-gold",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "resources",
        connectedField: "pairedProducedFromRaces"
      }
    },
    {
      id: "pairedUsedResourcesResources",
      name: "Resources/Materials used by Species/Race/Flora/Fauna",
      type: "manyToManyRelationship",
      icon: "mdi-gold",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "resources",
        connectedField: "pairedUsedResourcesRaces"
      }
    },
    {
      id: "statsList",
      name: "Stats/Attributes",
      type: "list",
      icon: "mdi-sword",
      sizing: 12,
      predefinedListExtras: {
        reverse: true,
        affix: "Stat/Attribute",
        extraSelectValueList: RPGSystemsStats
      }
    },
    {
      id: "strengths",
      name: "Strengths",
      type: "list",
      icon: "fas fa-plus-square",
      sizing: 12,
      predefinedListExtras: {
        affix: "Impact",
        extraSelectValueList: [
          "Barely noticeable",
          "Minor",
          "Medium",
          "Strong",
          "Powerful",
          "Overwhelming"
        ]
      }
    },
    {
      id: "weaknesses",
      name: "Weaknesses",
      type: "list",
      icon: "fas fa-minus-square",
      sizing: 12,
      predefinedListExtras: {
        affix: "Severity",
        extraSelectValueList: [
          "Barely noticeable",
          "Minor",
          "Medium",
          "Severe",
          "Incapacitating",
          "Deadly"
        ]
      }
    },
    {
      id: "traits",
      name: "Defining Features & Traits",
      type: "list",
      icon: "fas fa-dragon",
      sizing: 12
    },
    {
      id: "pairedConditionsPositive",
      name: "Affected by Boons",
      type: "manyToManyRelationship",
      icon: "mdi-virus",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "conditions",
        connectedField: "pairedRacesPositive"
      }
    },
    {
      id: "pairedConditionsNegative",
      name: "Affected by Afflictions",
      type: "manyToManyRelationship",
      icon: "mdi-virus",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "conditions",
        connectedField: "pairedRacesNegative"
      }
    },
    {
      id: "pairedConditionsOther",
      name: "Affected by Other conditions",
      type: "manyToManyRelationship",
      icon: "mdi-virus",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "conditions",
        connectedField: "pairedRacesOther"
      }
    },
    {
      id: "commonNames",
      name: "Common names among the Species/Races/Flora/Fauna",
      type: "list",
      icon: "fas fa-signature",
      sizing: 12,
      predefinedListExtras: {
        affix: "Normally used for",
        extraSelectValueList: [
          "Child",
          "Female",
          "Honorary",
          "Male",
          "Other"
        ]
      }
    },
    {
      id: "commonFamilyNames",
      name: "Common Family/Clan names among the Species/Races/Flora/Fauna",
      type: "list",
      icon: "mdi-family-tree",
      sizing: 12,
      predefinedListExtras: {
        affix: "Note",
        extraSelectValueList: [
        ]
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
      id: "traditions",
      name: "Traditions & Customs",
      type: "wysiwyg",
      icon: "mdi-book-open-page-variant-outline",
      sizing: 12
    },
    {
      id: "breakNotes",
      name: "Connections - Story/Lore",
      type: "break",
      sizing: 12
    },
    {
      id: "pairedConnectedNotes",
      name: "Connected to Lore notes/Other notes",
      type: "manyToManyRelationship",
      icon: "mdi-script-text-outline",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "loreNotes",
        connectedField: "pairedConnectedRaces"
      }
    },
    {
      id: "pairedConnectedMyths",
      name: "Connected to Myths, legends and stories",
      type: "manyToManyRelationship",
      icon: "fas fa-journal-whills",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "myths",
        connectedField: "pairedConnectedRaces"
      }
    },
    {
      id: "breakOther",
      name: "Connections - World & Details",
      type: "break",
      sizing: 12
    },
    {
      id: "connectedEvents",
      name: "Connected to important Events",
      type: "manyToManyRelationship",
      icon: "mdi-calendar-text",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "events",
        connectedField: "pairedRaces"
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
        connectedField: "pairedConnectedRaces"
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
        connectedField: "pairedConnectedRaces"
      }
    },
    {
      id: "breakPolitics",
      name: "Connections - Groups/Teachings",
      type: "break",
      sizing: 12
    },
    {
      id: "commonInPoliticalGroups",
      name: "Common in Ideologies/Political groups",
      type: "manyToManyRelationship",
      icon: "mdi-bank-outline",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "politicalGroups",
        connectedField: "connectedRaces"
      }
    },
    {
      id: "commonInOtherGroups",
      name: "Common in Organizations/Other groups",
      type: "manyToManyRelationship",
      icon: "mdi-account-group",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "guilds",
        connectedField: "connectedRaces"
      }
    },
    {
      id: "commonInReligiousGroups",
      name: "Common in Teachings/Religious groups",
      type: "manyToManyRelationship",
      icon: "fas fa-ankh",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "religions",
        connectedField: "connectedRaces"
      }
    },
    {
      id: "commonInMagicGroups",
      name: "Common in Magical groups",
      type: "manyToManyRelationship",
      icon: "fas fa-hat-wizard",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "magic",
        connectedField: "connectedRaces"
      }
    },
    {
      id: "commonInTechGroups",
      name: "Common in Sciencific/Technological groups",
      type: "manyToManyRelationship",
      icon: "fas fa-wrench",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "tech",
        connectedField: "connectedRaces"
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
