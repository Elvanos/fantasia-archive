import { ActionTree } from "vuex"
import { StateInterface } from "../index"
import { OpenDocumentsStateInterface } from "./state"

const actions: ActionTree<OpenDocumentsStateInterface, StateInterface> = {

  addDocument (state, input) {
    state.commit("addDocument", input)

    setTimeout(() => {
      state.commit("resetTreeAction")
    }, 200)
  },

  updateDocument (state, input) {
    state.commit("updateDocument", input)

    setTimeout(() => {
      state.commit("resetTreeAction")
    }, 200)
  },

  removeDocument (state, input) {
    state.commit("removeDocument", input)

    setTimeout(() => {
      state.commit("resetTreeAction")
    }, 200)
  },

  resetDocuments (state) {
    state.commit("resetDocuments")

    setTimeout(() => {
      // state.commit("resetTreeAction")
    }, 200)
  },

  closeAllDocuments (state) {
    state.commit("closeAllDocuments")

    setTimeout(() => {
      state.commit("resetTreeAction")
    }, 200)
  },

  forceCloseAllDocuments (state) {
    state.commit("forceCloseAllDocuments")

    setTimeout(() => {
      state.commit("resetTreeAction")
    }, 200)
  },

  closeAllButCurrentDocuments (state, input) {
    state.commit("closeAllButCurrentDocuments", input)

    setTimeout(() => {
      state.commit("resetTreeAction")
    }, 200)
  },

  forceCloseAllButCurrentDocuments (state, input) {
    state.commit("forceCloseAllButCurrentDocuments", input)

    setTimeout(() => {
      state.commit("resetTreeAction")
    }, 200)
  },

  triggerTreeAction (state) {
    state.commit("triggerTreeAction")

    setTimeout(() => {
      state.commit("resetTreeAction")
    }, 200)
  },

  resetRemoveIndex (state) {
    state.commit("resetRemoveIndex")
  }
}

export default actions
