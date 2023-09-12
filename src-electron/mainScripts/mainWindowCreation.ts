import { BrowserWindow } from 'electron'
import { enable } from '@electron/remote/main'
import path from 'path'

/**
  * Creates the main app window
  */
export const mainWindowCreation = () => {
  /**
   * Initial window options
   */
  let appWindow: BrowserWindow | undefined = new BrowserWindow({
    useContentSize: true,
    frame: false,
    icon: path.resolve(__dirname, '../icons/icon.png'),
    webPreferences: {
      sandbox: false,
      contextIsolation: true,
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD)
    }
  })

  // Enable actual webContents inside the created window
  enable(appWindow.webContents)

  // Set the current window as empty and maximize it
  appWindow.setMenu(null)
  appWindow.maximize()

  // Load the basic app URL
  appWindow.loadURL(process.env.APP_URL)

  // Open DevTools by default if the app is running in Dev mode or Production with debug enabled
  if (process.env.DEBUGGING) {
    appWindow.webContents.openDevTools()
  }

  // Make sure the app window properly closes when it is closed in any way, shape or form
  appWindow.on('closed', () => {
    appWindow = undefined
  })
}
