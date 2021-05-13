export interface I_ExtraFields {
  id: string
  name: string,
  icon?: string,
  sizing: number
  tooltip?: string
  isLegacy?: boolean
  type:
  "text" |
  "number" |
  "colorPicker" |
  "switch" |
  "list" |
  "wysiwyg" |
  "singleSelect" |
  "multiSelect" |
  "singleToNoneRelationship" |
  "manyToNoneRelationship" |
  "singleToSingleRelationship" |
  "singleToManyRelationship" |
  "manyToSingleRelationship" |
  "manyToManyRelationship" |
  "break" |
  "tags"

  predefinedListExtras?: {
    reverse?: boolean
    affix?: string
    extraSelectValueList?: (string | {
      title: string,
      values: string[]
    }) []
  }
  predefinedSelectValues?: string[]
  relationshipSettings?: {
    connectedObjectType: string
    connectedField?: string
  }
}
export interface I_Blueprint{
  _id: string
  _rev?: string
  order: number,
  namePlural: string
  nameSingular: string,
  icon: string
  category: string
  extraFields: I_ExtraFields[]
}
