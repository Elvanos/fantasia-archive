import { I_OpenedDocument } from "./../../interfaces/I_OpenedDocument"

export interface OpenDocumentsStateInterface {
  documents: {
    timestamp: string,
    docs: I_OpenedDocument[]
  }
}

function state (): OpenDocumentsStateInterface {
  return {
    documents: {
      timestamp: "",
      docs: []
    }
  }
}

export default state
