import { GetterTree } from "vuex"
import { StateInterface } from "../index"
import { FloatingWindowsStateInteface } from "./state"

const getters: GetterTree<FloatingWindowsStateInteface, StateInterface> = {
  getAdvSearchWindowVisible (context) {
    return context.advSearchWindowVisible
  },
  getNoteCorkboardhWindowVisible (context) {
    return context.noteCorkboardWindowVisible
  }
}

export default getters
