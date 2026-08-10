import type { I_faProjectDocumentTemplateForProjectSettingsItem } from 'app/types/I_dialogProjectSettingsDocumentTemplates'
import type { I_faProjectWorldForProjectSettings } from 'app/types/I_dialogProjectSettingsWorlds'
import type { I_faProjectWorldTemplatePlacementForProjectSettings } from 'app/types/I_faProjectWorldTemplateLayoutDomain'

export const QUICK_ADD_STORY_WORLD_ID_A = '550e8400-e29b-41d4-a716-4466554400a1'
export const QUICK_ADD_STORY_WORLD_ID_B = '550e8400-e29b-41d4-a716-4466554400a2'
export const QUICK_ADD_STORY_TEMPLATE_ID_HERO = '7c9e6679-7425-40de-944b-e07fc1f90ae1'
export const QUICK_ADD_STORY_TEMPLATE_ID_PLACE = '7c9e6679-7425-40de-944b-e07fc1f90ae2'
export const QUICK_ADD_STORY_PLACEMENT_ID_HERO = '7c9e6679-7425-40de-944b-e07fc1f90af1'
export const QUICK_ADD_STORY_PLACEMENT_ID_PLACE = '7c9e6679-7425-40de-944b-e07fc1f90af2'

function buildPlacement (input: {
  documentTemplateId: string
  icon: string
  id: string
  nickname: string
  rootSortOrder: number
  titlePlural: string
  titleSingular: string
  worldId: string
}): I_faProjectWorldTemplatePlacementForProjectSettings {
  return {
    categoryCountInWorld: 0,
    createdAtMs: 1,
    displayName: input.titlePlural,
    documentCountInWorld: 0,
    documentTemplateId: input.documentTemplateId,
    groupId: null,
    groupSortOrder: null,
    icon: input.icon,
    id: input.id,
    nickname: input.nickname,
    nicknamePluralTranslations: { 'en-US': input.titlePlural },
    nicknameSingularTranslations: { 'en-US': input.titleSingular },
    rootSortOrder: input.rootSortOrder,
    updatedAtMs: 1,
    worldAppendix: '',
    worldId: input.worldId
  }
}

const heroTemplate: I_faProjectDocumentTemplateForProjectSettingsItem = {
  createdAtMs: 1,
  documentCount: 0,
  icon: 'mdi-account',
  id: QUICK_ADD_STORY_TEMPLATE_ID_HERO,
  sortOrder: 0,
  titlePluralTranslations: { 'en-US': 'Heroes' },
  titleSingularTranslations: { 'en-US': 'Hero' },
  updatedAtMs: 1,
  worldAppendixTranslations: {}
}

const placeTemplate: I_faProjectDocumentTemplateForProjectSettingsItem = {
  createdAtMs: 1,
  documentCount: 0,
  icon: 'mdi-map-marker',
  id: QUICK_ADD_STORY_TEMPLATE_ID_PLACE,
  sortOrder: 1,
  titlePluralTranslations: { 'en-US': 'Places' },
  titleSingularTranslations: { 'en-US': 'Place' },
  updatedAtMs: 1,
  worldAppendixTranslations: {}
}

export const dialogQuickAddDocumentStoryTemplates: I_faProjectDocumentTemplateForProjectSettingsItem[] = [
  heroTemplate,
  placeTemplate
]

/** Single world with two template placements — world select hidden. */
export const dialogQuickAddDocumentStorySingleWorld: I_faProjectWorldForProjectSettings = {
  color: '#4caf50',
  colorPalette: '',
  createdAtMs: 1,
  displayNameTranslations: { 'en-US': 'Eldoria' },
  documentCount: 0,
  id: QUICK_ADD_STORY_WORLD_ID_A,
  sortOrder: 0,
  templateLayout: {
    groups: [],
    placements: [
      buildPlacement({
        documentTemplateId: QUICK_ADD_STORY_TEMPLATE_ID_HERO,
        icon: 'mdi-account',
        id: QUICK_ADD_STORY_PLACEMENT_ID_HERO,
        nickname: 'Heroes',
        rootSortOrder: 0,
        titlePlural: 'Heroes',
        titleSingular: 'Hero',
        worldId: QUICK_ADD_STORY_WORLD_ID_A
      }),
      buildPlacement({
        documentTemplateId: QUICK_ADD_STORY_TEMPLATE_ID_PLACE,
        icon: 'mdi-map-marker',
        id: QUICK_ADD_STORY_PLACEMENT_ID_PLACE,
        nickname: 'Places',
        rootSortOrder: 1,
        titlePlural: 'Places',
        titleSingular: 'Place',
        worldId: QUICK_ADD_STORY_WORLD_ID_A
      })
    ]
  },
  updatedAtMs: 1
}

/** Two worlds — showWorldSelect true. */
export const dialogQuickAddDocumentStoryTwoWorlds: I_faProjectWorldForProjectSettings[] = [
  {
    color: '#4caf50',
    colorPalette: '',
    createdAtMs: 1,
    displayNameTranslations: { 'en-US': 'Eldoria' },
    documentCount: 0,
    id: QUICK_ADD_STORY_WORLD_ID_A,
    sortOrder: 0,
    templateLayout: {
      groups: [],
      placements: [
        buildPlacement({
          documentTemplateId: QUICK_ADD_STORY_TEMPLATE_ID_HERO,
          icon: 'mdi-account',
          id: QUICK_ADD_STORY_PLACEMENT_ID_HERO,
          nickname: 'Heroes',
          rootSortOrder: 0,
          titlePlural: 'Heroes',
          titleSingular: 'Hero',
          worldId: QUICK_ADD_STORY_WORLD_ID_A
        })
      ]
    },
    updatedAtMs: 1
  },
  {
    color: '#2196f3',
    colorPalette: '',
    createdAtMs: 1,
    displayNameTranslations: { 'en-US': 'Aurelion' },
    documentCount: 0,
    id: QUICK_ADD_STORY_WORLD_ID_B,
    sortOrder: 1,
    templateLayout: {
      groups: [],
      placements: [
        buildPlacement({
          documentTemplateId: QUICK_ADD_STORY_TEMPLATE_ID_PLACE,
          icon: 'mdi-map-marker',
          id: QUICK_ADD_STORY_PLACEMENT_ID_PLACE,
          nickname: 'Places',
          rootSortOrder: 0,
          titlePlural: 'Places',
          titleSingular: 'Place',
          worldId: QUICK_ADD_STORY_WORLD_ID_B
        })
      ]
    },
    updatedAtMs: 1
  }
]

/**
 * Storybook parameters.contentBridgeOverrides for Quick Add worlds + templates.
 */
export function buildDialogQuickAddDocumentStoryContentBridgeOverrides (input: {
  templates: I_faProjectDocumentTemplateForProjectSettingsItem[]
  worlds: I_faProjectWorldForProjectSettings[]
}): {
    projectContent: {
      listDocumentTemplatesForProjectSettings: () => Promise<{
        items: I_faProjectDocumentTemplateForProjectSettingsItem[]
      }>
      listWorldsForProjectSettings: () => Promise<{
        items: I_faProjectWorldForProjectSettings[]
      }>
    }
  } {
  return {
    projectContent: {
      listDocumentTemplatesForProjectSettings: async () => ({
        items: input.templates
      }),
      listWorldsForProjectSettings: async () => ({
        items: input.worlds
      })
    }
  }
}
