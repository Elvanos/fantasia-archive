
export interface I_DocumentTemplate{
  id: string
  name: string
  documentTypeList: {
    documentTypeID: string
    excludedFieldIDList: string[]
  }[]
}
