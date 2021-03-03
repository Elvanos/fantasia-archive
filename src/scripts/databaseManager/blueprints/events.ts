import { I_Blueprint } from "../../../interfaces/I_Blueprint"
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
      sizing: 3
    },
    {
      id: "documentColor",
      name: "Color",
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
        connectedObjectType: "events"
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
        `tags
        `,
      sizing: 12
    },
    {
      id: "otherNames",
      name: "Other names & Epithets",
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
        "Annual",
        "Battle/Skirmish",
        "Celebration",
        "Construction",
        "Daily",
        "Festival",
        "Infrequent",
        "Invention",
        "Monthly",
        "Natural occurance",
        "One-time",
        "Seasonal",
        "Tragedy",
        "Unique",
        "Unnatural occurance",
        "War",
        "Other"
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
