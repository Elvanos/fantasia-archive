import { remote } from "electron"

/**
 * Toggles dev tools in the current window
 */
export const toggleDevTools = () => {
  /*eslint-disable */
  // @ts-ignore
  const devToolsOpened: boolean = remote.getCurrentWindow().isDevToolsOpened()

  if (devToolsOpened) {
    // @ts-ignore
    remote.getCurrentWindow().closeDevTools()
  } else {
    // @ts-ignore
    remote.getCurrentWindow().openDevTools()
  }
  /* eslint-enable */
}
