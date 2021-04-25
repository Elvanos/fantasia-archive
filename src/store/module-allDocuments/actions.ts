import { ActionTree } from "vuex"
import { StateInterface } from "../index"
import { AllDocumentsStateInterface } from "./state"

const actions: ActionTree<AllDocumentsStateInterface, StateInterface> = {

  markAsNonFirstRun (state) {
    state.commit("markAsNonFirstRun")
  },

  addDocument (state, input) {
    state.commit("addDocument", input)
  },

  updateDocument (state, input) {
    state.commit("updateDocument", input)
  },

  removeDocument (state, input) {
    state.commit("removeDocument", input)
  },

  mapNewDocumentType (state, input) {
    state.commit("mapNewDocumentType", input)
  },

  resetDocuments (state) {
    state.commit("resetDocuments")
  }

}

export default actions
