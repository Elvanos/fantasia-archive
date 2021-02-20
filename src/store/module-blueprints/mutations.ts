import { I_Blueprint } from "./../../interfaces/I_Blueprint"
import { MutationTree } from "vuex"
import { BlueprintStateInterface } from "./state"

const mutation: MutationTree<BlueprintStateInterface> = {
  setAllBlueprints (state: BlueprintStateInterface, blueprints: I_Blueprint[]) {
    state.blueprints = blueprints
  },

  setBlueprint (state: BlueprintStateInterface, blueprint: I_Blueprint) {
    const index = state.blueprints.findIndex((single: I_Blueprint) => blueprint._id === single._id)
    if (index !== -1) {
      state.blueprints[index] = blueprint
    } else {
      state.blueprints.push(blueprint)
    }
  }
}

export default mutation
