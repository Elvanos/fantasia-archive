import { I_Blueprint } from "../../interfaces/I_Blueprint"
export const locationBlueprint: I_Blueprint = {
  _id: "locations",
  namePlural: "Locations",
  nameSingular: "Location",
  icon: "mdi-map-marker-radius",
  extraFields: [
    {
      id: "name",
      name: "Name",
      type: "text",
      sizing: 12
    },
    {
      id: "otherNames",
      name: "Other names",
      type: "list",
      sizing: 6
    },
    {
      id: "connectedCharacters",
      name: "Connected characters",
      type: "singleToManyRelationship",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "characters",
        connectedField: "connectedLocations"
      }
    }
  ]
}
