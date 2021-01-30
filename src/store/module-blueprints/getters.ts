import { GetterTree } from "vuex"
import { StateInterface } from "../index"
import { BlueprintStateInterface } from "./state"

const getters: GetterTree<BlueprintStateInterface, StateInterface> = {
  getAllBlueprints (context) {
    return context.blueprints
  },

  getBlueprint: (state) => (type: string) => {
    return state.blueprints.find(blueprint => blueprint._id === type)
  }
}

export default getters
