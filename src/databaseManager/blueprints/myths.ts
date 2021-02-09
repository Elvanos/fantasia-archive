import { I_Blueprint } from "../../interfaces/I_Blueprint"
export const mythsBlueprint: I_Blueprint = {
  _id: "myths",
  order: 7,
  namePlural: "Myths/Legends",
  nameSingular: "Myth/Legend",
  icon: "fas fa-journal-whills",
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
      icon: "fas fa-journal-whills",
      sizing: 6
    },
    {
      id: "parentDoc",
      name: "Belongs under",
      type: "singleToNoneRelationship",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "myths"
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
      id: "pairedOtherMyths",
      name: "Connected to other myths/legends",
      type: "manyToManyRelationship",
      icon: "fas fa-journal-whills",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "myths",
        connectedField: "pairedOtherMyths"
      }
    },
    {
      id: "pairedEvents",
      name: "Connected to events",
      type: "manyToManyRelationship",
      icon: "mdi-calendar-text",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "events",
        connectedField: "pairedMyths"
      }
    },
    {
      id: "pairedItems",
      name: "Connected to items",
      type: "manyToManyRelationship",
      icon: "mdi-sword-cross",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "items",
        connectedField: "pairedMyths"
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
      name: "Connected traditions & customs to the myth/legend",
      type: "wysiwyg",
      sizing: 12
    },
    {
      id: "breakRelasionships",
      name: "Characters, locations and groups/institutions details",
      type: "break",
      sizing: 12
    },
    {
      id: "pairedConnectedCharacter",
      name: "Connected characters",
      type: "manyToManyRelationship",
      icon: "mdi-account",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "characters",
        connectedField: "pairedConnectedMyths"
      }
    },
    {
      id: "pairedConnectedLocations",
      name: "Connected locations",
      type: "manyToManyRelationship",
      icon: "mdi-map-marker-radius",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "locations",
        connectedField: "pairedConnectedMyths"
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
        connectedField: "pairedConnectedMyths"
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
        connectedField: "pairedConnectedMyths"
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
        connectedField: "pairedConnectedMyths"
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
        connectedField: "pairedConnectedMyths"
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
        connectedField: "pairedConnectedMyths"
      }
    }

  ]
}
