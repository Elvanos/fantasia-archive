import { I_Blueprint } from "../../../interfaces/I_Blueprint"
export const magicBlueprint: I_Blueprint = {
  _id: "magic",
  order: 13,
  namePlural: "Magic/Spells",
  nameSingular: "Magic/Spell",
  icon: "fas fa-hat-wizard",
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
      icon: "fas fa-hat-wizard",
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
        connectedObjectType: "magic"
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
      sizing: 3
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
      sizing: 3
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
        `This setting allows for setting the current document to dead/gone/estroyed mode.
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
      id: "otherNames",
      name: "Other names & Epithets",
      type: "list",
      icon: "mdi-book-plus",
      sizing: 6
    },
    {
      id: "headquarters",
      name: "Headquarters",
      type: "singleToNoneRelationship",
      icon: "mdi-map-marker-radius",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "locations"
      }
    },
    {
      id: "users",
      name: "Member/User count",
      type: "text",
      icon: "mdi-account-group",
      sizing: 2
    },
    {
      id: "leaders",
      name: "Leading Figures",
      type: "manyToNoneRelationship",
      icon: "mdi-crown",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "characters"
      }
    },
    {
      id: "typeMagic",
      name: "Type",
      type: "multiSelect",
      icon: "fas fa-monument",
      sizing: 3,
      predefinedSelectValues: [
        "Magical institution",
        "Magical teaching",
        "Magical technique",
        "Ritual",
        "School of magic",
        "Spell",
        "Other"
      ]
    },
    {
      id: "formMagic",
      name: "General schools of magic",
      type: "multiSelect",
      icon: "fas fa-hand-sparkles",
      sizing: 3,
      predefinedSelectValues: [
        "Abjuration ",
        "Conjuration",
        "Divination",
        "Enchantment",
        "Evocation",
        "Illusion",
        "Necromancy",
        "Transmutation",
        "World alteration",
        "Raw magical energy manipulation",
        "Other"
      ]
    },
    {
      id: "pairedCharacter",
      name: "Magic/Spell Users",
      type: "manyToManyRelationship",
      icon: "mdi-account",
      sizing: 4,
      tooltip:
        `This field is meant to be used as a way to map out spell-users and their respected spells.
        <br>
        For diplomatic/ideological connections between magical groups/institutions and characters, use the field below in the "Diplomatic relationships & Influences" section.
        `,
      relationshipSettings: {
        connectedObjectType: "characters",
        connectedField: "pairedMagic"
      }
    },
    {
      id: "pairedSpells",
      name: "Connected Spells/Rituals",
      type: "manyToManyRelationship",
      icon: "fas fa-hat-wizard",
      sizing: 4,
      tooltip:
        `This field is meant to be used as a way to map out connection between different spells/rituals to each other.
        <br>
        For diplomatic/ideological connections between magical groups/institutions, use the field below in the "Diplomatic relationships & Influences" section.
        `,
      relationshipSettings: {
        connectedObjectType: "magic",
        connectedField: "pairedSpells"
      }
    },
    {
      id: "pairedItems",
      name: "Usable through the use of Items",
      type: "manyToManyRelationship",
      icon: "mdi-sword-cross",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "items",
        connectedField: "pairedMagic"
      }
    },
    {
      id: "connectedRaces",
      name: "Common Species/Races among the practitioners",
      type: "manyToManyRelationship",
      icon: "fas fa-dragon",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "races",
        connectedField: "commonInMagicGroups"
      }
    },
    {
      id: "localLanguages",
      name: "Common Languages among the practitioners",
      type: "manyToManyRelationship",
      icon: "mdi-book-alphabet",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "languages",
        connectedField: "usedInMagicalGroups"
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
      name: "Diplomatic relationships & Influences",
      type: "break",
      sizing: 12
    },
    {
      id: "governLocations",
      name: "Ruled Locations",
      type: "manyToManyRelationship",
      icon: "mdi-map-marker-radius",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "locations",
        connectedField: "governMagical"
      }
    },
    {
      id: "connectedLocations",
      name: "Connected Locations",
      type: "manyToManyRelationship",
      icon: "mdi-map-marker-radius",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "locations",
        connectedField: "connectedMagical"
      }
    },
    {
      id: "pairedConnectionCharacter",
      name: "Connected Characters",
      type: "manyToManyRelationship",
      icon: "mdi-account",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "characters",
        connectedField: "pairedConnectionMagicGroup"
      }
    },
    {
      id: "pairedBelongingCharacter",
      name: "Prominent Members",
      type: "manyToManyRelationship",
      icon: "mdi-account",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "characters",
        connectedField: "pairedBelongingMagicGroup"
      }
    },
    {
      id: "pairedAllyCharacter",
      name: "Prominent Allies",
      type: "manyToManyRelationship",
      icon: "mdi-account",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "characters",
        connectedField: "pairedAllyMagicGroup"
      }
    },
    {
      id: "pairedEnemyCharacter",
      name: "Prominent Enemies",
      type: "manyToManyRelationship",
      icon: "mdi-account",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "characters",
        connectedField: "pairedEnemyMagicGroup"
      }
    },
    {
      id: "pairedConnectedPolGroups",
      name: "Connected Political groups",
      type: "manyToManyRelationship",
      icon: "mdi-bank-outline",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "politicalGroups",
        connectedField: "pairedConnectedMagicalGroups"
      }
    },
    {
      id: "pairedAllyPolGroups",
      name: "Allied Political groups",
      type: "manyToManyRelationship",
      icon: "mdi-bank-outline",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "politicalGroups",
        connectedField: "pairedAllyMagicalGroups"
      }
    },
    {
      id: "pairedEnemyPolGroups",
      name: "Enemy Political groups",
      type: "manyToManyRelationship",
      icon: "mdi-bank-outline",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "politicalGroups",
        connectedField: "pairedEnemyMagicalGroups"
      }
    },
    {
      id: "pairedConnectedReligiousGroups",
      name: "Connected Religious groups/Teachings",
      type: "manyToManyRelationship",
      icon: "fas fa-ankh",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "religions",
        connectedField: "pairedConnectedMagicGroups"
      }
    },
    {
      id: "pairedAllyReligiousGroups",
      name: "Allied Religious groups/Teachings",
      type: "manyToManyRelationship",
      icon: "fas fa-ankh",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "religions",
        connectedField: "pairedAllyMagicGroups"
      }
    },
    {
      id: "pairedEnemyReligiousGroups",
      name: "Enemy Religious groups/Teachings",
      type: "manyToManyRelationship",
      icon: "fas fa-ankh",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "religions",
        connectedField: "pairedEnemyMagicGroups"
      }
    },
    {
      id: "pairedConnectedMagicalGroups",
      name: "Connected Magical groups/Teachings",
      type: "manyToManyRelationship",
      icon: "fas fa-hat-wizard",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "magic",
        connectedField: "pairedConnectedMagicalGroups"
      }
    },
    {
      id: "pairedAllyMagicalGroups",
      name: "Allied Magical groups/Teachings",
      type: "manyToManyRelationship",
      icon: "fas fa-hat-wizard",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "magic",
        connectedField: "pairedAllyMagicalGroups"
      }
    },
    {
      id: "pairedEnemyMagicalGroups",
      name: "Enemy Magical groups/Teachings",
      type: "manyToManyRelationship",
      icon: "fas fa-hat-wizard",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "magic",
        connectedField: "pairedEnemyMagicalGroups"
      }
    },

    {
      id: "pairedConnectedTechGroups",
      name: "Connected Scientific/Technological groups",
      type: "manyToManyRelationship",
      icon: "fas fa-wrench",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "tech",
        connectedField: "pairedConnectedMagicalGroups"
      }
    },
    {
      id: "pairedAllyTechGroups",
      name: "Allied Scientific/Technological groups",
      type: "manyToManyRelationship",
      icon: "fas fa-wrench",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "tech",
        connectedField: "pairedAllyMagicalGroups"
      }
    },
    {
      id: "pairedEnemyTechGroups",
      name: "Enemy Scientific/Technological groups",
      type: "manyToManyRelationship",
      icon: "fas fa-wrench",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "tech",
        connectedField: "pairedEnemyMagicalGroups"
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
      name: "Connected Events",
      type: "manyToManyRelationship",
      icon: "mdi-calendar-text",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "events",
        connectedField: "connectedMagical"
      }
    },
    {
      id: "pairedConnectedMyths",
      name: "Connected to Myths, legends and stories",
      type: "manyToManyRelationship",
      icon: "fas fa-journal-whills",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "myths",
        connectedField: "pairedConnectedMagicGroups"
      }
    },
    {
      id: "pairedConnectedItems",
      name: "Connected to legendary Items",
      type: "manyToManyRelationship",
      icon: "mdi-sword-cross",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "items",
        connectedField: "pairedConnectedMagicGroups"
      }
    }
  ]
}
