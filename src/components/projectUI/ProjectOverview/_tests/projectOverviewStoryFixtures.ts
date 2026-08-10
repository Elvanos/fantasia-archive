import type {
  I_faProjectDocumentDistributionResult,
  I_faProjectDocumentLastOpenedItem
} from 'app/types/I_faProjectDocumentLastOpenedDomain'
import type { I_faProjectHierarchyTreeWorkspaceWorld } from 'app/types/I_faProjectHierarchyTreeDomain'

export const PROJECT_OVERVIEW_STORY_WORLD_ID_A = '550e8400-e29b-41d4-a716-446655440001'
export const PROJECT_OVERVIEW_STORY_WORLD_ID_B = '550e8400-e29b-41d4-a716-446655440002'
export const PROJECT_OVERVIEW_STORY_TEMPLATE_ID_HERO = '7c9e6679-7425-40de-944b-e07fc1f90ae8'
export const PROJECT_OVERVIEW_STORY_TEMPLATE_ID_PLACE = '7c9e6679-7425-40de-944b-e07fc1f90ae9'
export const PROJECT_OVERVIEW_STORY_PLACEMENT_ID_HERO = '7c9e6679-7425-40de-944b-e07fc1f90af0'
export const PROJECT_OVERVIEW_STORY_PLACEMENT_ID_PLACE = '7c9e6679-7425-40de-944b-e07fc1f90af1'
export const PROJECT_OVERVIEW_STORY_LAST_OPENED_DEAD_CATEGORY_ID = '7c9e6679-7425-40de-944b-e07fc1f90afa'
export const PROJECT_OVERVIEW_STORY_LAST_OPENED_CATEGORY_ID = '7c9e6679-7425-40de-944b-e07fc1f90afb'
export const PROJECT_OVERVIEW_STORY_LAST_OPENED_PLAIN_ID = '7c9e6679-7425-40de-944b-e07fc1f90afc'
export const PROJECT_OVERVIEW_STORY_LAST_OPENED_OTHER_WORLD_ID = '7c9e6679-7425-40de-944b-e07fc1f90afd'

const heroPlacement = {
  categoryCount: 0,
  displayName: 'Character',
  documentCount: 0,
  documentTemplateId: PROJECT_OVERVIEW_STORY_TEMPLATE_ID_HERO,
  groupId: null,
  groupSortOrder: null,
  hasChildren: false,
  icon: 'mdi-account',
  id: PROJECT_OVERVIEW_STORY_PLACEMENT_ID_HERO,
  nickname: 'Heroes',
  rootSortOrder: 0,
  titlePluralTranslations: { 'en-US': 'Characters' },
  titleSingularTranslations: { 'en-US': 'Character' },
  worldId: PROJECT_OVERVIEW_STORY_WORLD_ID_A
} as const

const placePlacement = {
  categoryCount: 0,
  displayName: 'Place',
  documentCount: 0,
  documentTemplateId: PROJECT_OVERVIEW_STORY_TEMPLATE_ID_PLACE,
  groupId: null,
  groupSortOrder: null,
  hasChildren: false,
  icon: 'mdi-map-marker',
  id: PROJECT_OVERVIEW_STORY_PLACEMENT_ID_PLACE,
  nickname: 'Places',
  rootSortOrder: 0,
  titlePluralTranslations: { 'en-US': 'Places' },
  titleSingularTranslations: { 'en-US': 'Place' },
  worldId: PROJECT_OVERVIEW_STORY_WORLD_ID_B
} as const

/** Empty world — no template placements (assignTemplate empty CTA). */
export const projectOverviewStoryWorldNoPlacements: I_faProjectHierarchyTreeWorkspaceWorld = {
  color: '#4caf50',
  colorPalette: '',
  displayName: 'Eldoria',
  groups: [],
  id: PROJECT_OVERVIEW_STORY_WORLD_ID_A,
  placements: [],
  sortOrder: 0
}

/** Single world with one placement (createDocument empty CTA). */
export const projectOverviewStoryWorldWithPlacement: I_faProjectHierarchyTreeWorkspaceWorld = {
  ...projectOverviewStoryWorldNoPlacements,
  placements: [{ ...heroPlacement }]
}

/** Two worlds with placements — world indicators on last-opened rows. */
export const projectOverviewStoryTwoWorldsWithPlacements: I_faProjectHierarchyTreeWorkspaceWorld[] = [
  {
    color: '#4caf50',
    colorPalette: '',
    displayName: 'Eldoria',
    groups: [],
    id: PROJECT_OVERVIEW_STORY_WORLD_ID_A,
    placements: [{ ...heroPlacement }],
    sortOrder: 0
  },
  {
    color: '#2196f3',
    colorPalette: '',
    displayName: 'Aurelion',
    groups: [],
    id: PROJECT_OVERVIEW_STORY_WORLD_ID_B,
    placements: [{
      ...placePlacement,
      worldId: PROJECT_OVERVIEW_STORY_WORLD_ID_B
    }],
    sortOrder: 1
  }
]

