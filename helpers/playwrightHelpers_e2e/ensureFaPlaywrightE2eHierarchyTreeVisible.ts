import type { Page } from 'playwright'
import { expect } from '@playwright/test'

import { FA_PLAYWRIGHT_PRESS_DEFAULT_TOGGLE_HIERARCHICAL_TREE } from 'app/helpers/playwrightHelpers_universal/faPlaywrightKeyboardChords'

/**
 * Empty-layout create may auto-hide the hierarchy drawer (hideHierarchyTree).
 * Unhide via Pinia silent patch when possible; fall back to the toggle keybind.
 */
export async function ensureFaPlaywrightE2eHierarchyTreeVisible (page: Page): Promise<void> {
  const hierarchyHost = page.locator('[data-test-locator="projectHierarchyTree-host"]')
  if (await hierarchyHost.count() > 0 && await hierarchyHost.isVisible()) {
    return
  }

  const patched = await page.evaluate(async () => {
    const root = document.querySelector('#q-app') as HTMLElement & {
      __vue_app__?: {
        config: {
          globalProperties: {
            $pinia?: {
              _s?: Map<string, {
                patchSettingsSilently?: (patch: { hideHierarchyTree: boolean }) => Promise<void>
                settings?: { hideHierarchyTree?: boolean } | null
              }>
            }
          }
        }
      }
    }
    const store = root?.__vue_app__?.config.globalProperties.$pinia?._s?.get('S_FaUserSettings')
    if (typeof store?.patchSettingsSilently !== 'function') {
      return false
    }
    if (store.settings?.hideHierarchyTree === true) {
      await store.patchSettingsSilently({ hideHierarchyTree: false })
    }
    return true
  })

  if (!patched) {
    await page.locator('[data-test-locator="projectAppControlBar"]').click()
    await page.keyboard.press(FA_PLAYWRIGHT_PRESS_DEFAULT_TOGGLE_HIERARCHICAL_TREE)
  }

  await expect(hierarchyHost).toBeVisible({ timeout: 15_000 })
}
