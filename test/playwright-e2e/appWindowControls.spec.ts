const appRoot = require('app-root-path')
const { _electron: electron } = require('playwright')
const { test, expect } = require('@playwright/test')

const electronMainFilePath = appRoot + '/dist/electron/UnPackaged/electron-main.js'
const faFrontendRenderTimer = 1000

test('launch app', async () => {
  const electronApp = await electron.launch({ args: [electronMainFilePath] })
  // close app
  await electronApp.close()
})

test('click resize button - smallify', async () => {
  const electronApp = await electron.launch({ args: [electronMainFilePath] })
  const appWindow = await electronApp.firstWindow()
  await appWindow.waitForTimeout(faFrontendRenderTimer)

  const resizeButton = await appWindow.$('.globalWindowButtons__resize')
  await resizeButton.click()
  const isMaximized = await appWindow.evaluate(() => window.faWindowControlAPI.checkWindowMaximized())
  expect(isMaximized).toBe(false)

  // close app
  await electronApp.close()
})

test('click resize button - maximize', async () => {
  const electronApp = await electron.launch({ args: [electronMainFilePath] })
  const appWindow = await electronApp.firstWindow()
  await appWindow.waitForTimeout(faFrontendRenderTimer)

  const resizeButton = await appWindow.$('.globalWindowButtons__resize')
  await resizeButton.click()
  await resizeButton.click()
  const isMaximized = await appWindow.evaluate(() => window.faWindowControlAPI.checkWindowMaximized())
  expect(isMaximized).toBe(true)

  // close app
  await electronApp.close()
})

test('click minimize button', async () => {
  const electronApp = await electron.launch({ args: [electronMainFilePath] })
  const appWindow = await electronApp.firstWindow()
  await appWindow.waitForTimeout(faFrontendRenderTimer)

  const minimizeButton = await appWindow.$('.globalWindowButtons__minimize')
  await minimizeButton.click()
  const isMaximized = await appWindow.evaluate(() => window.faWindowControlAPI.checkWindowMaximized())
  expect(isMaximized).toBe(false)

  // close app
  await electronApp.close()
})

test('click close button', async () => {
  const electronApp = await electron.launch({ args: [electronMainFilePath] })
  const appWindow = await electronApp.firstWindow()
  await appWindow.waitForTimeout(faFrontendRenderTimer)

  let windowIsClosed = false
  appWindow.on('close', () => {
    windowIsClosed = true
  })

  const closeButton = await appWindow.$('.globalWindowButtons__close')
  await closeButton.click()

  expect(windowIsClosed).toBe(true)
})
