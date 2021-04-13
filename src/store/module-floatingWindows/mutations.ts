import { uid } from "quasar"
import { MutationTree } from "vuex"
import { FloatingWindowsStateInteface } from "./state"

const mutation: MutationTree<FloatingWindowsStateInteface> = {

  setAdvSearchWindowVisible (state: FloatingWindowsStateInteface) {
    state.advSearchWindowVisible = uid()
  }
}

export default mutation
