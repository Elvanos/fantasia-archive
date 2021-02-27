import { I_OpenedDocument } from "./../../interfaces/I_OpenedDocument"

export interface OpenDocumentsStateInterface {
  documents: {
    timestamp: string,
    treeAction: boolean,
    docs: I_OpenedDocument[]
  }
}

function state (): OpenDocumentsStateInterface {
  return {
    documents: {
      timestamp: "",
      treeAction: false,
      docs: []
    }
  }
}

export default state
