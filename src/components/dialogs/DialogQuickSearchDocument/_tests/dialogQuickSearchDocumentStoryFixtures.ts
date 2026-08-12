import type { I_faProjectDocumentTemplateForProjectSettingsItem } from 'app/types/I_dialogProjectSettingsDocumentTemplates'
import type { I_faProjectWorldForProjectSettings } from 'app/types/I_dialogProjectSettingsWorlds'
import type { I_faProjectDocument } from 'app/types/I_faProjectDocumentDomain'

export const QUICK_SEARCH_STORY_WORLD_ID_A = '550e8400-e29b-41d4-a716-4466554400b1'
export const QUICK_SEARCH_STORY_WORLD_ID_B = '550e8400-e29b-41d4-a716-4466554400b2'
export const QUICK_SEARCH_STORY_TEMPLATE_ID_HERO = '7c9e6679-7425-40de-944b-e07fc1f90be1'
export const QUICK_SEARCH_STORY_DOC_ID_ARIA = '7c9e6679-7425-40de-944b-e07fc1f90bf1'
export const QUICK_SEARCH_STORY_DOC_ID_CATEGORY = '7c9e6679-7425-40de-944b-e07fc1f90bf2'
export const QUICK_SEARCH_STORY_DOC_ID_BORIS = '7c9e6679-7425-40de-944b-e07fc1f90bf3'

const heroTemplate: I_faProjectDocumentTemplateForProjectSettingsItem = {
  createdAtMs: 1,
  documentCount: 0,
  icon: 'mdi-account',
  id: QUICK_SEARCH_STORY_TEMPLATE_ID_HERO,
  sortOrder: 0,
  titlePluralTranslations: { 'en-US': 'Heroes' },
  titleSingularTranslations: { 'en-US': 'Hero' },
  updatedAtMs: 1,
  worldAppendixTranslations: {}
}

export const dialogQuickSearchDocumentStoryTemplates: I_faProjectDocumentTemplateForProjectSettingsItem[] = [
  heroTemplate
]

function makeDocument (input: {
  displayName: string
  id: string
  isCategory?: boolean
  worldId: string
}): I_faProjectDocument {
  return {
    createdAtMs: 1,
    displayName: input.displayName,
    documentBackgroundColor: null,
    documentTextColor: null,
    extraClasses: '',
    id: input.id,
    isCategory: input.isCategory === true,
    isDead: false,
    isFinished: false,
    isMinor: false,
    parentDocumentId: null,
    placementId: null,
    sortOrder: 0,
    templateId: input.isCategory === true ? null : QUICK_SEARCH_STORY_TEMPLATE_ID_HERO,
    treeOrderNumber: 0,
    updatedAtMs: 1,
    worldId: input.worldId
  }
}

export const dialogQuickSearchDocumentStoryDocuments: I_faProjectDocument[] = [
  makeDocument({
    displayName: 'Aria',
    id: QUICK_SEARCH_STORY_DOC_ID_ARIA,
    worldId: QUICK_SEARCH_STORY_WORLD_ID_A
  }),
  makeDocument({
    displayName: 'Heroes',
    id: QUICK_SEARCH_STORY_DOC_ID_CATEGORY,
    isCategory: true,
    worldId: QUICK_SEARCH_STORY_WORLD_ID_A
  }),
  makeDocument({
    displayName: 'Boris',
    id: QUICK_SEARCH_STORY_DOC_ID_BORIS,
    worldId: QUICK_SEARCH_STORY_WORLD_ID_B
  })
]

/** Single world — world select hidden. */
export const dialogQuickSearchDocumentStorySingleWorld: I_faProjectWorldForProjectSettings = {
  color: '#4caf50',
  colorPalette: '',
  createdAtMs: 1,
  displayNameTranslations: { 'en-US': 'Eldoria' },
  documentCount: 2,
  id: QUICK_SEARCH_STORY_WORLD_ID_A,
  sortOrder: 0,
  templateLayout: {
    groups: [],
    placements: []
  },
  updatedAtMs: 1
}

/** Two worlds — showWorldSelect true. */
export const dialogQuickSearchDocumentStoryTwoWorlds: I_faProjectWorldForProjectSettings[] = [
  dialogQuickSearchDocumentStorySingleWorld,
  {
    color: '#2196f3',
    colorPalette: '',
    createdAtMs: 1,
    displayNameTranslations: { 'en-US': 'Aurelion' },
    documentCount: 1,
    id: QUICK_SEARCH_STORY_WORLD_ID_B,
    sortOrder: 1,
    templateLayout: {
      groups: [],
      placements: []
    },
    updatedAtMs: 1
  }
]

/**
 * Storybook parameters.contentBridgeOverrides for Quick Search worlds + documents.
 */
export function buildDialogQuickSearchDocumentStoryContentBridgeOverrides (input: {
  documents: I_faProjectDocument[]
  templates: I_faProjectDocumentTemplateForProjectSettingsItem[]
  worlds: I_faProjectWorldForProjectSettings[]
}): {
    projectContent: {
      listDocumentTemplatesForProjectSettings: () => Promise<{
        items: I_faProjectDocumentTemplateForProjectSettingsItem[]
      }>
      listDocuments: (filter?: { worldId?: string | undefined }) => Promise<{
        items: I_faProjectDocument[]
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
      listDocuments: async (filter) => {
        const worldId = filter?.worldId
        if (worldId === undefined) {
          return { items: input.documents }
        }
        return {
          items: input.documents.filter((document) => document.worldId === worldId)
        }
      },
      listWorldsForProjectSettings: async () => ({
        items: input.worlds
      })
    }
  }
}
