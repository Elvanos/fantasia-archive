import { Module } from "vuex"
import { StateInterface } from "../index"
import state, { BlueprintStateInterface } from "./state"
import actions from "./actions"
import getters from "./getters"
import mutations from "./mutations"

const blueprintsModule: Module<BlueprintStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}

export default blueprintsModule
