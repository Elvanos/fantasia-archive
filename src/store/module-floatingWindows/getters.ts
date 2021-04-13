import { GetterTree } from "vuex"
import { StateInterface } from "../index"
import { FloatingWindowsStateInteface } from "./state"

const getters: GetterTree<FloatingWindowsStateInteface, StateInterface> = {
  getAdvSearchWindowVisible (context) {
    return context.advSearchWindowVisible
  }
}

export default getters
