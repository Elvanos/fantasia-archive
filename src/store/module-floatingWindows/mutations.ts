import { uid } from "quasar"
import { MutationTree } from "vuex"
import { FloatingWindowsStateInteface } from "./state"

const mutation: MutationTree<FloatingWindowsStateInteface> = {

  setAdvSearchWindowVisible (state: FloatingWindowsStateInteface) {
    state.advSearchWindowVisible = uid()
  },

  setNoteCorkboardWindowVisible (state: FloatingWindowsStateInteface) {
    state.noteCorkboardWindowVisible = uid()
  }
}

export default mutation
