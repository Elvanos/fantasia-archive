import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, expect, test, vi } from 'vitest'
import { defineComponent, h, onMounted } from 'vue'

vi.mock('app/src/scripts/appGlobalManagementUI/appGlobalManagementUI_manager', () => {
  return {
    registerComponentDialogStackGuard: vi.fn()
  }
})

vi.mock('app/src/scripts/documentTemplates/faProjectDocumentTemplateTitle_manager', () => {
  return {
    resolveFaProjectDocumentTemplateDisplayTitleFromFields: (
      plural: Record<string, string>,
      _singular: Record<string, string>,
      languageCode: string
    ) => plural[languageCode] ?? 'Untitled'
  }
})

vi.mock('app/src/scripts/projectWorlds/faProjectWorldDisplayName_manager', () => {
  return {
    resolveFaProjectWorldDisplayName: (translations: Record<string, string>) => {
      return translations['en-US'] ?? 'World'
    }
  }
})

vi.mock('../dialogQuickAddDocumentDataWiring', () => {
  return {
    loadDialogQuickAddDocumentSources: vi.fn(async () => ({
      templates: [{
        icon: 'mdi-account',
        id: 'tpl-1',
        titlePluralTranslations: { 'en-US': 'Heroes' },
        titleSingularTranslations: { 'en-US': 'Hero' }
      }],
      worlds: [{
        color: '#009688',
        displayNameTranslations: { 'en-US': 'Main' },
        id: 'world-1',
        sortOrder: 0,
        templateLayout: {
          groups: [],
          placements: [{
            documentTemplateId: 'tpl-1',
            groupId: null,
            groupSortOrder: null,
            rootSortOrder: 0
          }]
        }
      }]
    })),
    resolveDialogQuickAddDocumentPreferredLanguageCode: () => 'en-US'
  }
})

const createTemporaryDocumentMock = vi.fn(async () => 'temp-doc-id')

vi.mock('src/stores/S_FaOpenedDocuments', () => {
  return {
    S_FaOpenedDocuments: () => ({
      createTemporaryDocument: createTemporaryDocumentMock
    })
  }
})

beforeEach(() => {
  setActivePinia(createPinia())
  createTemporaryDocumentMock.mockClear()
})

import { useDialogQuickAddDocument } from '../dialogQuickAddDocument_manager'

/**
 * useDialogQuickAddDocument
 * Manager wiring hydrates sources on show and creates a temporary document on template pick.
 */
test('Test that useDialogQuickAddDocument from the manager creates a temporary document', async () => {
  vi.useFakeTimers()

  const Harness = defineComponent({
    name: 'DialogQuickAddDocumentManagerHarness',
    setup () {
      const api = useDialogQuickAddDocument({ directInput: 'QuickAddDocument' })

      onMounted(() => {
        api.templateSelectRef.value = {
          openPopup: () => undefined
        }
      })

      return {
        api,
        pickTemplate: () => {
          void api.onTemplateSelect('tpl-1')
        }
      }
    },
    render () {
      return h('div', {
        'data-test-locator': 'quick-add-manager-harness',
        'data-open': String(this.api.dialogModel.value),
        'data-world': this.api.selectedWorldId.value ?? ''
      }, [
        h('button', {
          'data-test-locator': 'pick-template',
          onClick: this.pickTemplate
        }, 'pick')
      ])
    }
  })

  const wrapper = mount(Harness)
  await flushPromises()
  await vi.runAllTimersAsync()
  await flushPromises()

  expect(wrapper.attributes('data-open')).toBe('true')
  expect(wrapper.attributes('data-world')).toBe('world-1')

  const api = (wrapper.vm as unknown as { api: ReturnType<typeof useDialogQuickAddDocument> }).api
  api.onDialogShow()
  await flushPromises()
  await vi.runAllTimersAsync()
  await flushPromises()

  await wrapper.find('[data-test-locator="pick-template"]').trigger('click')
  await flushPromises()

  expect(createTemporaryDocumentMock).toHaveBeenCalledWith({
    displayName: expect.any(String),
    templateId: 'tpl-1',
    worldId: 'world-1'
  })

  wrapper.unmount()
  vi.useRealTimers()
})
