import { GetterTree } from "vuex"
import { StateInterface } from "../index"
import { AllDocumentsStateInterface } from "./state"

const getters: GetterTree<AllDocumentsStateInterface, StateInterface> = {

  getFirstRunState (context) {
    return context.firstTime
  },

  getDocument: (state) => (id: string) => {
    return state.docs.docs.find(doc => doc._id === id)
  },

  getAllDocuments (context) {
    return context.docs
  },

  getAllDocumentsWithoutCategories (context) {
    return context.docsWithoutCategories
  },

  getDocumentsByType: (state) => (id: string) => {
    return state.docByType.find(type => type.id === id)
  },

  getDocumentsByTypeWithoutCategories: (state) => (id: string) => {
    return state.docbyTypeWithoutCategories.find(type => type.id === id)
  }

}

export default getters
