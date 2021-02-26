import { Module } from "vuex"
import { StateInterface } from "../index"
import state, { DialogsStateInterface } from "./state"
import actions from "./actions"
import getters from "./getters"
import mutations from "./mutations"

const openedDocumentsModule: Module<DialogsStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}

export default openedDocumentsModule
