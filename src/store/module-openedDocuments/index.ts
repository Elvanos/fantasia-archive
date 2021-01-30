import { Module } from "vuex"
import { StateInterface } from "../index"
import state, { OpenDocumentsStateInterface } from "./state"
import actions from "./actions"
import getters from "./getters"
import mutations from "./mutations"

const openedDocumentsModule: Module<OpenDocumentsStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}

export default openedDocumentsModule
