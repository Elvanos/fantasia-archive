import { Module } from "vuex"
import { StateInterface } from "../index"
import state, { OptionsStateInteface } from "./state"
import actions from "./actions"
import getters from "./getters"
import mutations from "./mutations"

const keybindsModule: Module<OptionsStateInteface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}

export default keybindsModule
