import { I_Blueprint } from "../../interfaces/I_Blueprint"
export const eventsBlueprint: I_Blueprint = {
  _id: "events",
  order: 16,
  namePlural: "Events",
  nameSingular: "Event",
  icon: "mdi-calendar-text",
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
      icon: "mdi-account",
      sizing: 6
    },
    {
      id: "parentDoc",
      name: "Belongs under",
      type: "singleToNoneRelationship",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "events"
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
      sizing: 4
    },
    {
      id: "eventType",
      name: "Event type",
      type: "multiSelect",
      icon: "fas fa-meteor",
      sizing: 2,
      predefinedSelectValues: [
        "Celebration",
        "Festival",
        "Tragedy",
        "Natural occurance",
        "Unnatural occurance",
        "War",
        "Battle/Skirmish",
        "Construction",
        "Invention",
        "Unique",
        "One-time",
        "Annual",
        "Seasonal",
        "Monthly",
        "Daily",
        "Infrequent"
      ]
    },
    {
      id: "startDate",
      name: "Start date",
      type: "text",
      icon: "fas fa-hourglass-start",
      sizing: 2
    },
    {
      id: "endDate",
      name: "End date",
      type: "text",
      icon: "fas fa-hourglass-end",
      sizing: 2
    },
    {
      id: "participants",
      name: "Amount of participants",
      type: "number",
      icon: "mdi-account-group",
      sizing: 2
    },
    {
      id: "pairedCharacter",
      name: "Prominent actors",
      type: "manyToManyRelationship",
      icon: "mdi-account",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "characters",
        connectedField: "pairedEvent"
      }
    },
    {
      id: "pairedRaces",
      name: "Affected or involved species/races",
      type: "manyToManyRelationship",
      icon: "fas fa-dragon",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "races",
        connectedField: "connectedEvents"
      }
    },
    {
      id: "pairedLocations",
      name: "Connected to locations",
      type: "manyToManyRelationship",
      icon: "mdi-map-marker-radius",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "locations",
        connectedField: "pairedEvent"
      }
    },
    {
      id: "pairedEvents",
      name: "Connected to other events",
      type: "manyToManyRelationship",
      icon: "mdi-calendar-text",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "events",
        connectedField: "pairedEvents"
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
        connectedField: "pairedEvents"
      }
    },
    {
      id: "pairedMyths",
      name: "Connected to myths/legends",
      type: "manyToManyRelationship",
      icon: "fas fa-journal-whills",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "myths",
        connectedField: "pairedEvents"
      }
    },
    {
      id: "description",
      name: "Description & History",
      type: "wysiwyg",
      sizing: 12
    },
    {
      id: "breakGroups",
      name: "Involved groups",
      type: "break",
      sizing: 12
    },
    {
      id: "connectedPolitical",
      name: "Connected political groups",
      type: "manyToManyRelationship",
      icon: "mdi-bank-outline",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "politicalGroups",
        connectedField: "connectedEvents"
      }
    },
    {
      id: "connectedReligious",
      name: "Connected religious groups",
      type: "manyToManyRelationship",
      icon: "fas fa-ankh",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "religions",
        connectedField: "connectedEvents"
      }
    },
    {
      id: "connectedMagical",
      name: "Connected magical groups",
      type: "manyToManyRelationship",
      icon: "fas fa-hat-wizard",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "magic",
        connectedField: "connectedEvents"
      }
    },
    {
      id: "connectedTech",
      name: "Connected tech/scientifical groups",
      type: "manyToManyRelationship",
      icon: "fas fa-wrench",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "tech",
        connectedField: "connectedEvents"
      }
    }
  ]
}
