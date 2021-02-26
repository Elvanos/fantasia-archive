import { MutationTree } from "vuex"
import { DialogsStateInterface } from "./state"

const mutation: MutationTree<DialogsStateInterface> = {
  setDialogState (state: DialogsStateInterface, input: boolean) {
    state.dialogExists = input
  }

}

export default mutation
