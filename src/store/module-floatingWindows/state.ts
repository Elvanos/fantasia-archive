export interface FloatingWindowsStateInteface {
  advSearchWindowVisible: string,
  noteCorkboardWindowVisible: string,
  documentPreviewVisible: string,
  documentPreviewWindowID: string
}

function state (): FloatingWindowsStateInteface {
  return {
    advSearchWindowVisible: "",
    noteCorkboardWindowVisible: "",
    documentPreviewVisible: "",
    documentPreviewWindowID: ""
  }
}

export default state
