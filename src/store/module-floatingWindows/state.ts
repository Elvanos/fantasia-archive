export interface FloatingWindowsStateInteface {
  advSearchWindowVisible: string,

}

function state (): FloatingWindowsStateInteface {
  return {
    advSearchWindowVisible: ""
  }
}

export default state
