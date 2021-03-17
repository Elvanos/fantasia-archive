import { MutationTree } from "vuex"
import { KeybindsStateInterface } from "./state"
import { I_KeyPressObject } from "./../../interfaces/I_KeypressObject"

import { uid } from "quasar"

const resetCurrentKey = () => {
  return {
    altKey: true,
    ctrlKey: true,
    shiftKey: true,
    id: "",
    which: 99999
  }
}
const mutation: MutationTree<KeybindsStateInterface> = {

  registerDefaultKeybind (state: KeybindsStateInterface, input: I_KeyPressObject) {
    if (!input.id) {
      return
    }

    state.keyManagement.currentKeyPress = resetCurrentKey()

    const existingIndex = state.keyManagement.defaults.findIndex(e => e.id === input.id)

    // Ovewrite existing if it exists
    if (existingIndex > -1) {
      state.keyManagement.defaults[existingIndex] = input
    }
    // Otherwise, add a new one altogether
    else {
      state.keyManagement.defaults.push(input)
    }

    state.keyManagement.timestamp = uid()
  },

  deregisterDefaultKeybind (state: KeybindsStateInterface, input: I_KeyPressObject) {
    if (!input.id) {
      return
    }

    state.keyManagement.currentKeyPress = resetCurrentKey()

    const existingIndex = state.keyManagement.defaults.findIndex(e => e.id === input.id)
    // Remove the existing keybind
    if (existingIndex > -1) {
      state.keyManagement.defaults.splice(existingIndex, 1)

      state.keyManagement.timestamp = uid()
    }
  },

  registerUserKeybind (state: KeybindsStateInterface, input: I_KeyPressObject) {
    if (!input.id) {
      return
    }

    state.keyManagement.currentKeyPress = resetCurrentKey()

    const existingIndex = state.keyManagement.userKeybinds.findIndex(e => e.id === input.id)
    // Ovewrite existing if it exists
    if (existingIndex > -1) {
      state.keyManagement.userKeybinds[existingIndex] = input
    }
    // Otherwise, add a new one altogether
    else {
      state.keyManagement.userKeybinds.push(input)
    }

    state.keyManagement.timestamp = uid()
  },

  deregisterUserKeybind (state: KeybindsStateInterface, input: I_KeyPressObject) {
    if (!input.id) {
      return
    }

    state.keyManagement.currentKeyPress = resetCurrentKey()

    const existingIndex = state.keyManagement.userKeybinds.findIndex(e => e.id === input.id)
    // Remove the existing keybind
    if (existingIndex > -1) {
      state.keyManagement.userKeybinds.splice(existingIndex, 1)

      state.keyManagement.timestamp = uid()
    }
  },

  updatePressedKey (state: KeybindsStateInterface, input: I_KeyPressObject) {
    state.keyManagement.currentKeyPress = input
    state.keyManagement.timestamp = uid()
  }
}

export default mutation
