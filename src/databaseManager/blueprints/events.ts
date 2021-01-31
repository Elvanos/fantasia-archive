import { I_Blueprint } from "../../interfaces/I_Blueprint"
export const blueprint: I_Blueprint = {
  _id: "events",
  order: 16,
  namePlural: "Events",
  nameSingular: "Event",
  icon: "mdi-calendar-text",
  extraFields: [
    {
      id: "name",
      name: "Name",
      type: "text",
      icon: "mdi-account",
      sizing: 6
    },
    {
      id: "parentDoc",
      name: "Parent document",
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
      icon: "mdi-account-plus",
      sizing: 6
    }
  ]
}
export default blueprint
