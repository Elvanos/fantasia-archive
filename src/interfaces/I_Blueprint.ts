export interface I_ExtraFields {
  id: string
  name: string,
  icon?: string,
  sizing: number
  type:
  "text" |
  "number" |
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
  "break"

  predefinedListExtras?: {
    affix?: string
    extraSelectValueList?: string[]
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
  order: number | false,
  namePlural: string
  nameSingular: string,
  icon: string
  extraFields: I_ExtraFields[]
}
