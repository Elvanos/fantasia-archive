// TODO ADD SOME TESTS

import { _electron as electron } from 'playwright'
import { test } from '@playwright/test'
import { extraEnvVariablesAPI } from 'app/src-electron/customContentBridgeAPIs/extraEnvVariablesAPI'

/**
 * Extra env settings too trigger  testing via Playwright
 */
const extraEnvSettings = {
  TEST_ENV: 'e2e'
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
 * Test if the Electron launches to begin with.
 */
test('Should launch app', async () => {
  const electronApp = await electron.launch({
    env: extraEnvSettings,
    args: [electronMainFilePath]
  })

  await electronApp.close()
})
