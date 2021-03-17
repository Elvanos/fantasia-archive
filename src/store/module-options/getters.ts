import { GetterTree } from "vuex"
import { StateInterface } from "../index"
import { OptionsStateInteface } from "./state"

const getters: GetterTree<OptionsStateInteface, StateInterface> = {
  getOptions (context) {
    return context
  }
}

export default getters
