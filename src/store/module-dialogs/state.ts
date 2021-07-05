export interface DialogsStateInterface {
  dialogExists: boolean
  exportDialog: {
    prepickedValue: string[]
    prepickedDocumentTemplate: string
    triggerTimestamp: string
  }
}

function state (): DialogsStateInterface {
  return {
    dialogExists: false,
    exportDialog: {
      prepickedValue: [],
      triggerTimestamp: "",
      prepickedDocumentTemplate: ""
    }

  }
}

export default state
