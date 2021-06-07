import { MutationTree } from "vuex"
import { DialogsStateInterface } from "./state"
import { uid } from "quasar"

const mutation: MutationTree<DialogsStateInterface> = {
  setDialogState (state: DialogsStateInterface, input: boolean) {
    state.dialogExists = input
  },
  setExportDialogState (state: DialogsStateInterface, input: string[]) {
    state.exportDialog = {
      prepickedValue: input,
      triggerTimestamp: uid()
    }
  }

}

export default mutation
