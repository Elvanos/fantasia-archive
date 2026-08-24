import type { ElectronApplication, Page } from 'playwright'
import { expect, test } from '@playwright/test'
import type { TestInfo } from '@playwright/test'
import { launchFaPlaywrightComponentHarnessWindow } from 'app/helpers/playwrightHelpers_component/faPlaywrightComponentHarnessLifecycle'
import { FA_FRONTEND_RENDER_TIMER } from 'app/helpers/playwrightHelpers_universal/faPlaywrightElectronLaunchConstants'
import { tearDownFaPlaywrightElectronSerialSuite } from 'app/helpers/playwrightHelpers_universal/faPlaywrightSerialSuiteLifecycleTeardown'
import projectMediaMessages from 'app/i18n/en-US/dialogs/L_projectMedia'
import type { T_dialogName } from 'app/types/T_appDialogsAndDocuments'

/**
 * Extra env settings to trigger component testing via Playwright
 */
const extraEnvSettings = {
  TEST_ENV: 'components',
  COMPONENT_NAME: 'DialogProjectMedia',
  COMPONENT_PROPS: JSON.stringify({})
}

/**
 * Buffer before assertions so the component-testing shell finishes rendering.
 * - Tune this constant only when this spec needs a different wait.
 */
const faFrontendRenderTimer = FA_FRONTEND_RENDER_TIMER

/**
 * Object of string data selectors for the component
 */
const selectorList = {
  closeButton: 'dialogProjectMedia-button-close',
  search: 'dialogProjectMedia-search',
  title: 'dialogProjectMedia-title'
} as const

const projectMediaDirectInput: T_dialogName = 'ProjectMedia'

test.describe.serial('Project Media dialog', () => {
  let electronApp: ElectronApplication
  let appWindow: Page
  let suiteTestInfo: TestInfo

  test.beforeAll(async ({}, testInfo) => {
    suiteTestInfo = testInfo
    extraEnvSettings.COMPONENT_PROPS = JSON.stringify({ directInput: projectMediaDirectInput })
    const launched = await launchFaPlaywrightComponentHarnessWindow({
      buildLaunchEnv (): Record<string, string> {
        return {
          COMPONENT_NAME: extraEnvSettings.COMPONENT_NAME,
          COMPONENT_PROPS: extraEnvSettings.COMPONENT_PROPS,
          TEST_ENV: extraEnvSettings.TEST_ENV
        }
      },
      renderDelayMs: faFrontendRenderTimer,
      testInfo
    })
    electronApp = launched.electronApp
    appWindow = launched.appWindow
  })

  test.afterAll(async ({}, afterAllTestInfo) => {
    await tearDownFaPlaywrightElectronSerialSuite({
      afterAllTestInfo,
      electronApp,
      suiteTestInfo
    })
  })

  /**
   * Feed ProjectMedia input and check title, search, and close chrome.
   */
  test('Open test "ProjectMedia" dialog with title, search, and close', async () => {
    const title = appWindow.locator(`[data-test-locator="${selectorList.title}"]`)
    const search = appWindow.locator(`[data-test-locator="${selectorList.search}"]`)
    const closeButton = appWindow.locator(`[data-test-locator="${selectorList.closeButton}"]`)

    await expect(title).toHaveCount(1)
    await expect(title).toHaveText(projectMediaMessages.title)
    await expect(search).toHaveCount(1)
    await expect(closeButton).toHaveCount(1)
    await expect(closeButton).toHaveText(projectMediaMessages.closeButton)
  })

  /**
   * Feed ProjectMedia input and check if dialog closes after button click.
   */
  test('Open test "ProjectMedia" dialog and try closing it', async () => {
    const title = appWindow.locator(`[data-test-locator="${selectorList.title}"]`)
    const closeButton = appWindow.locator(`[data-test-locator="${selectorList.closeButton}"]`)

    await expect(title).toHaveCount(1)
    await expect(closeButton).toHaveCount(1)
    await closeButton.click()

    await appWindow.waitForTimeout(1500)

    expect(await title.isHidden()).toBe(true)
  })
})
