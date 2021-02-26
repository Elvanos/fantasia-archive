import { GetterTree } from "vuex"
import { StateInterface } from "../index"
import { DialogsStateInterface } from "./state"

const getters: GetterTree<DialogsStateInterface, StateInterface> = {

  getDialogsState (state) {
    return state.dialogExists
  }
}

export default getters
