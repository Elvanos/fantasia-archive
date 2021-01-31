import { I_Blueprint } from "./../../interfaces/I_Blueprint"
export const blueprint: I_Blueprint = {
  _id: "characters",
  order: 18,
  namePlural: "Characters",
  nameSingular: "Character",
  icon: "mdi-account",
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
        connectedObjectType: "characters"
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
    },
    {
      id: "sex",
      name: "Sex",
      type: "singleSelect",
      icon: "mdi-gender-male-female",
      sizing: 3,
      predefinedSelectValues: ["Male", "Female", "Other"]
    },
    {
      id: "skills",
      name: "Skills",
      type: "list",
      icon: "mdi-sword-cross",
      sizing: 6,
      predefinedListExtras: {
        affix: "Level",
        extraSelectValueList: [
          "Trainee",
          "Good",
          "Expert",
          "God!"
        ]
      }
    },
    {
      id: "personalityTraits",
      name: "Personality traits",
      type: "multiSelect",
      icon: "mdi-head-cog",
      sizing: 6,
      predefinedSelectValues: ["Impulsive", "Clever", "Leet", "Streetsmart", "Bashful", "CRAZY!!!"]
    },
    {
      id: "manyToSingle",
      name: "MANY to SINGLE",
      type: "manyToSingleRelationship",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "characters",
        connectedField: "singleToMany"
      }
    },
    {
      id: "singleToMany",
      name: "SINGLE to MANY",
      type: "singleToManyRelationship",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "characters",
        connectedField: "manyToSingle"
      }
    },
    {
      id: "singleToNone",
      name: "SINGLE to NONE",
      type: "singleToNoneRelationship",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "characters"
      }
    },
    {
      id: "singleToSingle",
      name: "SINGLE to SINGLE",
      type: "singleToSingleRelationship",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "characters",
        connectedField: "singleToSingle"
      }
    },
    {
      id: "manyToNone",
      name: "MANY to NONE",
      type: "manyToNoneRelationship",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "characters"
      }
    },
    {
      id: "manyToMany",
      name: "MANY to MANY",
      type: "manyToManyRelationship",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "characters",
        connectedField: "manyToMany"
      }
    },
    {
      id: "dreamAndMemes",
      name: "Dreams and memes",
      type: "wysiwyg",
      sizing: 12
    }

  ]
}
export default blueprint
