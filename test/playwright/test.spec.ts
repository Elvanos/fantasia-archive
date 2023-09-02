const appRoot = require('app-root-path')
const { _electron: electron } = require('playwright')
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const { test } = require('@playwright/test')

test('launch app', async () => {
  const electronApp = await electron.launch({ args: [appRoot + '/dist/electron/UnPackaged/electron-main.js'] })
  // close app
  await electronApp.close()
})

test('test resize', async () => {
  const electronApp = await electron.launch({ args: [appRoot + '/dist/electron/UnPackaged/electron-main.js'] })
  const appWindow = await electronApp.firstWindow()
  await appWindow.waitForTimeout(3000)

  const resizeButton = await appWindow.$('.globalWindowButtons__resize')
  await resizeButton.click()

  await appWindow.waitForTimeout(2000)
  // close app
  await electronApp.close()
})

/* test('save screenshot', async () => {
  const electronApp = await electron.launch({ args: [appRoot + '/.quasar/electron/electron-main.js'] })
  const window = await electronApp.firstWindow()
  await window.waitForTimeout(15000)
  await window.screenshot({ path: 'intro.png' })
  // close app
  await electronApp.close()
}) */
