import type { ElectronApplication, Page } from 'playwright'
import { expect, test } from '@playwright/test'
import type { TestInfo } from '@playwright/test'
import {
  e2eExpectFaActiveProjectStoreName
} from 'app/helpers/playwrightHelpers_e2e/e2eExpectFaActiveProjectStore'
import { launchFaPlaywrightE2eAppWindow } from 'app/helpers/playwrightHelpers_e2e/faPlaywrightE2eAppLifecycle'
import {
  expectFaPlaywrightE2eHashRoute
} from 'app/helpers/playwrightHelpers_e2e/faPlaywrightE2eAppShellAssertions'
import {
  navigateFaPlaywrightE2eToSplashRoute
} from 'app/helpers/playwrightHelpers_e2e/faPlaywrightE2eNavigateHome'
import {
  e2eSeedHierarchyPlacementWithDocuments
} from 'app/helpers/playwrightHelpers_e2e/e2eWorkspaceHierarchyTreeHelpers'
import {
  e2eSetNextProjectCreatePath,
  tryUnlinkE2eFaprojectFixture
} from 'app/helpers/playwrightHelpers_e2e/playwrightE2eProjectPaths'
import { FA_FRONTEND_RENDER_TIMER } from 'app/helpers/playwrightHelpers_universal/faPlaywrightElectronLaunchConstants'
import {
  FA_PLAYWRIGHT_PRESS_DEFAULT_TOGGLE_HIERARCHICAL_TREE
} from 'app/helpers/playwrightHelpers_universal/faPlaywrightKeyboardChords'
import { tearDownFaPlaywrightElectronSerialSuite } from 'app/helpers/playwrightHelpers_universal/faPlaywrightSerialSuiteLifecycleTeardown'

/**
 * Extra env settings to trigger E2E via Playwright (isolated userData).
 */
const extraEnvSettings = {
  TEST_ENV: 'e2e' as const
}

/**
 * Object of string data selectors for the e2e
 */
const selectorList = {
  createBtn: 'dialogNewProject-button-create',
  hierarchyTreeHost: 'projectHierarchyTree-host',
  nameInput: 'dialogNewProject-input-name',
  projectAppControlBar: 'projectAppControlBar',
  projectAppControlBarFixedStrip: '.projectAppControlBar--fixedStrip',
  splashNew: 'splashPage-btn-new'
} as const

const HIDE_EMPTY_LAYOUT_E2E_FAPROJECT = 'e2e-hide-hierarchy-empty-layout.faproject'
const HIDE_EMPTY_LAYOUT_E2E_PROJECT_NAME = 'E2E hide hierarchy empty layout'
const AUTO_HIDE_SETTLE_MS = 750

async function prepareRendererForGlobalShortcuts (page: Page): Promise<void> {
  await page.bringToFront()
  await page.evaluate(() => {
    const root = document.querySelector('#q-app')
    if (root instanceof HTMLElement) {
      root.tabIndex = -1
      root.focus()
    }
  })
}

async function triggerGlobalShortcut (page: Page, playwrightShortcut: string): Promise<void> {
  await prepareRendererForGlobalShortcuts(page)
  await page.keyboard.press(playwrightShortcut)
}

async function createE2eProjectOnHome (
  page: Page,
  electronApplication: ElectronApplication
): Promise<void> {
  await navigateFaPlaywrightE2eToSplashRoute(page)
  await e2eSetNextProjectCreatePath(electronApplication, HIDE_EMPTY_LAYOUT_E2E_FAPROJECT)
  await page.locator(`[data-test-locator="${selectorList.splashNew}"]`).click()
  await expect(page.locator(`[data-test-locator="${selectorList.nameInput}"]`)).toBeVisible()
  await page.locator(`[data-test-locator="${selectorList.nameInput}"]`).fill(
    HIDE_EMPTY_LAYOUT_E2E_PROJECT_NAME
  )
  await page.locator(`[data-test-locator="${selectorList.createBtn}"]`).click()
  await e2eExpectFaActiveProjectStoreName(page, HIDE_EMPTY_LAYOUT_E2E_PROJECT_NAME)
  await expectFaPlaywrightE2eHashRoute(page, '/home')
  await expect(
    page.locator(`[data-test-locator="${selectorList.projectAppControlBar}"]`)
  ).toBeVisible({ timeout: 15_000 })
}

