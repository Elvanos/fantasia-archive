import { _electron as electron } from 'playwright'
import { test, expect } from '@playwright/test'
import { extraEnvVariablesAPI } from 'app/src-electron/customContentBridgeAPIs/extraEnvVariablesAPI'

/**
 * Extra env settings to trigger component testing via Playwright
 */
const extraEnvSettings = {
  TEST_ENV: 'components',
  COMPONENT_NAME: 'FantasiaMascotImage',
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
  image: 'fantasiaMascotImage-image'
}

/**
 * Attempt to pass "width" prop to the component and check the result
 */
test('Visually check "width" prop', async () => {
  const testString = '300px'

  extraEnvSettings.COMPONENT_PROPS = JSON.stringify({ width: testString })

  const electronApp = await electron.launch({
    env: extraEnvSettings,
    args: [electronMainFilePath]
  })

  const appWindow = await electronApp.firstWindow()
  await appWindow.waitForTimeout(faFrontendRenderTimer)

  const imageElement = await appWindow.$(`[data-test="${selectorList.image}"]`)

  // Check if the tested element exists
  if (imageElement !== null) {
    const imageBoxData = await imageElement.boundingBox()

    // Test if the tested element isn't invisisble for some reason
    if (imageBoxData !== null) {
      const roundedFirstValue = Math.round(imageBoxData.width)
      const roundedSecondValue = Math.round(parseInt(testString))

      expect(roundedFirstValue).toBe(roundedSecondValue)
    } else {
      // Element is invisible
      test.fail()
    }
  } else {
    // Element doesn't exist
    test.fail()
  }

  await electronApp.close()
})

/**
 * Attempt to pass "height" prop to the component and check the result
 */
test('Visually check "height" prop', async () => {
  const testString = '300px'

  extraEnvSettings.COMPONENT_PROPS = JSON.stringify({ height: testString })

  const electronApp = await electron.launch({
    env: extraEnvSettings,
    args: [electronMainFilePath]
  })

  const appWindow = await electronApp.firstWindow()
  await appWindow.waitForTimeout(faFrontendRenderTimer)

  const imageElement = await appWindow.$(`[data-test="${selectorList.image}"]`)

  // Check if the tested element exists
  if (imageElement !== null) {
    const imageBoxData = await imageElement.boundingBox()

    // Test if the tested element isn't invisisble for some reason
    if (imageBoxData !== null) {
      const roundedFirstValue = Math.round(imageBoxData.height)
      const roundedSecondValue = Math.round(parseInt(testString))

      expect(roundedFirstValue).toBe(roundedSecondValue)
    } else {
      // Element is invisible
      test.fail()
    }
  } else {
    // Element doesn't exist
    test.fail()
  }

  await electronApp.close()
})
