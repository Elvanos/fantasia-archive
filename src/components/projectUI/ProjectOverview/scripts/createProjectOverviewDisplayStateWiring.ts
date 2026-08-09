import type { CSSProperties } from 'vue'

import type { I_faProjectDocumentLastOpenedItem } from 'app/types/I_faProjectDocumentLastOpenedDomain'
import type { I_faDocumentAppearanceChromeStyle } from 'app/types/I_faDocumentAppearanceChromeStyle'
import type { I_faColorGlyphCssCustomProperties } from 'app/types/I_faColorContrast'
import type { I_faProjectHierarchyTreeWorkspaceWorld } from 'app/types/I_faProjectHierarchyTreeDomain'
import type { T_faProjectOverviewEmptyCtaMode } from 'app/types/I_faProjectOverview'
import type { I_faUserSettings } from 'app/types/I_faUserSettingsDomain'
import type { I_computedRef, I_ref } from 'app/types/I_vueCompositionShims'
import type { T_faAppThemeSkin } from 'app/types/faUserSettingsAppThemeRegistry'
import {
  FA_USER_SETTINGS_APP_THEME_DEFAULT,
  isFaUserSettingsAppTheme
} from 'app/types/faUserSettingsAppThemeRegistry'
import { resolveFaAppThemeSkin } from 'app/src/scripts/appInternals/functions/faAppThemeDom'
import { hasAnyFaProjectWorldTemplatePlacement } from 'app/src/scripts/projectWorlds/functions/faProjectWorldTemplatePlacementHideHierarchyTree'

import { resolveProjectOverviewGraphCardHeightPx } from '../functions/resolveProjectOverviewGraphCardWidth'
import { resolveProjectOverviewChartHeightPx } from '../functions/buildProjectOverviewApexChartOptions'
import { resolveProjectOverviewEmptyCtaMode } from '../functions/resolveProjectOverviewEmptyCtaMode'

/**
 * Tip card, empty CTA, and world-indicator display computeds for Project overview.
 */
export function createProjectOverviewDisplayState (input: {
  appSettingsDialogPreview: I_ref<Partial<I_faUserSettings> | null | undefined>
  computed: <T>(getter: () => T) => I_computedRef<T>
  hasDocumentTemplates: I_ref<boolean>
  resolveHideFantasiaMascot: (
    settings: I_faUserSettings | null,
    preview: Partial<I_faUserSettings> | null
  ) => boolean
  resolveTabWorldIndicatorColor: (input: {
    projectWorldCount: number
    tab: { worldId: string }
    worlds: readonly Pick<I_faProjectHierarchyTreeWorkspaceWorld, 'color' | 'id'>[]
  }) => string | null
  settings: I_ref<I_faUserSettings | null | undefined>
  totalDocumentCount: I_ref<number>
  worlds: I_ref<I_faProjectHierarchyTreeWorkspaceWorld[] | undefined>
}): {
    chartHeightPx: I_computedRef<number>
    emptyCtaMode: I_computedRef<T_faProjectOverviewEmptyCtaMode>
    graphCardHeightPx: I_computedRef<number>
    resolveLastOpenedWorldIndicatorColor: (
      item: I_faProjectDocumentLastOpenedItem
    ) => string | null
    showContentRow: I_computedRef<boolean>
    showEmptyCta: I_computedRef<boolean>
    showMascotInTipCard: I_computedRef<boolean>
    showTipCard: I_computedRef<boolean>
    showWorldIndicators: I_computedRef<boolean>
  } {
  const hideTooltipsProject = input.computed(() => {
    return input.settings.value?.hideTooltipsProject === true
  })

  const themeSkin = input.computed(() => {
    return resolveEffectiveProjectOverviewThemeSkin(
      input.appSettingsDialogPreview.value,
      input.settings.value
    )
  })

  const showTipCard = input.computed(() => {
    if (input.totalDocumentCount.value <= 0) {
      return false
    }
    return !hideTooltipsProject.value
  })

  const graphCardHeightPx = input.computed(() => {
    return resolveProjectOverviewGraphCardHeightPx({
      hideTooltipsProject: hideTooltipsProject.value,
      themeSkin: themeSkin.value
    })
  })

  const chartHeightPx = input.computed(() => {
    return resolveProjectOverviewChartHeightPx({
      hideTooltipsProject: hideTooltipsProject.value,
      themeSkin: themeSkin.value
    })
  })

  const showMascotInTipCard = input.computed(() => {
    return !input.resolveHideFantasiaMascot(
      input.settings.value as I_faUserSettings | null,
      input.appSettingsDialogPreview.value as Partial<I_faUserSettings> | null
    )
  })

  const showContentRow = input.computed(() => input.totalDocumentCount.value > 0)
  const showEmptyCta = input.computed(() => input.totalDocumentCount.value === 0)
  const emptyCtaMode = input.computed(() => {
    return resolveProjectOverviewEmptyCtaMode({
      hasDocumentTemplates: input.hasDocumentTemplates.value,
      hasWorldTemplatePlacements: hasAnyFaProjectWorldTemplatePlacement(
        input.worlds.value ?? []
      )
    })
  })
  const showWorldIndicators = input.computed(() => (input.worlds.value?.length ?? 0) > 1)

  function resolveLastOpenedWorldIndicatorColor (
    item: I_faProjectDocumentLastOpenedItem
  ): string | null {
    return input.resolveTabWorldIndicatorColor({
      projectWorldCount: input.worlds.value?.length ?? 0,
      tab: { worldId: item.worldId },
      worlds: input.worlds.value ?? []
    })
  }

  return {
    chartHeightPx,
    emptyCtaMode,
    graphCardHeightPx,
    resolveLastOpenedWorldIndicatorColor,
    showContentRow,
    showEmptyCta,
    showMascotInTipCard,
    showTipCard,
    showWorldIndicators
  }
}

