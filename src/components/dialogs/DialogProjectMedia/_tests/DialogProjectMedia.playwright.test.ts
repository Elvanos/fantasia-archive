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
  addChoiceDivider: 'dialogProjectMedia-addChoiceDivider',
  addDropZone: 'dialogProjectMedia-addDropZone',
  addDropZoneHintDrag: 'dialogProjectMedia-addDropZoneHintDrag',
  addDropZoneHintOr: 'dialogProjectMedia-addDropZoneHintOr',
  addOfflineMediaButton: 'dialogProjectMedia-addOfflineMediaButton',
  addOnlineMediaButton: 'dialogProjectMedia-addOnlineMediaButton',
  addOnlineUrls: 'dialogProjectMedia-addOnlineUrls',
  addOnlineUrlsInput: 'dialogProjectMedia-addOnlineUrlsInput',
  addOnlineUrlsSubmit: 'dialogProjectMedia-addOnlineUrlsSubmit',
  addOnlineUrlsTitle: 'dialogProjectMedia-addOnlineUrlsTitle',
  closeButton: 'dialogProjectMedia-button-close',
  massEditSave: 'dialogProjectMedia-massEditSave',
  massEditTable: 'dialogProjectMedia-massEditTable',
  panelTitleList: 'dialogProjectMedia-panelTitle-mediaList',
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
   * Feed ProjectMedia input and check title, mass-edit panel, hidden search, and close chrome.
   */
  test('Open test "ProjectMedia" dialog with title, mass-edit table, and close', async () => {
    const title = appWindow.locator(`[data-test-locator="${selectorList.title}"]`)
    const massEditTable = appWindow.locator(`[data-test-locator="${selectorList.massEditTable}"]`)
    const massEditSave = appWindow.locator(`[data-test-locator="${selectorList.massEditSave}"]`)
    const search = appWindow.locator(`[data-test-locator="${selectorList.search}"]`)
    const closeButton = appWindow.locator(`[data-test-locator="${selectorList.closeButton}"]`)

    await expect(title).toHaveCount(1)
    await expect(title).toHaveText(projectMediaMessages.title)
    await expect(massEditTable).toBeVisible()
    await expect(massEditSave).toBeVisible()
    await expect(massEditSave).toHaveText(projectMediaMessages.massEditSaveButton)
    await expect(search).toBeHidden()
    await expect(closeButton).toHaveCount(1)
    await expect(closeButton).toHaveText(projectMediaMessages.closeButton)
  })

  /**
   * Sticky dialog: Escape must not close Project Media.
   */
  test('Open test "ProjectMedia" dialog and Escape does not close', async () => {
    const title = appWindow.locator(`[data-test-locator="${selectorList.title}"]`)
    await expect(title).toBeVisible()
    await appWindow.keyboard.press('Escape')
    await expect(title).toBeVisible()
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

test.describe.serial('Project Media dialog add panel', () => {
  let electronApp: ElectronApplication
  let appWindow: Page
  let suiteTestInfo: TestInfo

  test.beforeAll(async ({}, testInfo) => {
    suiteTestInfo = testInfo
    extraEnvSettings.COMPONENT_PROPS = JSON.stringify({
      directInput: projectMediaDirectInput,
      initialPanel: 'mediaAdd'
    })
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

  test('Open test "ProjectMedia" dialog on Media Addition panel', async () => {
    const dropZone = appWindow.locator(`[data-test-locator="${selectorList.addDropZone}"]`)
    const addOffline = appWindow.locator(
      `[data-test-locator="${selectorList.addOfflineMediaButton}"]`
    )
    const addOnline = appWindow.locator(`[data-test-locator="${selectorList.addOnlineMediaButton}"]`)
    const divider = appWindow.locator(`[data-test-locator="${selectorList.addChoiceDivider}"]`)
    const hintOr = appWindow.locator(`[data-test-locator="${selectorList.addDropZoneHintOr}"]`)
    const hintDrag = appWindow.locator(`[data-test-locator="${selectorList.addDropZoneHintDrag}"]`)
    const search = appWindow.locator(`[data-test-locator="${selectorList.search}"]`)

    await expect(dropZone).toBeVisible()
    await expect(addOffline).toBeVisible()
    await expect(addOffline).toHaveText(projectMediaMessages.addOfflineMediaButton)
    await expect(addOnline).toBeVisible()
    await expect(addOnline).toHaveText(projectMediaMessages.addOnlineMediaButton)
    await expect(divider).toBeVisible()
    await expect(hintOr).toBeVisible()
    await expect(hintOr).toHaveText(projectMediaMessages.addMediaDropZoneOr)
    await expect(hintDrag).toBeVisible()
    await expect(hintDrag).toHaveText(projectMediaMessages.addMediaDropZoneDrag)
    await expect(search).toBeHidden()
  })

  test('Open test "ProjectMedia" dialog Add online media URL textarea', async () => {
    const addOnline = appWindow.locator(`[data-test-locator="${selectorList.addOnlineMediaButton}"]`)
    const dropZone = appWindow.locator(`[data-test-locator="${selectorList.addDropZone}"]`)
    const urlsPane = appWindow.locator(`[data-test-locator="${selectorList.addOnlineUrls}"]`)
    const urlsTitle = appWindow.locator(`[data-test-locator="${selectorList.addOnlineUrlsTitle}"]`)
    const urlsInput = appWindow.locator(`[data-test-locator="${selectorList.addOnlineUrlsInput}"]`)
    const urlsSubmit = appWindow.locator(`[data-test-locator="${selectorList.addOnlineUrlsSubmit}"]`)

    await expect(dropZone).toBeVisible()
    await addOnline.click()
    await expect(dropZone).toBeHidden()
    await expect(urlsPane).toBeVisible()
    await expect(urlsTitle).toBeVisible()
    await expect(urlsTitle).toHaveText(projectMediaMessages.addOnlineUrlsTitle)
    await expect(urlsInput).toBeVisible()
    await expect(urlsInput.locator('textarea')).toBeVisible()
    await expect(urlsSubmit).toBeVisible()
    await expect(urlsSubmit).toHaveText(projectMediaMessages.addOnlineUrlsSubmitButton)
  })
})
