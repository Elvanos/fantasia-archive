export interface I_ExtraDocumentFields{
  id: string
  value: any
  type?: string
}

export interface I_OpenedDocument{
  _id: string
  _rev?: string
  editMode: boolean
  type: string
  icon: string
  hasEdits: boolean
  isFinished: boolean
  isNew: boolean
  url: string
  scrollDistance?: number
  extraFields: I_ExtraDocumentFields[]
}

export interface I_ShortenedDocument{
  label: string
  icon: string
  type: string
  url: string
  expandable?: boolean
  _id: string
  hierarchicalPath?: string
  isCategory?: boolean
  isMinor?: boolean
  isDead?: boolean
  parentDoc: string | false
  children: I_ShortenedDocument[]
  extraFields: I_ExtraDocumentFields[]
  color?: string
  tags?: string[]

  isNew?: boolean
  editMode?: boolean
  hasEdits?: boolean

  activeTypeSearch?: boolean
  filteredOut?: boolean
  exactMatch?: boolean
  fullWordMatch?: number
  partialWordMatch?: number
  isMatched?: boolean
}
