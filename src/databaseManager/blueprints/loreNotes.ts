import { I_Blueprint } from "../../interfaces/I_Blueprint"
export const loreNotesBlueprint: I_Blueprint = {
  _id: "loreNotes",
  order: 19,
  namePlural: "Lore notes",
  nameSingular: "Lore note",
  icon: "mdi-script-text-outline",
  extraFields: [
    {
      id: "name",
      name: "Name",
      type: "text",
      icon: "mdi-script-text-outline",
      sizing: 6
    },
    {
      id: "parentDoc",
      name: "Belongs under",
      type: "singleToNoneRelationship",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "loreNotes"
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
      id: "notes",
      name: "Note list",
      type: "list",
      icon: "mdi-notebook-edit-outline",
      sizing: 12
    },
    {
      id: "textNote",
      name: "Free-form notes",
      type: "wysiwyg",
      icon: "mdi-book-open-variant",
      sizing: 12
    }
  ]
}
