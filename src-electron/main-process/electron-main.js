import { app, BrowserWindow, nativeTheme, Menu, MenuItem, shell } from 'electron'

try {
  if (process.platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(require('path').join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) { }

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = __dirname
}

let mainWindow

function createWindow () {
  app.commandLine.appendSwitch('disable-software-rasterizer', 'true')
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    useContentSize: true,
      frame: false,

      webPreferences: {
        // Change from /quasar.conf.js > electron > nodeIntegration;
        // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
        nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
        nodeIntegrationInWorker: process.env.QUASAR_NODE_INTEGRATION,
        enableRemoteModule: true,
        // More info: /quasar-cli/developing-electron-apps/electron-preload-script
        // preload: path.resolve(__dirname, 'electron-preload.js')
      }
  })

  mainWindow.setMenu(null)
  mainWindow.maximize()

  mainWindow.loadURL(process.env.APP_URL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

   mainWindow.webContents.on('will-navigate', event => {
    event.preventDefault()
  })

 mainWindow.webContents.on('new-window',  (event, url) => {
    event.preventDefault()
     shell.openExternal(url)
  })

  mainWindow.webContents.on('context-menu', (event, params) => {
  const menu = new Menu()

  // Add each spelling suggestion
  for (const suggestion of params.dictionarySuggestions) {
    menu.append(new MenuItem({
      label: suggestion,
      click: () => mainWindow.webContents.replaceMisspelling(suggestion)
    }))
  }

  // Allow users to add the misspelled word to the dictionary
  if (params.misspelledWord) {
    menu.append(
      new MenuItem({
        label: 'Add to dictionary',
        click: () => mainWindow.webContents.session.addWordToSpellCheckerDictionary(params.misspelledWord)
      })
    )
  }
  console.log(params.dictionarySuggestions)
  console.log(params.misspelledWord)
  if((params.dictionarySuggestions && params.dictionarySuggestions.length) || params.misspelledWord){
    menu.popup()
  }
})
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

