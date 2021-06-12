import { Module } from "vuex"
import { StateInterface } from "../index"
import state, { ProjectInterface } from "./state"
import actions from "./actions"
import getters from "./getters"
import mutations from "./mutations"

const projectModule: Module<ProjectInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}

export default projectModule
