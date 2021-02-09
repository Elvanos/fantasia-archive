import { I_Blueprint } from "../../interfaces/I_Blueprint"
export const chaptersBlueprint: I_Blueprint = {
  _id: "chapters",
  order: 20,
  namePlural: "Chapters",
  nameSingular: "Chapter",
  icon: "mdi-file-outline",
  extraFields: [
    {
      id: "name",
      name: "Name",
      type: "text",
      icon: "mdi-file-outline",
      sizing: 6
    },
    {
      id: "parentDoc",
      name: "Belongs under",
      type: "singleToNoneRelationship",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "chapters"
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
      id: "content",
      name: "Chapter content",
      type: "wysiwyg",
      icon: "mdi-book-open-page-variant-outline",
      sizing: 12
    }
  ]
}
