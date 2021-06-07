export interface DialogsStateInterface {
  dialogExists: boolean
  exportDialog: {
    prepickedValue: string[]
    triggerTimestamp: string
  }
}

function state (): DialogsStateInterface {
  return {
    dialogExists: false,
    exportDialog: {
      prepickedValue: [],
      triggerTimestamp: ""
    }

  }
}

export default state
