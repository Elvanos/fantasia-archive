import { I_Blueprint } from "../../interfaces/I_Blueprint"
export const blueprint: I_Blueprint = {
  _id: "currencies",
  order: 13,
  namePlural: "Currencies",
  nameSingular: "Currency",
  icon: "mdi-database",
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
      icon: "mdi-account-plus",
      sizing: 6
    }
  ]
}
export default blueprint
