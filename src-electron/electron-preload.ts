/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 *
 * WARNING!
 * If accessing Node functionality (like importing @electron/remote) then in your
 * electron-main.ts you will need to set the following when you instantiate BrowserWindow:
 *
 * mainWindow = new BrowserWindow({
 *   // ...
 *   webPreferences: {
 *     // ...
 *     sandbox: false // <-- to be able to import @electron/remote in preload script
 *   }
 * }
 */

import { contextBridge } from 'electron'
import { BrowserWindow } from '@electron/remote'
import { I_faWindowControlAPI } from 'src/interfaces/I_faWindowControlAPI'

const faWindowControlAPI: I_faWindowControlAPI = {

  checkWindowMaximized () {
    const currentWindow = BrowserWindow.getFocusedWindow()
    if (currentWindow !== null) {
      return currentWindow.isMaximized()
    }
    return false
  },
  minimizeWindow () {
    const currentWindow = BrowserWindow.getFocusedWindow()

    if (currentWindow !== null) {
      currentWindow.minimize()
    }
  },

  resizeWindow () {
    const currentWindow = BrowserWindow.getFocusedWindow()

    if (currentWindow !== null) {
      if (currentWindow.isMaximized()) {
        currentWindow.unmaximize()
      } else {
        currentWindow.maximize()
      }
    }
  },

  closeWindow () {
    const currentWindow = BrowserWindow.getFocusedWindow()
    if (currentWindow !== null) {
      currentWindow.close()
    }
  }
}

contextBridge.exposeInMainWorld('faWindowControlAPI', faWindowControlAPI)
