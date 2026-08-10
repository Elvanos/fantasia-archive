import type { Decorator } from '@storybook/vue3-vite'

import { FA_USER_SETTINGS_DEFAULTS } from 'app/src-electron/mainScripts/userSettings/faUserSettingsDefaults'
import { S_FaActiveProject } from 'app/src/stores/S_FaActiveProject'
import { S_FaUserSettings } from 'app/src/stores/S_FaUserSettings'

const STORYBOOK_WORKSPACE_HOME_ACTIVE_PROJECT = {
  filePath: 'C:\\Storybook\\Aurelion Citadel.faproject',
  id: 'storybook-aurelion-citadel',
  name: 'Aurelion Citadel'
} as const

/**
 * Seeds Pinia for /home previews: active project session and project-overview tip visibility.
 * Uses setActiveProject — activeProject is readonly(); $patch does not apply.
 */
export function seedStorybookWorkspaceHomePreviewStores (hideTooltipsProject: boolean): void {
  S_FaActiveProject().setActiveProject({
    filePath: STORYBOOK_WORKSPACE_HOME_ACTIVE_PROJECT.filePath,
    id: STORYBOOK_WORKSPACE_HOME_ACTIVE_PROJECT.id,
    name: STORYBOOK_WORKSPACE_HOME_ACTIVE_PROJECT.name
  })
  S_FaUserSettings().$patch({
    settings: {
      ...FA_USER_SETTINGS_DEFAULTS,
      hidePlushes: false,
      hideTooltipsProject
    }
  })
}

/**
 * Seeds Pinia for /home previews: active project session and visible project-overview tips.
 */
export const withStorybookWorkspaceHomePreview: Decorator = (story) => {
  seedStorybookWorkspaceHomePreviewStores(false)
  return story()
}

/**
 * Same active project as workspace home, with Hide tips on project overview enabled.
 */
export const withStorybookWorkspaceHomePreviewTipsHidden: Decorator = (story) => {
  seedStorybookWorkspaceHomePreviewStores(true)
  return story()
}
