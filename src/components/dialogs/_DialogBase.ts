import { Component, Prop, Emit } from "vue-property-decorator"
import BaseClass from "src/BaseClass"

import { namespace } from "vuex-class"

const Dialogs = namespace("dialogsModule")

@Component
export default class DialogBase extends BaseClass {
  @Dialogs.Getter("getDialogsState") SGET_getDialogsState!: boolean
  @Dialogs.Mutation("setDialogState") SSET_setDialogState!: (input: boolean) => void

  dialogModel = false

  @Prop() readonly dialogTrigger!: string

  @Emit()
  triggerDialogClose () {
    this.SSET_setDialogState(false)
    return true
  }

  @Emit()
  triggerDialogSubmit (val:string) {
    return val
  }
}
