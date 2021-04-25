import { I_ShortenedDocument } from "src/interfaces/I_OpenedDocument"

export interface AllDocumentsStateInterface {
  firstTime: boolean
  docs: {
    timestamp: string,
    docs: I_ShortenedDocument[],
  }
  docsWithoutCategories:{
    timestamp: string,
    docs: I_ShortenedDocument[],
  }
  docByType: {
    id: string
    timestamp: string,
    docs: I_ShortenedDocument[],
  }[]
  docbyTypeWithoutCategories: {
    id: string
    timestamp: string,
    docs: I_ShortenedDocument[],
  }[]
}

function state (): AllDocumentsStateInterface {
  return {
    firstTime: true,
    docs: {
      timestamp: "",
      docs: []
    },
    docsWithoutCategories: {
      timestamp: "",
      docs: []
    },
    docByType: [],
    docbyTypeWithoutCategories: []
  }
}

export default state
