import { GetterTree } from "vuex"
import { StateInterface } from "../index"
import { OpenDocumentsStateInterface } from "./state"

const getters: GetterTree<OpenDocumentsStateInterface, StateInterface> = {
  getAllDocuments (context) {
    return context.documents
  },

  getDocument: (state) => (id: string) => {
    return state.documents.docs.find(doc => doc._id === id)
  }
}

export default getters
