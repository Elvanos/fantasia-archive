import { I_Blueprint } from "../../interfaces/I_Blueprint"
export const itemsBlueprint: I_Blueprint = {
  _id: "items",
  order: 10,
  namePlural: "Items",
  nameSingular: "Item",
  icon: "mdi-sword-cross",
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
      icon: "mdi-sword-cross",
      sizing: 6
    },
    {
      id: "parentDoc",
      name: "Belongs under",
      type: "singleToNoneRelationship",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "items"
      }
    },
    {
      id: "order",
      name: "Order number",
      type: "number",
      icon: "mdi-file-tree",
      sizing: 2
    },
    {
      id: "otherNames",
      name: "Other names",
      type: "list",
      icon: "mdi-book-plus",
      sizing: 6
    },
    {
      id: "features",
      name: "Prominent features",
      type: "list",
      icon: "mdi-sword-cross",
      sizing: 6,
      predefinedListExtras: {
        affix: "Note",
        extraSelectValueList: [
        ]
      }
    },
    {
      id: "strength",
      name: "Strength change",
      type: "text",
      icon: "fas fa-dumbbell",
      sizing: 2
    },
    {
      id: "constitution",
      name: "Constitution change",
      type: "text",
      icon: "mdi-shield",
      sizing: 2
    },
    {
      id: "dexterity",
      name: "Dexterity change",
      type: "text",
      icon: "mdi-run-fast",
      sizing: 2
    },
    {
      id: "intellect",
      name: "Intellect change",
      type: "text",
      icon: "mdi-brain",
      sizing: 2
    },
    {
      id: "wisdom",
      name: "Wisdom/Willpower change",
      type: "text",
      icon: "fas fa-yin-yang",
      sizing: 2
    },
    {
      id: "charisma",
      name: "Charisma change",
      type: "text",
      icon: "mdi-drama-masks",
      sizing: 2
    },
    {
      id: "pairedItems",
      name: "Connected to other items",
      type: "manyToManyRelationship",
      icon: "mdi-sword-cross",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "items",
        connectedField: "pairedItems"
      }
    },
    {
      id: "pairedMagic",
      name: "Capable of utilizing spells/magic",
      type: "manyToManyRelationship",
      icon: "fas fa-hat-wizard",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "magic",
        connectedField: "pairedItems"
      }
    },
    {
      id: "pairedEvents",
      name: "Involved in events",
      type: "manyToManyRelationship",
      icon: "mdi-calendar-text",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "events",
        connectedField: "pairedItems"
      }
    },
    {
      id: "pairedMyths",
      name: "Involved in myths/legends",
      type: "manyToManyRelationship",
      icon: "fas fa-journal-whills",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "myths",
        connectedField: "pairedItems"
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
      name: "Connected traditions & customs to the item",
      type: "wysiwyg",
      sizing: 12
    },
    {
      id: "breakRelasionships",
      name: "Involved with characters and groups/institutions",
      type: "break",
      sizing: 12
    },
    {
      id: "pairedConnectedCharacter",
      name: "Connected to characters",
      type: "manyToManyRelationship",
      icon: "mdi-account",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "characters",
        connectedField: "pairedConnectedItems"
      }
    },
    {
      id: "pairedConnectedLocations",
      name: "Connected to locations",
      type: "manyToManyRelationship",
      icon: "mdi-map-marker-radius",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "locations",
        connectedField: "pairedConnectedItems"
      }
    },
    {
      id: "pairedConnectedRaces",
      name: "Connected to species/races",
      type: "manyToManyRelationship",
      icon: "fas fa-dragon",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "races",
        connectedField: "pairedConnectedItems"
      }
    },
    {
      id: "pairedConnectedPolGroups",
      name: "Connected to political groups/ideologies",
      type: "manyToManyRelationship",
      icon: "mdi-bank-outline",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "politicalGroups",
        connectedField: "pairedConnectedItems"
      }
    },
    {
      id: "pairedConnectedRelGroups",
      name: "Connected to religious groups/teachings",
      type: "manyToManyRelationship",
      icon: "fas fa-ankh",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "religions",
        connectedField: "pairedConnectedItems"
      }
    },
    {
      id: "pairedConnectedMagicGroups",
      name: "Connected to magic/spells",
      type: "manyToManyRelationship",
      icon: "fas fa-hat-wizard",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "magic",
        connectedField: "pairedConnectedItems"
      }
    },
    {
      id: "pairedConnectedTechGroups",
      name: "Connected to technology/science",
      type: "manyToManyRelationship",
      icon: "fas fa-wrench",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "tech",
        connectedField: "pairedConnectedItems"
      }
    }

  ]
}
