import { _electron as electron } from 'playwright'
import { test, expect } from '@playwright/test'
import { extraEnvVariablesAPI } from 'app/src-electron/customContentBridgeAPIs/extraEnvVariablesAPI'

/**
 * Extra env settings to trigger component testing via Playwright
 */
const extraEnvSettings = {
  TEST_ENV: 'components',
  COMPONENT_NAME: 'GlobalWindowButtons',
  COMPONENT_PROPS: JSON.stringify({})
}

/**
 * Electron main filepath
 */
const electronMainFilePath:string = extraEnvVariablesAPI.ELECTRON_MAIN_FILEPATH

/**
 * Extra rended timer buffer for tests to start after loading the app
 * - Change here in order manually adjust this component's wait times
 */
const faFrontendRenderTimer:number = extraEnvVariablesAPI.FA_FRONTEND_RENDER_TIMER

/**
 * Object of string data selectors for the component
 */
const selectorList = {
  buttonMinimize: 'globalWindowButtons-button-minimize',
  buttonResize: 'globalWindowButtons-button-resize',
  buttonClose: 'globalWindowButtons-button-close'
}

/**
 * Attempt to click the resize button
 */
test('Click resize button - "smallify"', async () => {
  const electronApp = await electron.launch({
    env: extraEnvSettings,
    args: [electronMainFilePath]
  })

  const appWindow = await electronApp.firstWindow()
  await appWindow.waitForTimeout(faFrontendRenderTimer)

  const resizeButton = await appWindow.$(`[data-test="${selectorList.buttonResize}"]`)

  // Check if the tested element exists
  if (resizeButton !== null) {
    await resizeButton.click()

    const isMaximized = await appWindow.evaluate(() => window.faWindowControlAPI.checkWindowMaximized())

    expect(isMaximized).toBe(false)
  } else {
    // Element doesn't exist
    test.fail()
  }

  await electronApp.close()
})

/**
 * Attempt to click the resize button, twice
 */
test('Click resize button - "maximize"', async () => {
  const electronApp = await electron.launch({
    env: extraEnvSettings,
    args: [electronMainFilePath]
  })

  const appWindow = await electronApp.firstWindow()
  await appWindow.waitForTimeout(faFrontendRenderTimer)

  const resizeButton = await appWindow.$(`[data-test="${selectorList.buttonResize}"]`)

  // Check if the tested element exists
  if (resizeButton !== null) {
    let isMaximized = await appWindow.evaluate(() => window.faWindowControlAPI.checkWindowMaximized())

    // Check if the window if maximized of not, react accordingly
    if (isMaximized) {
      // Click twice
      await resizeButton.click()
      await resizeButton.click()
    } else {
      await resizeButton.click()
    }

    isMaximized = await appWindow.evaluate(() => window.faWindowControlAPI.checkWindowMaximized())

    expect(isMaximized).toBe(true)
  } else {
    // Element doesn't exist
    test.fail()
  }

  await electronApp.close()
})

/**
 * Attempt to click the minimize button
 */
test('Click minimize button', async () => {
  const electronApp = await electron.launch({
    env: extraEnvSettings,
    args: [electronMainFilePath]
  })

  const appWindow = await electronApp.firstWindow()
  await appWindow.waitForTimeout(faFrontendRenderTimer)

  const minimizeButton = await appWindow.$(`[data-test="${selectorList.buttonMinimize}"]`)

  // Check if the tested element exists
  if (minimizeButton !== null) {
    await minimizeButton.click()

    const isMaximized = await appWindow.evaluate(() => window.faWindowControlAPI.checkWindowMaximized())

    expect(isMaximized).toBe(false)
  } else {
    // Element doesn't exist
    test.fail()
  }

  await electronApp.close()
})

/**
 * Attempt to click the close button
 * - This test can VERY occasionally fail when the window takes too long to close on weaker PCs. Simply rerunning the tests generally fixes this.
 */
test('Click close button', async () => {
  const electronApp = await electron.launch({
    env: extraEnvSettings,
    args: [electronMainFilePath]
  })

  const appWindow = await electronApp.firstWindow()
  await appWindow.waitForTimeout(faFrontendRenderTimer)

  const closeButton = await appWindow.$(`[data-test="${selectorList.buttonClose}"]`)

  // Check if the tested element exists
  if (closeButton !== null) {
    let windowIsClosed = false

    // Listen to window close event
    appWindow.on('close', () => {
      windowIsClosed = true
    })

    await closeButton.click()

    expect(windowIsClosed).toBe(true)
  } else {
    // Element doesn't exist
    test.fail()
  }
})
