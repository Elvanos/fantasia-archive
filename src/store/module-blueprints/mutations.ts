import { I_Blueprint } from "./../../interfaces/I_Blueprint"
import { MutationTree } from "vuex"
import { BlueprintStateInterface } from "./state"

const mutation: MutationTree<BlueprintStateInterface> = {
  setAllBlueprints (state: BlueprintStateInterface, blueprints: I_Blueprint[]) {
    state.blueprints = blueprints
  }
}

export default mutation
