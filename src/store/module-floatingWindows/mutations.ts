import { uid } from "quasar"
import { MutationTree } from "vuex"
import { FloatingWindowsStateInteface } from "./state"

const mutation: MutationTree<FloatingWindowsStateInteface> = {

  setAdvSearchWindowVisible (state: FloatingWindowsStateInteface) {
    state.advSearchWindowVisible = uid()
  },

  setNoteCorkboardWindowVisible (state: FloatingWindowsStateInteface) {
    state.noteCorkboardWindowVisible = uid()
  },

  setDocumentPreviewWindowVisible (state: FloatingWindowsStateInteface, input: boolean) {
    state.documentPreviewVisible = (input) ? uid() : ""
  },

  setDocumentPreviewWindowID (state: FloatingWindowsStateInteface, input: string) {
    state.documentPreviewWindowID = input
  }
}

export default mutation
