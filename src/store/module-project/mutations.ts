import { MutationTree } from "vuex"
import { ProjectInterface } from "./state"

const mutation: MutationTree<ProjectInterface> = {

  setProjecLoadingState (state: ProjectInterface, input: boolean) {
    state.projectLoaded = input
  },

  setProjectName (state: ProjectInterface, input: string) {
    state.projectName = input
  }

}

export default mutation