function resolveEffectiveProjectOverviewThemeSkin (
  preview: Partial<I_faUserSettings> | null | undefined,
  settings: I_faUserSettings | null | undefined
): T_faAppThemeSkin {
  const previewTheme = preview?.appTheme
  if (typeof previewTheme === 'string' && isFaUserSettingsAppTheme(previewTheme)) {
    return resolveFaAppThemeSkin(previewTheme)
  }
  const persistedTheme = settings?.appTheme
  if (typeof persistedTheme === 'string' && isFaUserSettingsAppTheme(persistedTheme)) {
    return resolveFaAppThemeSkin(persistedTheme)
  }
  return resolveFaAppThemeSkin(FA_USER_SETTINGS_APP_THEME_DEFAULT)
}

/**
 * Maps last-opened row appearance through document chrome helper.
 * Merges fantasy glyph CSS vars when a custom text color is present (same as tabs/tree).
 */
export function createProjectOverviewLastOpenedChromeResolver (input: {
  buildFaColorGlyphCssCustomProperties: (
    baseColor: string
  ) => I_faColorGlyphCssCustomProperties
  resolveDocumentAppearanceChromeStyle: (chromeInput: {
    documentBackgroundColor: string
    documentTextColor: string
  }) => I_faDocumentAppearanceChromeStyle | undefined
}): {
    resolveLastOpenedItemChromeStyle: (
      item: I_faProjectDocumentLastOpenedItem
    ) => CSSProperties | undefined
  } {
  function resolveLastOpenedItemChromeStyle (
    item: I_faProjectDocumentLastOpenedItem
  ): CSSProperties | undefined {
    const chrome = input.resolveDocumentAppearanceChromeStyle({
      documentBackgroundColor: item.documentBackgroundColor ?? '',
      documentTextColor: item.documentTextColor ?? ''
    })
    if (chrome === undefined) {
      return undefined
    }

    const style: CSSProperties = { ...chrome }
    const textColor = chrome.color
    if (typeof textColor === 'string' && textColor.length > 0) {
      Object.assign(style, input.buildFaColorGlyphCssCustomProperties(textColor))
    }
    return style
  }

  return { resolveLastOpenedItemChromeStyle }
}
