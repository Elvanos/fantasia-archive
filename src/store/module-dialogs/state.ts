export interface DialogsStateInterface {
  dialogExists: boolean
}

function state (): DialogsStateInterface {
  return {
    dialogExists: false
  }
}

export default state
