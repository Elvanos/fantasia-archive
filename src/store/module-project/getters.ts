import { GetterTree } from "vuex"
import { StateInterface } from "../index"
import { ProjectInterface } from "./state"

const getters: GetterTree<ProjectInterface, StateInterface> = {
  getProjectData (context) {
    return context
  },

  getProjectLoadedStatus (context) {
    return context.projectLoaded
  },

  getProjectName (context) {
    return context.projectName
  }
}

export default getters
