import { BrowserWindow, app } from 'electron'
import { enable } from '@electron/remote/main'
import path from 'path'
/**
 * Prevent app to launch a secondary instance
 */
const preventSecondaryAppInstance = (appWindow: BrowserWindow | undefined) => {
  // Do not limit the window amount if we are in auto-test mode
  if (process.env.TEST_ENV && (process.env.TEST_ENV === 'components' || process.env.TEST_ENV === 'e2e')) {
    return
  }
  /**
   * Determines if the app is the primary instance
   * - This exists as a variable due to the app bugging out if used directly from "app"
   */
  const isPrimaryInstance = app.requestSingleInstanceLock()

  // Check this is NOT the primary app instance
  if (!isPrimaryInstance) {
    app.quit()
  } else {
    /*
      Someone tried to start a second instance. That one is closed already.
      Our instance here (the first instance) maximizes it's own window and refocuses it.
    */
    app.on('second-instance', () => {
      if (appWindow) {
        if (appWindow.isMinimized()) appWindow.restore()
        appWindow.focus()
      }
    })
  }
}

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
    show: false,
    icon: path.resolve(__dirname, '../icons/icon.png'),
    webPreferences: {
      sandbox: false,
      contextIsolation: true,
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD)
    }
  })

  // Enable actual webContents inside the created window
  enable(appWindow.webContents)

  appWindow.once('ready-to-show', () => {
    if (appWindow) {
      appWindow.maximize()
      appWindow.focus()
    }
  })

  // Set the current window's menu as empty
  appWindow.setMenu(null)

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

  // Check if we are on the primary or secondary instance of the app
  preventSecondaryAppInstance(appWindow)

  // In case the window somehow didn't maximize/show for any reason; maximize it
  appWindow.maximize()
}