/** Zero docs + zero templates → createTemplate empty CTA. */
export const projectOverviewStoryEmptyDistribution: I_faProjectDocumentDistributionResult = {
  counts: [],
  documentTemplateTotalCount: 0,
  templates: [],
  totalDocumentCount: 0,
  worlds: []
}

/** Zero docs + templates exist → assignTemplate / createDocument (placements from hierarchy). */
export const projectOverviewStoryTemplatesOnlyDistribution: I_faProjectDocumentDistributionResult = {
  counts: [],
  documentTemplateTotalCount: 1,
  templates: [{
    icon: 'mdi-account',
    sortOrder: 0,
    templateId: PROJECT_OVERVIEW_STORY_TEMPLATE_ID_HERO,
    titlePluralTranslationsJson: '{"en-US":"Characters"}'
  }],
  totalDocumentCount: 0,
  worlds: []
}

/**
 * Stacked chart with two template categories across two worlds + legend series.
 */
export const projectOverviewStoryStackedDistribution: I_faProjectDocumentDistributionResult = {
  counts: [
    {
      documentCount: 3,
      templateId: PROJECT_OVERVIEW_STORY_TEMPLATE_ID_HERO,
      worldId: PROJECT_OVERVIEW_STORY_WORLD_ID_A
    },
    {
      documentCount: 1,
      templateId: PROJECT_OVERVIEW_STORY_TEMPLATE_ID_HERO,
      worldId: PROJECT_OVERVIEW_STORY_WORLD_ID_B
    },
    {
      documentCount: 2,
      templateId: PROJECT_OVERVIEW_STORY_TEMPLATE_ID_PLACE,
      worldId: PROJECT_OVERVIEW_STORY_WORLD_ID_B
    }
  ],
  documentTemplateTotalCount: 2,
  templates: [
    {
      icon: 'mdi-account',
      sortOrder: 0,
      templateId: PROJECT_OVERVIEW_STORY_TEMPLATE_ID_HERO,
      titlePluralTranslationsJson: '{"en-US":"Characters"}'
    },
    {
      icon: 'mdi-map-marker',
      sortOrder: 1,
      templateId: PROJECT_OVERVIEW_STORY_TEMPLATE_ID_PLACE,
      titlePluralTranslationsJson: '{"en-US":"Places"}'
    }
  ],
  totalDocumentCount: 6,
  worlds: [
    {
      color: '#4caf50',
      displayNameTranslationsJson: '{"en-US":"Eldoria"}',
      sortOrder: 0,
      worldId: PROJECT_OVERVIEW_STORY_WORLD_ID_A
    },
    {
      color: '#2196f3',
      displayNameTranslationsJson: '{"en-US":"Aurelion"}',
      sortOrder: 1,
      worldId: PROJECT_OVERVIEW_STORY_WORLD_ID_B
    }
  ]
}

/**
 * Last-opened rows: dead category, live category, plain doc, second-world indicator.
 */
export const projectOverviewStoryLastOpenedItems: I_faProjectDocumentLastOpenedItem[] = [
  {
    displayName: 'Dead Category Hero',
    documentBackgroundColor: null,
    documentId: PROJECT_OVERVIEW_STORY_LAST_OPENED_DEAD_CATEGORY_ID,
    documentTextColor: null,
    isCategory: true,
    isDead: true,
    openedAtMs: 4,
    templateIcon: 'mdi-account',
    templateId: PROJECT_OVERVIEW_STORY_TEMPLATE_ID_HERO,
    worldId: PROJECT_OVERVIEW_STORY_WORLD_ID_A
  },
  {
    displayName: 'Category Circle',
    documentBackgroundColor: null,
    documentId: PROJECT_OVERVIEW_STORY_LAST_OPENED_CATEGORY_ID,
    documentTextColor: null,
    isCategory: true,
    isDead: false,
    openedAtMs: 3,
    templateIcon: 'mdi-account',
    templateId: PROJECT_OVERVIEW_STORY_TEMPLATE_ID_HERO,
    worldId: PROJECT_OVERVIEW_STORY_WORLD_ID_A
  },
  {
    displayName: 'Plain Hero',
    documentBackgroundColor: null,
    documentId: PROJECT_OVERVIEW_STORY_LAST_OPENED_PLAIN_ID,
    documentTextColor: null,
    isCategory: false,
    isDead: false,
    openedAtMs: 2,
    templateIcon: 'mdi-account',
    templateId: PROJECT_OVERVIEW_STORY_TEMPLATE_ID_HERO,
    worldId: PROJECT_OVERVIEW_STORY_WORLD_ID_A
  },
  {
    displayName: 'Harbor Gate',
    documentBackgroundColor: null,
    documentId: PROJECT_OVERVIEW_STORY_LAST_OPENED_OTHER_WORLD_ID,
    documentTextColor: null,
    isCategory: false,
    isDead: false,
    openedAtMs: 1,
    templateIcon: 'mdi-map-marker',
    templateId: PROJECT_OVERVIEW_STORY_TEMPLATE_ID_PLACE,
    worldId: PROJECT_OVERVIEW_STORY_WORLD_ID_B
  }
]
