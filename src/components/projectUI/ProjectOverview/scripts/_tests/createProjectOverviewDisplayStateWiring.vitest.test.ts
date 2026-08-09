import { expect, test, vi } from 'vitest'
import { computed, ref } from 'vue'

import type { I_faProjectDocumentLastOpenedItem } from 'app/types/I_faProjectDocumentLastOpenedDomain'
import type { I_faProjectHierarchyTreeWorkspaceWorld } from 'app/types/I_faProjectHierarchyTreeDomain'
import type { I_faUserSettings } from 'app/types/I_faUserSettingsDomain'

import {
  createProjectOverviewDisplayState,
  createProjectOverviewLastOpenedChromeResolver
} from '../createProjectOverviewDisplayStateWiring'

const lastOpenedItem: I_faProjectDocumentLastOpenedItem = {
  displayName: 'Hero',
  documentBackgroundColor: '#111111',
  documentId: 'doc-1',
  documentTextColor: '#eeeeee',
  isCategory: false,
  isDead: false,
  openedAtMs: 1,
  templateIcon: 'mdi-account',
  templateId: 't1',
  worldId: 'w1'
}

/**
 * createProjectOverviewDisplayState
 * Gates tip/empty/content/world indicators and resolves world colors.
 */
test('Test that createProjectOverviewDisplayState covers tip empty and world indicator branches', () => {
  const resolveHideFantasiaMascot = vi.fn(() => false)
  const resolveTabWorldIndicatorColor = vi.fn(() => '#ff0000')
  const appSettingsDialogPreview = ref<Partial<I_faUserSettings> | null>(null)
  const hasDocumentTemplates = ref(false)
  const settings = ref<I_faUserSettings | null>({
    appTheme: 'darkThemeFantasy',
    hideTooltipsProject: false
  } as I_faUserSettings)
  const totalDocumentCount = ref(0)
  const worlds = ref<I_faProjectHierarchyTreeWorkspaceWorld[] | undefined>(undefined)

  const state = createProjectOverviewDisplayState({
    appSettingsDialogPreview,
    computed,
    hasDocumentTemplates,
    resolveHideFantasiaMascot,
    resolveTabWorldIndicatorColor,
    settings,
    totalDocumentCount,
    worlds
  })

  expect(state.showTipCard.value).toBe(false)
  expect(state.showEmptyCta.value).toBe(true)
  expect(state.showContentRow.value).toBe(false)
  expect(state.emptyCtaMode.value).toBe('createTemplate')
  expect(state.showWorldIndicators.value).toBe(false)
  expect(state.showMascotInTipCard.value).toBe(true)
  expect(state.graphCardHeightPx.value).toBe(587)
  expect(state.chartHeightPx.value).toBe(445)

  hasDocumentTemplates.value = true
  expect(state.emptyCtaMode.value).toBe('assignTemplate')

  worlds.value = [
    {
      color: '#111',
      id: 'w1',
      placements: [{}]
    } as unknown as I_faProjectHierarchyTreeWorkspaceWorld
  ]
  expect(state.emptyCtaMode.value).toBe('createDocument')

  totalDocumentCount.value = 2
  worlds.value = [
    {
      color: '#111',
      id: 'w1',
      placements: []
    } as unknown as I_faProjectHierarchyTreeWorkspaceWorld,
    {
      color: '#222',
      id: 'w2',
      placements: []
    } as unknown as I_faProjectHierarchyTreeWorkspaceWorld
  ]
  expect(state.showTipCard.value).toBe(true)
  expect(state.showEmptyCta.value).toBe(false)
  expect(state.showContentRow.value).toBe(true)
  expect(state.emptyCtaMode.value).toBe('assignTemplate')
  expect(state.showWorldIndicators.value).toBe(true)
  expect(state.resolveLastOpenedWorldIndicatorColor(lastOpenedItem)).toBe('#ff0000')
  expect(resolveTabWorldIndicatorColor).toHaveBeenCalled()

  appSettingsDialogPreview.value = { hideTooltipsProject: true }
  expect(state.showTipCard.value).toBe(true)
  expect(state.graphCardHeightPx.value).toBe(587)
  expect(state.chartHeightPx.value).toBe(445)

  appSettingsDialogPreview.value = {
    appTheme: 'darkThemeFlat',
    hideTooltipsProject: true
  }
  expect(state.graphCardHeightPx.value).toBe(564)
  expect(state.chartHeightPx.value).toBe(422)

  appSettingsDialogPreview.value = null
  settings.value = {
    appTheme: 'darkThemeFantasy',
    hideTooltipsProject: true
  } as I_faUserSettings
  expect(state.showTipCard.value).toBe(false)
  expect(state.chartHeightPx.value).toBe(666)

  resolveHideFantasiaMascot.mockReturnValue(true)
  expect(state.showMascotInTipCard.value).toBe(false)

  worlds.value = undefined
  expect(state.showWorldIndicators.value).toBe(false)
  expect(state.resolveLastOpenedWorldIndicatorColor(lastOpenedItem)).toBe('#ff0000')
})

/**
 * createProjectOverviewLastOpenedChromeResolver
 * Forwards appearance colors through the document chrome helper.
 */
test('Test that createProjectOverviewLastOpenedChromeResolver maps item colors', () => {
  const resolveDocumentAppearanceChromeStyle = vi.fn(() => ({
    backgroundColor: '#111111',
    color: '#eeeeee'
  }))
  const buildFaColorGlyphCssCustomProperties = vi.fn((baseColor: string) => ({
    '--fa-color-glyph-base': baseColor,
    '--fa-color-glyph-highlight-base': '58%'
  }))
  const { resolveLastOpenedItemChromeStyle } = createProjectOverviewLastOpenedChromeResolver({
    buildFaColorGlyphCssCustomProperties,
    resolveDocumentAppearanceChromeStyle
  })

  expect(resolveLastOpenedItemChromeStyle(lastOpenedItem)).toEqual({
    '--fa-color-glyph-base': '#eeeeee',
    '--fa-color-glyph-highlight-base': '58%',
    backgroundColor: '#111111',
    color: '#eeeeee'
  })
  expect(buildFaColorGlyphCssCustomProperties).toHaveBeenCalledWith('#eeeeee')
  expect(resolveDocumentAppearanceChromeStyle).toHaveBeenCalledWith({
    documentBackgroundColor: '#111111',
    documentTextColor: '#eeeeee'
  })

  expect(resolveLastOpenedItemChromeStyle({
    ...lastOpenedItem,
    documentBackgroundColor: null,
    documentTextColor: null
  })).toEqual({
    '--fa-color-glyph-base': '#eeeeee',
    '--fa-color-glyph-highlight-base': '58%',
    backgroundColor: '#111111',
    color: '#eeeeee'
  })
  expect(resolveDocumentAppearanceChromeStyle).toHaveBeenCalledWith({
    documentBackgroundColor: '',
    documentTextColor: ''
  })
})
