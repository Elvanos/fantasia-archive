import { GetterTree } from "vuex"
import { StateInterface } from "../index"
import { KeybindsStateInterface } from "./state"

const getters: GetterTree<KeybindsStateInterface, StateInterface> = {
  getCurrentKeyBindData (context) {
    return context.keyManagement
  }
}

export default getters
