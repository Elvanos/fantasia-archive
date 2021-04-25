import { Module } from "vuex"
import { StateInterface } from "../index"
import state, { AllDocumentsStateInterface } from "./state"
import actions from "./actions"
import getters from "./getters"
import mutations from "./mutations"

const allDocumentsModule: Module<AllDocumentsStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}

export default allDocumentsModule
