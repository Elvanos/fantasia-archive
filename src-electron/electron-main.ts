import { fixAppName } from 'src-electron/mainScripts/fixAppName'
import { windowsDevToolsExtensionsFix } from 'src-electron/mainScripts/windowsDevToolsExtensionsFix'
import { startApp, openAppWindowManager, closeAppManager } from 'app/src-electron/mainScripts/appManagement'
import { tweakMenuRemover, tweakRetriveOS } from 'src-electron/mainScripts/tweaks'

/**
 * Determines what platform the app is running on
 * - Needed in case process is undefined under Linux
 */
const platform = tweakRetriveOS()

// Fix app name and connected pathing to it
fixAppName()

// Fix Windows-only DevTools-bug concerning dark mode
windowsDevToolsExtensionsFix(platform)

// Start a singular app instance
startApp()

// Performance improvement tweak
tweakMenuRemover()

// Set up manager for opening a singular app window
openAppWindowManager()

// Set up manager for closing app instance
closeAppManager(platform)
