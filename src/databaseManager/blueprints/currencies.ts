import { I_Blueprint } from "../../interfaces/I_Blueprint"
export const currenciesBlueprint: I_Blueprint = {
  _id: "currencies",
  order: 8,
  namePlural: "Currencies",
  nameSingular: "Currency",
  icon: "fas fa-coins",
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
      icon: "fas fa-coins",
      sizing: 6
    },
    {
      id: "parentDoc",
      name: "Belongs under",
      type: "singleToNoneRelationship",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "currencies"
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
      id: "traits",
      name: "Defining features/traits",
      type: "list",
      icon: "fas fa-coins",
      sizing: 6
    },
    {
      id: "description",
      name: "Description & History",
      type: "wysiwyg",
      sizing: 12
    },
    {
      id: "breakRelasionships",
      name: "Usage details",
      type: "break",
      sizing: 12
    },
    {
      id: "pairedLocations",
      name: "Used in locations",
      type: "manyToManyRelationship",
      icon: "mdi-map-marker-radius",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "locations",
        connectedField: "pairedCurrencies"
      }
    },
    {
      id: "usedInPoliticalGroups",
      name: "Used by political groups/ideologies",
      type: "manyToManyRelationship",
      icon: "mdi-bank-outline",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "politicalGroups",
        connectedField: "localCurrencies"
      }
    },
    {
      id: "usedByRaces",
      name: "Used by races",
      type: "manyToManyRelationship",
      icon: "fas fa-dragon",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "races",
        connectedField: "localCurrencies"
      }
    }
  ]
}
