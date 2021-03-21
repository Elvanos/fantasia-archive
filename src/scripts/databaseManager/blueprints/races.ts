import { I_Blueprint } from "../../../interfaces/I_Blueprint"
export const racesBlueprint: I_Blueprint = {
  _id: "races",
  order: 11,
  namePlural: "Species/Races",
  nameSingular: "Species/Race",
  icon: "fas fa-dragon",
  extraFields: [
    {
      id: "breakBasic",
      name: "Basic information",
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
      id: "documentColor",
      name: "Text Color",
      type: "colorPicker",
      icon: "mdi-eyedropper",
      tooltip:
        `This field allows for custom-coloring your document to any available HEX or RBG color.
        <br>The selected color will show on the icon and name of the document both in the hierarchical tree on the left and in the top tabs.
        `,
      sizing: 2
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
      id: "order",
      name: "Order number",
      type: "number",
      icon: "mdi-file-tree",
      tooltip:
        `In case the default sorting via alphabet in the hierarchical tree on the left is inadequite for your needs, this field allows you to fill custom numbers to order by that get placed before the default alphabetical order.
        <br>It is heavily suggested to "pad-out" the custom order numbers by writing for example 100 (or least 10) instead of 1.
        <br>This allows for extra "padding" between the items in case a new one needs to be added in the middle without needing to redo the custom order on all documents.
        `,
      sizing: 2
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
      sizing: 2
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
      name: "Other names & Epithets",
      type: "list",
      icon: "mdi-book-plus",
      sizing: 6
    },
    {
      id: "relatedRaces",
      name: "Related races",
      type: "manyToManyRelationship",
      icon: "fas fa-dragon",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "races",
        connectedField: "relatedRaces"
      }
    },
    {
      id: "memberCount",
      name: "Estimated population",
      type: "text",
      icon: "mdi-account-group",
      sizing: 2
    },
    {
      id: "age",
      name: "Average lifespan",
      type: "text",
      icon: "mdi-timer-sand-empty",
      sizing: 2
    },
    {
      id: "ageAdult",
      name: "Average adulthood",
      type: "text",
      icon: "mdi-timer-sand",
      sizing: 2
    },
    {
      id: "ageOldest",
      name: "Oldest known",
      type: "text",
      icon: "mdi-timer-sand-full",
      sizing: 2
    },
    {
      id: "height",
      name: "Average height",
      type: "text",
      icon: "mdi-human-male-height-variant",
      sizing: 3
    },
    {
      id: "weight",
      name: "Average weight",
      type: "text",
      icon: "mdi-weight",
      sizing: 3
    },
    {
      id: "beingType",
      name: "Type of being",
      type: "multiSelect",
      icon: "fas fa-paw",
      sizing: 6,
      predefinedSelectValues: [
        "Amphibian",
        "Animal",
        "Atrificial",
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
        "Sprititual",
        "Virus",
        "Other"
      ]
    },
    {
      id: "sentience",
      name: "Level of sapience",
      type: "multiSelect",
      icon: "fas fa-brain",
      sizing: 6,
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
      id: "strength",
      name: "Strength",
      type: "text",
      icon: "fas fa-dumbbell",
      sizing: 2
    },
    {
      id: "constitution",
      name: "Constitution",
      type: "text",
      icon: "mdi-shield",
      sizing: 2
    },
    {
      id: "dexterity",
      name: "Dexterity",
      type: "text",
      icon: "mdi-run-fast",
      sizing: 2
    },
    {
      id: "intellect",
      name: "Intellect",
      type: "text",
      icon: "mdi-brain",
      sizing: 2
    },
    {
      id: "wisdom",
      name: "Wisdom/Willpower",
      type: "text",
      icon: "fas fa-yin-yang",
      sizing: 2
    },
    {
      id: "charisma",
      name: "Charisma",
      type: "text",
      icon: "mdi-drama-masks",
      sizing: 2
    },
    {
      id: "traits",
      name: "Defining features/traits",
      type: "list",
      icon: "fas fa-dragon",
      sizing: 12
    },
    {
      id: "strengths",
      name: "Strengths",
      type: "list",
      icon: "fas fa-plus-square",
      sizing: 6,
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
      sizing: 6,
      predefinedListExtras: {
        affix: "Severity",
        extraSelectValueList: [
          "Barely noticeable",
          "Minor",
          "Medium",
          "Severe",
          "Imcapacitating",
          "Deadly"
        ]
      }
    },
    {
      id: "commonNames",
      name: "Common names among the race/species",
      type: "list",
      icon: "fas fa-signature",
      sizing: 6,
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
      name: "Common family/clan names among the race/species",
      type: "list",
      icon: "mdi-family-tree",
      sizing: 6,
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
      sizing: 12
    },
    {
      id: "traditions",
      name: "Traditions & Customs",
      type: "wysiwyg",
      sizing: 12
    },
    {
      id: "breakRelasionships",
      name: "Members & Other connections",
      type: "break",
      sizing: 12
    },
    {
      id: "pairedCharacter",
      name: "Characters of race",
      type: "manyToManyRelationship",
      icon: "mdi-account",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "characters",
        connectedField: "pairedRace"
      }
    },
    {
      id: "pairedConnectedPlaces",
      name: "Inhabited locations",
      type: "manyToManyRelationship",
      icon: "mdi-map-marker-radius",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "locations",
        connectedField: "pairedConnectedRaces"
      }
    },
    {
      id: "localCurrencies",
      name: "Commonly used currencies",
      type: "manyToManyRelationship",
      icon: "fas fa-coins",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "currencies",
        connectedField: "usedByRaces"
      }
    },
    {
      id: "localLanguages",
      name: "Commonly spoken languages",
      type: "manyToManyRelationship",
      icon: "mdi-book-alphabet",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "languages",
        connectedField: "usedByRaces"
      }
    },
    {
      id: "commonInPoliticalGroups",
      name: "Common in political groups/ideologies",
      type: "manyToManyRelationship",
      icon: "mdi-bank-outline",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "politicalGroups",
        connectedField: "connectedRaces"
      }
    },
    {
      id: "commonInReligiousGroups",
      name: "Common in religious groups/teachings",
      type: "manyToManyRelationship",
      icon: "fas fa-ankh",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "religions",
        connectedField: "connectedRaces"
      }
    },
    {
      id: "commonInMagicGroups",
      name: "Common in magical groups/teachings",
      type: "manyToManyRelationship",
      icon: "fas fa-hat-wizard",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "magic",
        connectedField: "connectedRaces"
      }
    },
    {
      id: "commonInTechGroups",
      name: "Common in science/technology groups/institutions",
      type: "manyToManyRelationship",
      icon: "fas fa-wrench",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "tech",
        connectedField: "connectedRaces"
      }
    },
    {
      id: "breakOther",
      name: "Other details",
      type: "break",
      sizing: 12
    },

    {
      id: "connectedEvents",
      name: "Connected to important events",
      type: "manyToManyRelationship",
      icon: "mdi-calendar-text",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "events",
        connectedField: "pairedRaces"
      }
    },
    {
      id: "pairedConnectedMyths",
      name: "Connected to myths, legends and stories",
      type: "manyToManyRelationship",
      icon: "fas fa-journal-whills",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "myths",
        connectedField: "pairedConnectedRaces"
      }
    },
    {
      id: "pairedConnectedItems",
      name: "Connected to legendary items/artifacts",
      type: "manyToManyRelationship",
      icon: "mdi-sword-cross",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "items",
        connectedField: "pairedConnectedRaces"
      }
    }
  ]
}
