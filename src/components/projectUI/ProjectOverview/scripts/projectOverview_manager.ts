import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { i18n } from 'app/i18n/externalFileLoader'
import { resolveHideFantasiaMascot } from 'app/src/scripts/appGlobalManagementUI/functions/resolveHideFantasiaMascot'
import { runFaAction } from 'app/src/scripts/actionManager/faActionManagerRun_manager'
import { resolveFaDocumentAppearanceChromeStyle } from 'app/src/scripts/documentAppearance/documentAppearance_manager'
import { buildFaColorGlyphCssCustomProperties } from 'app/src/scripts/faColorContrast/faColorContrast_manager'
import { resolveProjectAppControlBarTabWorldIndicatorColor } from 'app/src/components/projectUI/ProjectAppControlBar/functions/projectAppControlBarTabWorldIndicator'
import { FA_DIALOG_PROJECT_SETTINGS_DOCUMENT_TEMPLATES_TAB, FA_DIALOG_PROJECT_SETTINGS_WORLDS_TAB } from 'app/src/components/dialogs/DialogProjectSettings/scripts/functions/dialogProjectSettingsDialogInput'
import { S_FaActiveProject } from 'app/src/stores/S_FaActiveProject'
import { S_FaProjectHierarchyTree } from 'app/src/stores/S_FaProjectHierarchyTree'
import { S_FaUserSettings } from 'app/src/stores/S_FaUserSettings'

import { resolveProjectOverviewLastOpenedIconName } from '../functions/resolveProjectOverviewLastOpenedIcon'
import { createUseProjectOverview } from './createUseProjectOverview'
import { listProjectOverviewDocumentDistribution } from './projectOverviewListDistributionWiring'
import { listProjectOverviewDocumentLastOpened } from './projectOverviewListLastOpenedWiring'
import { pickProjectOverviewRandomTipCaption } from './projectOverviewPickRandomTipWiring'

export { resolveProjectOverviewLastOpenedIconName }

export const useProjectOverview = createUseProjectOverview({
  FA_DIALOG_PROJECT_SETTINGS_DOCUMENT_TEMPLATES_TAB,
  FA_DIALOG_PROJECT_SETTINGS_WORLDS_TAB,
  S_FaActiveProject,
  S_FaProjectHierarchyTree,
  S_FaUserSettings,
  buildFaColorGlyphCssCustomProperties,
  computed,
  listDocumentDistribution: listProjectOverviewDocumentDistribution,
  listDocumentLastOpened: listProjectOverviewDocumentLastOpened,
  onMounted,
  onUnmounted,
  pickRandomTipCaption: pickProjectOverviewRandomTipCaption,
  ref,
  resolveDocumentAppearanceChromeStyle: resolveFaDocumentAppearanceChromeStyle,
  resolveHideFantasiaMascot,
  resolveTabWorldIndicatorColor: resolveProjectAppControlBarTabWorldIndicatorColor,
  runFaAction,
  storeToRefs,
  t: (key) => i18n.global.t(key),
  watch
})
