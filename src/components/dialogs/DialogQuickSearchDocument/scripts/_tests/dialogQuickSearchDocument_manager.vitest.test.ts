import { expect, test, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { flushPromises } from '@vue/test-utils'

vi.mock('../dialogQuickSearchDocumentDataWiring', () => {
  return {
    loadDialogQuickSearchDocumentDocumentsForWorld: vi.fn(async () => ([
      {
        displayName: 'Aria',
        documentTextColor: null,
        id: 'doc-a',
        isCategory: false,
        sortOrder: 0,
        templateId: 'tpl-hero'
      }
    ])),
    loadDialogQuickSearchDocumentSources: vi.fn(async () => ({
      templates: [{
        id: 'tpl-hero',
        icon: 'mdi-account'
      }],
      worlds: [{
        color: '#4caf50',
        displayNameTranslations: { 'en-US': 'Eldoria' },
        id: 'world-a',
        sortOrder: 0
      }]
    })),
    readDialogQuickSearchDocumentDisableCloseAfterSelect: () => false,
    resolveDialogQuickSearchDocumentPreferredLanguageCode: () => 'en-US'
  }
})

vi.mock('app/src/scripts/projectDialogUiPref/projectDialogUiPref_manager', () => {
  return {
    pickFaProjectDialogLastSelectedWorldId: ({
      pickFirstWorldId,
      worlds
    }: {
      pickFirstWorldId: (worlds: ReadonlyArray<{ id: string }>) => string | null
      worlds: ReadonlyArray<{ id: string }>
    }) => pickFirstWorldId(worlds),
    readFaProjectLastSelectedWorldId: vi.fn(async () => null),
    writeFaProjectLastSelectedWorldId: vi.fn(async () => undefined)
  }
})

vi.mock('app/src/scripts/actionManager/faActionManagerRun_manager', () => {
  return {
    runFaAction: vi.fn()
  }
})

vi.mock('app/src/scripts/appGlobalManagementUI/appGlobalManagementUI_manager', () => {
  return {
    registerComponentDialogStackGuard: vi.fn()
  }
})

vi.mock('app/src/scripts/projectWorlds/faProjectWorldDisplayName_manager', () => {
  return {
    resolveFaProjectWorldDisplayName: (
      translations: Record<string, string>
    ) => translations['en-US'] ?? ''
  }
})

import { useDialogQuickSearchDocument } from '../dialogQuickSearchDocument_manager'
import { runFaAction } from 'app/src/scripts/actionManager/faActionManagerRun_manager'

/**
 * useDialogQuickSearchDocument
 */
test('Test that useDialogQuickSearchDocument from the manager opens a document', async () => {
  setActivePinia(createPinia())
  const harness = defineComponent({
    name: 'DialogQuickSearchDocumentManagerHarness',
    setup () {
      const api = useDialogQuickSearchDocument({ directInput: 'QuickSearchDocument' })
      return { api }
    },
    template: '<div />'
  })
  const w = mount(harness)
  const api = (w.vm as unknown as { api: ReturnType<typeof useDialogQuickSearchDocument> }).api
  await flushPromises()
  api.onDialogShow()
  await flushPromises()
  api.onDocumentSelect({
    id: 'doc-a',
    name: 'Aria'
  })
  await flushPromises()
  expect(runFaAction).toHaveBeenCalledWith('openHierarchyTreeDocument', { documentId: 'doc-a' })
  expect(api.dialogModel.value).toBe(false)
  w.unmount()
})
