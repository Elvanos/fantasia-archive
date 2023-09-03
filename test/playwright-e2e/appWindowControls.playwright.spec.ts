import appRoot from 'app-root-path'
import { _electron as electron } from 'playwright'
import { test, expect } from '@playwright/test'

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

  if (resizeButton !== null) {
    await resizeButton.click()
    const isMaximized = await appWindow.evaluate(() => window.faWindowControlAPI.checkWindowMaximized())
    expect(isMaximized).toBe(false)
  } else {
    test.fail()
  }

  // close app
  await electronApp.close()
})

test('click resize button - maximize', async () => {
  const electronApp = await electron.launch({ args: [electronMainFilePath] })
  const appWindow = await electronApp.firstWindow()
  await appWindow.waitForTimeout(faFrontendRenderTimer)

  const resizeButton = await appWindow.$('.globalWindowButtons__resize')

  if (resizeButton !== null) {
    await resizeButton.click()
    await resizeButton.click()
    const isMaximized = await appWindow.evaluate(() => window.faWindowControlAPI.checkWindowMaximized())
    expect(isMaximized).toBe(true)
  } else {
    test.fail()
  }

  // close app
  await electronApp.close()
})

test('click minimize button', async () => {
  const electronApp = await electron.launch({ args: [electronMainFilePath] })
  const appWindow = await electronApp.firstWindow()
  await appWindow.waitForTimeout(faFrontendRenderTimer)

  const minimizeButton = await appWindow.$('.globalWindowButtons__minimize')

  if (minimizeButton !== null) {
    await minimizeButton.click()
    const isMaximized = await appWindow.evaluate(() => window.faWindowControlAPI.checkWindowMaximized())
    expect(isMaximized).toBe(false)
  } else {
    test.fail()
  }

  // close app
  await electronApp.close()
})

/* This test can VERY occasionally fail when the window takes too long to close on weaker PCs. Simply rerunning the tests generally fixes this. */
test('click close button', async () => {
  const electronApp = await electron.launch({ args: [electronMainFilePath] })
  const appWindow = await electronApp.firstWindow()
  await appWindow.waitForTimeout(faFrontendRenderTimer)

  const closeButton = await appWindow.$('.globalWindowButtons__close')

  if (closeButton !== null) {
    let windowIsClosed = false
    appWindow.on('close', () => {
      windowIsClosed = true
    })
    await closeButton.click()
    expect(windowIsClosed).toBe(true)
  } else {
    test.fail()
  }
})