async function readHideHierarchyTreeSetting (page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const root = document.querySelector('#q-app') as HTMLElement & {
      __vue_app__?: {
        config: {
          globalProperties: {
            $pinia?: {
              _s?: Map<string, {
                settings?: { hideHierarchyTree?: boolean } | null
              }>
            }
          }
        }
      }
    }
    const store = root?.__vue_app__?.config.globalProperties.$pinia?._s?.get('S_FaUserSettings')
    return store?.settings?.hideHierarchyTree === true
  })
}

test.describe.serial('Hide hierarchy tree on empty layout E2E', () => {
  let electronApp: ElectronApplication
  let appWindow: Page
  let suiteTestInfo: TestInfo

  test.describe.configure({
    timeout: 180_000
  })

  test.beforeAll(async ({}, testInfo) => {
    suiteTestInfo = testInfo
    const launched = await launchFaPlaywrightE2eAppWindow({
      afterIsolationResetBeforeLaunch (): void {
        tryUnlinkE2eFaprojectFixture(HIDE_EMPTY_LAYOUT_E2E_FAPROJECT)
      },
      buildLaunchEnv (): Record<string, string> {
        return {
          TEST_ENV: extraEnvSettings.TEST_ENV
        }
      },
      dismissStartupTips: true,
      renderDelayMs: FA_FRONTEND_RENDER_TIMER,
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
   * New projects start with an empty world template layout; create/open sync auto-hides the hierarchy tree.
   */
  test('Empty layout auto-hides hierarchy tree after project create', async () => {
    await createE2eProjectOnHome(appWindow, electronApp)
    await appWindow.waitForTimeout(AUTO_HIDE_SETTLE_MS)

    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.hierarchyTreeHost}"]`)
    ).toHaveCount(0, { timeout: 15_000 })
    await expect(
      appWindow.locator(selectorList.projectAppControlBarFixedStrip)
    ).toHaveClass(/projectAppControlBar--fixedStrip--treeHidden/)
    await expect.poll(async () => {
      return await readHideHierarchyTreeSetting(appWindow)
    }, { timeout: 15_000 }).toBe(true)
  })

  /**
   * Seeding placements must not auto-show the tree; hideHierarchyTree stays true until the user toggles.
   */
  test('Seeding placements does not auto-show hierarchy tree', async () => {
    const seeded = await e2eSeedHierarchyPlacementWithDocuments(appWindow, {
      documents: [{ displayName: 'E2E Empty Layout Doc' }],
      templateDisplayName: 'E2E Empty Layout Template',
      templateSingularTitle: 'Character'
    })
    expect(seeded.placementId.length).toBeGreaterThan(0)
    await appWindow.waitForTimeout(AUTO_HIDE_SETTLE_MS)

    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.hierarchyTreeHost}"]`)
    ).toHaveCount(0, { timeout: 15_000 })
    await expect(
      appWindow.locator(selectorList.projectAppControlBarFixedStrip)
    ).toHaveClass(/projectAppControlBar--fixedStrip--treeHidden/)
    await expect.poll(async () => {
      return await readHideHierarchyTreeSetting(appWindow)
    }, { timeout: 15_000 }).toBe(true)
  })

  /**
   * Manual toggle still reveals the tree after content returns (proves layout exists while stay-hidden holds).
   */
  test('Manual toggle shows hierarchy tree after content returns', async () => {
    await appWindow.locator(`[data-test-locator="${selectorList.projectAppControlBar}"]`).click()
    await triggerGlobalShortcut(appWindow, FA_PLAYWRIGHT_PRESS_DEFAULT_TOGGLE_HIERARCHICAL_TREE)

    await expect(
      appWindow.locator(`[data-test-locator="${selectorList.hierarchyTreeHost}"]`)
    ).toBeVisible({ timeout: 15_000 })
    await expect(
      appWindow.locator(selectorList.projectAppControlBarFixedStrip)
    ).not.toHaveClass(/projectAppControlBar--fixedStrip--treeHidden/)
    await expect.poll(async () => {
      return await readHideHierarchyTreeSetting(appWindow)
    }, { timeout: 15_000 }).toBe(false)
  })
})
