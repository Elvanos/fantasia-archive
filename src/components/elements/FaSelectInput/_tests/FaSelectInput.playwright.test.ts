import type { ElectronApplication, Page } from 'playwright'
import { expect, test } from '@playwright/test'
import type { TestInfo } from '@playwright/test'
import { launchFaPlaywrightComponentHarnessWindow } from 'app/helpers/playwrightHelpers_component/faPlaywrightComponentHarnessLifecycle'
import { FA_FRONTEND_RENDER_TIMER } from 'app/helpers/playwrightHelpers_universal/faPlaywrightElectronLaunchConstants'
import { tearDownFaPlaywrightElectronSerialSuite } from 'app/helpers/playwrightHelpers_universal/faPlaywrightSerialSuiteLifecycleTeardown'

/**
 * Tall list covers separator + virtual-scroll fill; short cases still pass with extra options.
 */
const tallOptions = Array.from({ length: 40 }, (_, index) => {
  return `Option ${String(index + 1).padStart(2, '0')}`
})

/**
 * Extra env settings to trigger component testing via Playwright.
 */
const extraEnvSettings = {
  COMPONENT_NAME: 'FaSelectInput',
  COMPONENT_PROPS: JSON.stringify({
    dark: true,
    dense: true,
    filled: true,
    label: 'FaSelectInput PW',
    mode: 'simple',
    modelValue: tallOptions[0],
    options: tallOptions,
    popupContentClass: 'faSelectInput__menu',
    selectionPresentation: 'inline',
    testLocator: 'faSelectInput-pw'
  }),
  TEST_ENV: 'components' as const
}

/**
 * Buffer before assertions so the component-testing shell finishes rendering.
 * - Tune this constant only when this spec needs a different wait.
 */
const faFrontendRenderTimer: number = FA_FRONTEND_RENDER_TIMER

const selectorList = {
  option0: 'faSelectInput-pw-option-0',
  option1: 'faSelectInput-pw-option-1',
  option29: 'faSelectInput-pw-option-29',
  select: 'faSelectInput-pw',
  separatorAlt1: 'faSelectInput-pw-separatorAlt-1'
} as const

test.describe.serial('FaSelectInput', () => {
  let electronApp: ElectronApplication
  let appWindow: Page
  let suiteTestInfo: TestInfo

  test.beforeAll(async ({}, testInfo) => {
    suiteTestInfo = testInfo
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
   * Tab keyup into the field opens the popup; click reopen stays open (no flash-close).
   */
  test('Check that Tab into FaSelectInput opens the menu and click reopen stays open', async () => {
    const select = appWindow.locator(`[data-test-locator="${selectorList.select}"]`)
    const option0 = appWindow.locator(`[data-test-locator="${selectorList.option0}"]`)
    await expect(select).toBeVisible()

    await appWindow.evaluate(() => {
      const pageRoot = document.querySelector('.q-page')
      if (!(pageRoot instanceof HTMLElement)) {
        throw new Error('q-page missing in component harness')
      }
      const existing = document.getElementById('faSelectInput-pw-tab-probe')
      if (existing instanceof HTMLButtonElement) {
        return
      }
      const probe = document.createElement('button')
      probe.id = 'faSelectInput-pw-tab-probe'
      probe.type = 'button'
      probe.textContent = 'Tab probe'
      pageRoot.prepend(probe)
    })

    await appWindow.locator('#faSelectInput-pw-tab-probe').focus()
    await appWindow.keyboard.press('Tab')
    await expect(option0).toBeVisible({ timeout: 15_000 })

    await appWindow.keyboard.press('Escape')
    await expect(option0).toBeHidden({ timeout: 15_000 })

    await select.click()
    await expect(option0).toBeVisible({ timeout: 15_000 })
    await appWindow.waitForTimeout(350)
    await expect(option0).toBeVisible()
    await appWindow.keyboard.press('Escape')
  })

  /**
   * Index ≥ 1 options expose separatorAlt via data-test-locator-separator-alt.
   */
  test('Check that option index 1 exposes separatorAlt attribute', async () => {
    const select = appWindow.locator(`[data-test-locator="${selectorList.select}"]`)
    await select.click()
    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.option1}"]`)
    ).toBeVisible({ timeout: 15_000 })
    await expect(
      appWindow.locator(`[data-test-locator-separator-alt="${selectorList.separatorAlt1}"]`)
    ).toHaveCount(1)
    await appWindow.keyboard.press('Escape')
  })

  /**
   * Tall option lists fill the menu on first paint (no large empty virtual-scroll gap).
   */
  test('Check that a tall options list fills the menu without empty bottom gap', async () => {
    const select = appWindow.locator(`[data-test-locator="${selectorList.select}"]`)
    await select.click()
    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.option0}"]`)
    ).toBeVisible({ timeout: 15_000 })
    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.option29}"]`)
    ).toBeVisible({ timeout: 15_000 })

    const paddingBottom = await appWindow.evaluate(() => {
      const padding = document.querySelector('.q-virtual-scroll__padding')
      if (!(padding instanceof HTMLElement)) {
        return 0
      }
      return padding.getBoundingClientRect().height
    })
    expect(paddingBottom).toBeLessThan(240)

    await appWindow.keyboard.press('Escape')
  })

  /**
   * Clicking the already-selected option closes the popup without a stuck empty menu.
   */
  test('Check that clicking the selected option closes the popup cleanly', async () => {
    const select = appWindow.locator(`[data-test-locator="${selectorList.select}"]`)
    const option0 = appWindow.locator(`[data-test-locator="${selectorList.option0}"]`)
    await select.click()
    await expect(option0).toBeVisible({ timeout: 15_000 })
    await option0.click()
    await expect(option0).toBeHidden({ timeout: 15_000 })
    await expect(select).toBeVisible()
  })
})
