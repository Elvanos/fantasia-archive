import { MutationTree } from "vuex"
import { OptionsStateInteface } from "./state"

const mutation: MutationTree<OptionsStateInteface> = {

  setOptions (state: OptionsStateInteface, input: OptionsStateInteface) {
    for (const [key, value] of Object.entries(input)) {
      state[key] = value
    }
  }
}

export default mutation
