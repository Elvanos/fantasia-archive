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

/*
import * as sqlite3 from 'sqlite3'
import { app } from 'electron'
sqlite3.verbose()
const db = new sqlite3.Database(`${app.getPath('userData')}/test.sqlite3`)

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS lorem (info TEXT, yeet TEXT)')

  const stmt = db.prepare('INSERT INTO lorem VALUES (?,?)')
  for (let i = 0; i < 10; i++) {
    stmt.run(['Ipsum ' + i, 'Yeet ' + (i + 10)])
  }

  stmt.finalize()

  db.each('SELECT rowid AS id, info, yeet FROM lorem', (_err, row: {id:string, info:string, yeet:string}) => {
    console.log(row.id + ': ' + row.info)
    console.log(row.id + ': ' + row.yeet)
  })
})

db.close()
 */
