import { GetterTree } from "vuex"
import { StateInterface } from "../index"
import { FloatingWindowsStateInteface } from "./state"

const getters: GetterTree<FloatingWindowsStateInteface, StateInterface> = {
  getAdvSearchWindowVisible (context) {
    return context.advSearchWindowVisible
  },
  getNoteCorkboardWindowVisible (context) {
    return context.noteCorkboardWindowVisible
  },
  getDocumentPreviewVisible (context) {
    return context.documentPreviewVisible
  },
  getDocumentPreviewWindowID (context) {
    return context.documentPreviewWindowID
  }
}

export default getters
