import { beforeEach, expect, test, vi } from 'vitest'

vi.mock('src/stores/S_FaUserSettings', () => ({
  S_FaUserSettings: () => ({
    settings: {
      languageCode: 'en-US'
    }
  })
}))

import {
  loadDialogQuickAddDocumentSources,
  resolveDialogQuickAddDocumentPreferredLanguageCode
} from '../dialogQuickAddDocumentDataWiring'

beforeEach(() => {
  vi.restoreAllMocks()
  delete window.__faComponentTestingQuickAddDocumentSources
})

/**
 * loadDialogQuickAddDocumentSources
 * Returns empty lists when project content bridge APIs are missing.
 */
test('Test that loadDialogQuickAddDocumentSources returns empty without bridge APIs', async () => {
  window.faContentBridgeAPIs = undefined as unknown as typeof window.faContentBridgeAPIs
  await expect(loadDialogQuickAddDocumentSources()).resolves.toEqual({
    templates: [],
    worlds: []
  })
})

/**
 * loadDialogQuickAddDocumentSources
 * Maps worlds and templates from project settings list IPC results.
 */
test('Test that loadDialogQuickAddDocumentSources maps bridge list results', async () => {
  window.faContentBridgeAPIs = {
    projectContent: {
      listDocumentTemplatesForProjectSettings: vi.fn(async () => ({
        items: [{
          icon: 'mdi-account',
          id: 'tpl-1',
          titlePluralTranslations: { 'en-US': 'Heroes' },
          titleSingularTranslations: { 'en-US': 'Hero' }
        }]
      })),
      listWorldsForProjectSettings: vi.fn(async () => ({
        items: [{
          color: '#ff5722',
          displayNameTranslations: { 'en-US': 'Main' },
          id: 'world-1',
          sortOrder: 0,
          templateLayout: {
            groups: [{
              id: 'group-1',
              rootSortOrder: 0
            }],
            placements: [{
              documentTemplateId: 'tpl-1',
              groupId: null,
              groupSortOrder: null,
              rootSortOrder: 0
            }]
          }
        }]
      }))
    }
  } as unknown as typeof window.faContentBridgeAPIs

  await expect(loadDialogQuickAddDocumentSources()).resolves.toEqual({
    templates: [{
      icon: 'mdi-account',
      id: 'tpl-1',
      titlePluralTranslations: { 'en-US': 'Heroes' },
      titleSingularTranslations: { 'en-US': 'Hero' }
    }],
    worlds: [{
      color: '#ff5722',
      displayNameTranslations: { 'en-US': 'Main' },
      id: 'world-1',
      sortOrder: 0,
      templateLayout: {
        groups: [{
          id: 'group-1',
          rootSortOrder: 0
        }],
        placements: [{
          documentTemplateId: 'tpl-1',
          groupId: null,
          groupSortOrder: null,
          rootSortOrder: 0
        }]
      }
    }]
  })
})

/**
 * loadDialogQuickAddDocumentSources
 * Empty template icons become the shared file-outline placeholder.
 */
test('Test that loadDialogQuickAddDocumentSources falls back empty template icons', async () => {
  window.faContentBridgeAPIs = {
    projectContent: {
      listDocumentTemplatesForProjectSettings: vi.fn(async () => ({
        items: [{
          icon: '  ',
          id: 'tpl-empty',
          titlePluralTranslations: { 'en-US': 'Blank' },
          titleSingularTranslations: { 'en-US': 'Blank' }
        }]
      })),
      listWorldsForProjectSettings: vi.fn(async () => ({ items: [] }))
    }
  } as unknown as typeof window.faContentBridgeAPIs

  await expect(loadDialogQuickAddDocumentSources()).resolves.toEqual({
    templates: [{
      icon: 'mdi-file-outline',
      id: 'tpl-empty',
      titlePluralTranslations: { 'en-US': 'Blank' },
      titleSingularTranslations: { 'en-US': 'Blank' }
    }],
    worlds: []
  })
})

/**
 * loadDialogQuickAddDocumentSources
 * Component Playwright probe bypasses frozen contextBridge list methods.
 */
test('Test that loadDialogQuickAddDocumentSources prefers component testing probe', async () => {
  window.__faComponentTestingQuickAddDocumentSources = {
    templates: [{
      icon: 'mdi-account',
      id: 'tpl-probe',
      titlePluralTranslations: { 'en-US': 'Heroes' },
      titleSingularTranslations: { 'en-US': 'Hero' }
    }],
    worlds: [{
      color: '#4caf50',
      displayNameTranslations: { 'en-US': 'Probe World' },
      id: 'world-probe',
      sortOrder: 0,
      templateLayout: {
        groups: [{
          id: 'group-probe',
          rootSortOrder: 0
        }],
        placements: [{
          documentTemplateId: 'tpl-probe',
          groupId: 'group-probe',
          groupSortOrder: 0,
          rootSortOrder: null
        }]
      }
    }]
  }
  window.faContentBridgeAPIs = {
    projectContent: {
      listDocumentTemplatesForProjectSettings: vi.fn(async () => ({ items: [] })),
      listWorldsForProjectSettings: vi.fn(async () => ({ items: [] }))
    }
  } as unknown as typeof window.faContentBridgeAPIs

  await expect(loadDialogQuickAddDocumentSources()).resolves.toEqual({
    templates: [{
      icon: 'mdi-account',
      id: 'tpl-probe',
      titlePluralTranslations: { 'en-US': 'Heroes' },
      titleSingularTranslations: { 'en-US': 'Hero' }
    }],
    worlds: [{
      color: '#4caf50',
      displayNameTranslations: { 'en-US': 'Probe World' },
      id: 'world-probe',
      sortOrder: 0,
      templateLayout: {
        groups: [{
          id: 'group-probe',
          rootSortOrder: 0
        }],
        placements: [{
          documentTemplateId: 'tpl-probe',
          groupId: 'group-probe',
          groupSortOrder: 0,
          rootSortOrder: null
        }]
      }
    }]
  })
  expect(window.faContentBridgeAPIs.projectContent.listWorldsForProjectSettings)
    .not.toHaveBeenCalled()
})

/**
 * resolveDialogQuickAddDocumentPreferredLanguageCode
 * Falls back through user settings languageCode.
 */
test('Test that resolveDialogQuickAddDocumentPreferredLanguageCode reads user settings', () => {
  expect(resolveDialogQuickAddDocumentPreferredLanguageCode()).toBe('en-US')
})
