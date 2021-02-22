import { I_KeyPressObject } from "./../../interfaces/I_KeypressObject"

export interface KeybindsStateInterface {
  keyManagement: KeyManagementInterface
}

export interface KeyManagementInterface {
  timestamp: string,
  userKeybinds: I_KeyPressObject[]
  defaults: I_KeyPressObject[]
  currentKeyPress: I_KeyPressObject
}

function state (): KeybindsStateInterface {
  return {
    keyManagement: {
      timestamp: "",
      userKeybinds: [],
      defaults: [],
      currentKeyPress: {
        altKey: true,
        ctrlKey: true,
        shiftKey: true,
        id: "",
        keyCode: 99999
      }
    }
  }
}

export default state
