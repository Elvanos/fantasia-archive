import { Component, Prop, Emit } from "vue-property-decorator"
import BaseClass from "src/BaseClass"

import { namespace } from "vuex-class"

const Dialogs = namespace("dialogsModule")

@Component
export default class DialogBase extends BaseClass {
  /**
   * Get the currently open-ness dialog state
   */
  @Dialogs.Getter("getDialogsState") SGET_getDialogsState!: boolean

  /**
   * Set the currently open-ness dialog state
   */
  @Dialogs.Mutation("setDialogState") SSET_setDialogState!: (input: boolean) => void

  /**
   * The current model for the specific dialog being opened
   */
  dialogModel = false

  /**
   * Prop that detemines if the dialog should be showing or not
   */
  @Prop() readonly dialogTrigger!: string

  /**
   * Triggers upon any kind of closure
   */
  @Emit()
  triggerDialogClose () {
    this.SSET_setDialogState(false)
    return true
  }

  /**
   * Trigger upon submission with some kind of value
   */
  @Emit()
  triggerDialogSubmit (val:string) {
    return val
  }

  /**
   * Settings for the scrolling thumb of the scrollarea
   */
  thumbStyle ={
    right: "-40px",
    borderRadius: "5px",
    backgroundColor: "#61a2bd",
    width: "5px",
    opacity: 1
  }
}
