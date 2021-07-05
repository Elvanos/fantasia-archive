import { MutationTree } from "vuex"
import { DialogsStateInterface } from "./state"
import { uid } from "quasar"

const mutation: MutationTree<DialogsStateInterface> = {
  setDialogState (state: DialogsStateInterface, input: boolean) {
    state.dialogExists = input
  },
  setExportDialogState (state: DialogsStateInterface, input: string[], prepickedTemplateID = "") {
    state.exportDialog = {
      prepickedValue: input,
      triggerTimestamp: uid(),
      prepickedDocumentTemplate: prepickedTemplateID
    }
  }

}

export default mutation
