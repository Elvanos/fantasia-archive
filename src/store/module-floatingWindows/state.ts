export interface FloatingWindowsStateInteface {
  advSearchWindowVisible: string,
  noteCorkboardWindowVisible: string,
}

function state (): FloatingWindowsStateInteface {
  return {
    advSearchWindowVisible: "",
    noteCorkboardWindowVisible: ""
  }
}

export default state
