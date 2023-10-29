import { _electron as electron } from 'playwright'
import { test, expect } from '@playwright/test'
import { extraEnvVariablesAPI } from 'app/src-electron/customContentBridgeAPIs/extraEnvVariablesAPI'
import { testData } from '../_testData/test.fixed.component'

/**
 * Extra env settings to trigger component testing via Playwright
 */
const extraEnvSettings = {
  TEST_ENV: 'components',
  COMPONENT_NAME: 'AppControlSingleMenu',
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
const faFrontendRenderTimer = extraEnvVariablesAPI.FA_FRONTEND_RENDER_TIMER

/**
 * Object of string data selectors for the component
 */
const selectorList = {
  menuWrapper: 'AppControlSingleMenu-wrapper',
  menuTitle: 'AppControlSingleMenu-title',
  menuItem: 'AppControlSingleMenu-menuItem',
  menuItemText: 'AppControlSingleMenu-menuItem-text',
  menuItemIcon: 'AppControlSingleMenu-menuItem-icon',
  menuItemSubMenu: 'AppControlSingleMenu-menuItem-subMenu',
  menuItemSubMenuItem: 'AppControlSingleMenu-menuItem-subMenu-item',
  menuItemSubMenuItemText: 'AppControlSingleMenu-menuItem-subMenu-item-text',
  menuItemSubMenuItemIcon: 'AppControlSingleMenu-menuItem-subMenu-item-icon'
}

/**
 * Test if the component managed to load the test data
 */
test('Test if the component managed to load the test data', async () => {
  const electronApp = await electron.launch({
    env: extraEnvSettings,
    args: [electronMainFilePath]
  })

  const appWindow = await electronApp.firstWindow()
  await appWindow.waitForTimeout(faFrontendRenderTimer)

  const menuWrapperElement = await appWindow.$(`[data-test="${selectorList.menuWrapper}"]`)

  // Check if the tested element exists
  if (menuWrapperElement !== null) {
    const hasProperInput = await menuWrapperElement.evaluate(el => !!el.dataset.testHasProperDataInput)

    await expect(hasProperInput).toBe(true)
    await electronApp.close()
  } else {
    // Element doesn't exist
    test.fail()
  }
})

/**
 * Load a custom "Test Title" menu button in the menu and check if it loaded
 */
test('Check if the "Menu title" element is properly loaded and has proper content in it', async () => {
  const electronApp = await electron.launch({
    env: extraEnvSettings,
    args: [electronMainFilePath]
  })

  const appWindow = await electronApp.firstWindow()
  await appWindow.waitForTimeout(faFrontendRenderTimer)

  const menuTitleElement = await appWindow.$(`[data-test="${selectorList.menuTitle}"]`)
  const menuTitleElementText = (menuTitleElement !== null) ? await menuTitleElement.textContent() : ''

  // Check if the tested element exists and has proper title content
  if (menuTitleElement !== null && menuTitleElementText === testData.title) {
    await expect(true).toBe(true)
    await electronApp.close()
  } else {
    // Element doesn't exist OR lacks proper title in it
    test.fail()
  }
})

/**
 * Check if the menu opens properly on click and all parts are loaded properly
 */
test('Check if the menu has a wrapper, click if all menu elements loaded properly', async () => {
  const electronApp = await electron.launch({
    env: extraEnvSettings,
    args: [electronMainFilePath]
  })

  const appWindow = await electronApp.firstWindow()
  await appWindow.waitForTimeout(faFrontendRenderTimer)

  const menuWrapper = await appWindow.$(`[data-test="${selectorList.menuWrapper}"]`)

  // Check if wrapper exists for clicking and if so, click it
  if (menuWrapper !== null) {
    await menuWrapper.click()

    const menuItems = await appWindow.$$(`[data-test="${selectorList.menuItem}"]`)
    const dataItems = testData.data.filter(item => item.mode === 'item')

    // Check if element feed matched the data feed
    await expect(menuItems.length === dataItems.length).toBe(true)
    await electronApp.close()
  } else {
    // Wrapper for opening the menu doesn't exist
    test.fail()
  }
})

// TODO add checking text color class!

/**
 * Check if the first menu item has proper text and icon
 */
test('Check if the first menu item has proper text and icon', async () => {
  const electronApp = await electron.launch({
    env: extraEnvSettings,
    args: [electronMainFilePath]
  })

  const appWindow = await electronApp.firstWindow()
  await appWindow.waitForTimeout(faFrontendRenderTimer)

  const menuWrapper = await appWindow.$(`[data-test="${selectorList.menuWrapper}"]`)

  // Check if wrapper exists for clicking and if so, click it
  if (menuWrapper !== null) {
    await menuWrapper.click()

    const firstMenuItem = await appWindow.$(`[data-test="${selectorList.menuItem}"]`)
    const firstDataItem = testData.data.filter(item => item.mode === 'item')[0]

    // Check if the item wrapper exists
    if (firstMenuItem !== null) {
      const firstMenuItemTextElement = await firstMenuItem.$(`[data-test="${selectorList.menuItemText}"]`)
      const firstMenuItemIconElement = await firstMenuItem.$(`[data-test="${selectorList.menuItemIcon}"]`)

      // Check if the icon and text wrappers exist
      if (firstMenuItemTextElement !== null && firstMenuItemIconElement !== null) {
        const firstMenuItemText = await firstMenuItemTextElement.textContent()
        const firstDataItemText = firstDataItem.text

        const firstMenuItemIconClassObject = await firstMenuItemIconElement.evaluate(el => el.classList)
        const firstMenuItemIconClassList = Object.values(firstMenuItemIconClassObject).concat()
        const firstDataItemIcon = firstDataItem.icon as string

        await expect(firstMenuItemText === firstDataItemText && firstMenuItemIconClassList.includes(firstDataItemIcon)).toBe(true)
        await electronApp.close()
      } else {
        // Item text or icon wrappers don't exist
        test.fail()
      }
    } else {
      // Item wrapper doesn't exist
      test.fail()
    }
  } else {
    // Wrapper for opening the menu doesn't exist
    test.fail()
  }
})
