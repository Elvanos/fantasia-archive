
export interface I_ExportTemplate{
  id: string
  name: string
  documentTypeList: {
    documentTypeID: string
    excludedFieldIDList: string[]
  }[]
}
