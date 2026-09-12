import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { expect, test } from 'vitest'

import type { I_faProjectMedia } from 'app/types/I_faProjectMediaDomain'

import {
  FA_DIALOG_PROJECT_MEDIA_ADD_ONLINE_URLS_PANEL,
  FA_DIALOG_PROJECT_MEDIA_ADD_PANEL,
  FA_DIALOG_PROJECT_MEDIA_LIST_PANEL,
  FA_DIALOG_PROJECT_MEDIA_MASS_EDIT_PANEL,
  FA_DIALOG_PROJECT_MEDIA_SINGLE_EDIT_PANEL
} from 'app/src/scripts/faProjectMedia/faProjectMedia_manager'

import DialogProjectMediaPanelsColumn from '../DialogProjectMediaPanelsColumn.vue'

const emptySearchQuery = ''

const panelsColumnQInputStub = defineComponent({
  inheritAttrs: true,
  props: {
    modelValue: {
      default: '',
      type: String
    },
    placeholder: {
      default: '',
      type: String
    },
    type: {
      default: 'text',
      type: String
    }
  },
  emits: ['update:modelValue'],
  methods: {
    focus () {
      const root = this.$el as HTMLElement
      root.setAttribute('data-fa-focused', 'true')
    }
  },
  template: `
    <div class="q-input-stub" v-bind="$attrs">
      <slot name="prepend" />
      <textarea
        v-if="type === 'textarea'"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target).value)"
      />
      <input
        v-else
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target).value)"
      />
    </div>
  `
})

const panelsColumnGlobal = {
  mocks: { $t: (k: string) => k },
  stubs: {
    QBtn: {
      props: {
        disable: {
          default: false,
          type: Boolean
        },
        label: {
          default: '',
          type: String
        }
      },
      template: '<button type="button" v-bind="$attrs" :disabled="disable">{{ label }}<slot /></button>'
    },
    QIcon: { template: '<i><slot /></i>' },
    QInput: panelsColumnQInputStub,
    QSeparator: { template: '<div class="q-separator-stub" v-bind="$attrs"></div>' },
    QTabPanel: { template: '<div class="q-tab-panel-stub"><slot /></div>' },
    QTabPanels: { template: '<div class="q-tab-panels-stub"><slot /></div>' },
    DialogProjectMediaListGrid: {
      name: 'DialogProjectMediaListGrid',
      props: {
        items: {
          default: () => [],
          type: Array
        }
      },
      emits: ['selectItem'],
      template: '<div data-test-locator="dialogProjectMedia-listGrid">{{ items.length }}</div>'
    },
    DialogProjectMediaMassEditList: {
      name: 'DialogProjectMediaMassEditList',
      props: {
        modelValue: {
          default: () => [],
          type: Array
        }
      },
      emits: ['update:modelValue'],
      template: '<div data-test-locator="dialogProjectMedia-massEditList"></div>'
    },
    DialogProjectMediaSingleEditPanel: {
      name: 'DialogProjectMediaSingleEditPanel',
      props: ['row', 'isSaveDisabled'],
      emits: ['close', 'save', 'update:row'],
      template: `
        <div>
          <div data-test-locator="dialogProjectMedia-title-mediaSingleEdit">
            dialogs.projectMedia.titleSingle
          </div>
          <button
            type="button"
            data-test-locator="dialogProjectMedia-singleEdit-close"
            @click="$emit('close')"
          >
            dialogs.projectMedia.closeButton
          </button>
          <button
            type="button"
            data-test-locator="dialogProjectMedia-singleEdit-saveAndClose"
            :disabled="isSaveDisabled"
          >
            dialogs.projectMedia.singleEditSaveAndCloseButton
          </button>
        </div>
      `
    }
  }
} as const

/**
 * DialogProjectMediaPanelsColumn
 * Renders list search plus edit titles and the add drop zone.
 */
test('Test that DialogProjectMediaPanelsColumn renders list search, edit titles, and add drop zone', () => {
  const w = mount(DialogProjectMediaPanelsColumn, {
    global: panelsColumnGlobal,
    props: {
      searchQuery: emptySearchQuery,
      selectedPanel: FA_DIALOG_PROJECT_MEDIA_LIST_PANEL
    }
  })

  expect(w.find('[data-test-locator="dialogProjectMedia-panelTitle-mediaList"]').exists()).toBe(false)
  expect(w.get('[data-test-locator="dialogProjectMedia-title-mediaList"]').text())
    .toBe('dialogs.projectMedia.titleList')
  expect(w.get('[data-test-locator="dialogProjectMedia-title-mediaAdd"]').text())
    .toBe('dialogs.projectMedia.titleAdd')
  expect(w.get('[data-test-locator="dialogProjectMedia-title-mediaAddOnlineUrls"]').text())
    .toBe('dialogs.projectMedia.titleAddOnline')
  expect(w.get('[data-test-locator="dialogProjectMedia-title-mediaSingleEdit"]').text())
    .toBe('dialogs.projectMedia.titleSingle')
  expect(w.get('[data-test-locator="dialogProjectMedia-title-mediaMassEdit"]').text())
    .toBe('dialogs.projectMedia.titleMassEdit')
  expect(w.find('[data-test-locator="dialogProjectMedia-panelTitle-mediaAdd"]').exists()).toBe(false)
  expect(w.find('[data-test-locator="dialogProjectMedia-search"]').exists()).toBe(true)
  expect(w.find('[data-test-locator="dialogProjectMedia-addDropZone"]').exists()).toBe(true)
  expect(w.find('[data-test-locator="dialogProjectMedia-addOfflineMediaButton"]').exists()).toBe(true)
  expect(w.find('[data-test-locator="dialogProjectMedia-addOnlineMediaButton"]').exists()).toBe(true)
  expect(w.find('[data-test-locator="dialogProjectMedia-addChoiceDivider"]').exists()).toBe(true)
  expect(w.find('[data-test-locator="dialogProjectMedia-addDropZoneHintOr"]').exists()).toBe(true)
  expect(w.find('[data-test-locator="dialogProjectMedia-addDropZoneHintDrag"]').exists()).toBe(true)
  expect(w.find('[data-test-locator="dialogProjectMedia-panelTitle-mediaSingleEdit"]').exists())
    .toBe(false)
  expect(w.find('[data-test-locator="dialogProjectMedia-massEditList"]').exists()).toBe(true)
  expect(w.find('[data-test-locator="dialogProjectMedia-listGrid"]').exists()).toBe(true)
  expect(w.find('[data-test-locator="dialogProjectMedia-listGrid"]').text()).toBe('0')
  expect(w.text()).not.toContain('dialogs.projectMedia.panelMediaList')
  expect(w.text()).toContain('dialogs.projectMedia.addOfflineMediaButton')
  expect(w.text()).toContain('dialogs.projectMedia.addOnlineMediaButton')
  expect(w.text()).toContain('dialogs.projectMedia.addMediaDropZoneOr')
  expect(w.text()).toContain('dialogs.projectMedia.addMediaDropZoneDrag')
  expect(w.text()).not.toContain('dialogs.projectMedia.panelMediaAddition')
  expect(w.text()).not.toContain('dialogs.projectMedia.panelSingleMediumEdit')
  w.unmount()
})

/**
 * DialogProjectMediaPanelsColumn
 * Search field v-model emits update:searchQuery.
 */
test('Test that DialogProjectMediaPanelsColumn search input emits update:searchQuery', async () => {
  const w = mount(DialogProjectMediaPanelsColumn, {
    global: panelsColumnGlobal,
    props: {
      searchQuery: emptySearchQuery,
      selectedPanel: FA_DIALOG_PROJECT_MEDIA_LIST_PANEL
    }
  })

  const searchInput = w.get('[data-test-locator="dialogProjectMedia-search"] input')
  await searchInput.setValue('needle')
  expect(w.emitted('update:searchQuery')?.[0]).toEqual(['needle'])
})

/**
 * DialogProjectMediaPanelsColumn
 * Forwards selectedPanel to q-tab-panels model-value.
 */
test('Test that DialogProjectMediaPanelsColumn binds selectedPanel to q-tab-panels', () => {
  const w = mount(DialogProjectMediaPanelsColumn, {
    global: panelsColumnGlobal,
    props: {
      searchQuery: emptySearchQuery,
      selectedPanel: FA_DIALOG_PROJECT_MEDIA_ADD_PANEL
    }
  })

  expect(w.props('selectedPanel')).toBe(FA_DIALOG_PROJECT_MEDIA_ADD_PANEL)
  expect(w.find('.q-tab-panels-stub').exists()).toBe(true)
})

test('Test that DialogProjectMediaPanelsColumn accepts single and mass edit panel ids', () => {
  const single = mount(DialogProjectMediaPanelsColumn, {
    global: panelsColumnGlobal,
    props: {
      searchQuery: emptySearchQuery,
      selectedPanel: FA_DIALOG_PROJECT_MEDIA_SINGLE_EDIT_PANEL
    }
  })
  expect(single.props('selectedPanel')).toBe(FA_DIALOG_PROJECT_MEDIA_SINGLE_EDIT_PANEL)
  single.unmount()

  const mass = mount(DialogProjectMediaPanelsColumn, {
    global: panelsColumnGlobal,
    props: {
      searchQuery: emptySearchQuery,
      selectedPanel: FA_DIALOG_PROJECT_MEDIA_MASS_EDIT_PANEL
    }
  })
  expect(mass.props('selectedPanel')).toBe(FA_DIALOG_PROJECT_MEDIA_MASS_EDIT_PANEL)
  expect(mass.find('.dialogProjectMedia__panelScroll--massEdit').exists()).toBe(true)
  expect(mass.find('.dialogProjectMedia__panelScroll--massEdit.hasScrollbar').exists()).toBe(false)
  mass.unmount()
})

/**
 * DialogProjectMediaPanelsColumn
 * Add online media click should emit without changing selectedPanel itself.
 */
test('Test that DialogProjectMediaPanelsColumn add online button emits addOnlineMedia', async () => {
  const w = mount(DialogProjectMediaPanelsColumn, {
    global: panelsColumnGlobal,
    props: {
      searchQuery: emptySearchQuery,
      selectedPanel: FA_DIALOG_PROJECT_MEDIA_ADD_PANEL
    }
  })

  await w.get('[data-test-locator="dialogProjectMedia-addOnlineMediaButton"]').trigger('click')
  expect(w.emitted('addOnlineMedia')).toHaveLength(1)
  expect(w.props('selectedPanel')).toBe(FA_DIALOG_PROJECT_MEDIA_ADD_PANEL)
  w.unmount()
})

/**
 * DialogProjectMediaPanelsColumn
 * Online URLs panel shows the URL textarea titled as h6.
 */
test('Test that DialogProjectMediaPanelsColumn online URLs panel shows the textarea', async () => {
  const w = mount(DialogProjectMediaPanelsColumn, {
    global: panelsColumnGlobal,
    props: {
      searchQuery: emptySearchQuery,
      selectedPanel: FA_DIALOG_PROJECT_MEDIA_ADD_ONLINE_URLS_PANEL
    }
  })

  expect(w.props('selectedPanel')).toBe(FA_DIALOG_PROJECT_MEDIA_ADD_ONLINE_URLS_PANEL)
  expect(w.find('[data-test-locator="dialogProjectMedia-addOnlineUrls"]').exists()).toBe(true)
  expect(w.find('[data-test-locator="dialogProjectMedia-addOnlineUrlsTitle"]').exists()).toBe(true)
  expect(w.get('[data-test-locator="dialogProjectMedia-addOnlineUrlsTitle"]').element.tagName)
    .toBe('H6')
  expect(w.find('[data-test-locator="dialogProjectMedia-addOnlineUrlsSubmit"]').exists()).toBe(false)
  expect(w.text()).toContain('dialogs.projectMedia.addOnlineUrlsTitle')
  expect(w.text()).not.toContain('dialogs.projectMedia.addOnlineUrlsSubmitButton')
  const urlsField = w.get('[data-test-locator="dialogProjectMedia-addOnlineUrlsInput"] textarea')
  await urlsField.setValue('https://example.com/a\nhttps://example.com/b')
  expect(w.emitted('update:onlineUrlsDraft')?.[0]).toEqual([
    'https://example.com/a\nhttps://example.com/b'
  ])
  w.unmount()
})

/**
 * DialogProjectMediaPanelsColumn
 * URL panel should focus the textarea when the slide becomes active.
 */
test('Test that DialogProjectMediaPanelsColumn focuses the URL textarea on that panel', async () => {
  const list = mount(DialogProjectMediaPanelsColumn, {
    global: panelsColumnGlobal,
    props: {
      searchQuery: emptySearchQuery,
      selectedPanel: FA_DIALOG_PROJECT_MEDIA_LIST_PANEL
    }
  })
  await flushPromises()
  expect(
    list.find('[data-test-locator="dialogProjectMedia-addOnlineUrlsInput"]').attributes(
      'data-fa-focused'
    )
  ).toBeUndefined()
  list.unmount()

  const urls = mount(DialogProjectMediaPanelsColumn, {
    global: panelsColumnGlobal,
    props: {
      searchQuery: emptySearchQuery,
      selectedPanel: FA_DIALOG_PROJECT_MEDIA_ADD_ONLINE_URLS_PANEL
    }
  })
  await flushPromises()
  expect(
    urls.get('[data-test-locator="dialogProjectMedia-addOnlineUrlsInput"]').attributes(
      'data-fa-focused'
    )
  ).toBe('true')
  urls.unmount()

  const switched = mount(DialogProjectMediaPanelsColumn, {
    global: panelsColumnGlobal,
    props: {
      searchQuery: emptySearchQuery,
      selectedPanel: FA_DIALOG_PROJECT_MEDIA_ADD_PANEL
    }
  })
  await flushPromises()
  await switched.setProps({ selectedPanel: FA_DIALOG_PROJECT_MEDIA_ADD_ONLINE_URLS_PANEL })
  await flushPromises()
  expect(
    switched.get('[data-test-locator="dialogProjectMedia-addOnlineUrlsInput"]').attributes(
      'data-fa-focused'
    )
  ).toBe('true')
  switched.unmount()
})

test('Test that DialogProjectMediaPanelsColumn forwards mass-edit table v-model', async () => {
  const w = mount(DialogProjectMediaPanelsColumn, {
    global: panelsColumnGlobal,
    props: {
      searchQuery: emptySearchQuery,
      selectedPanel: FA_DIALOG_PROJECT_MEDIA_MASS_EDIT_PANEL
    }
  })

  await w.getComponent({ name: 'DialogProjectMediaMassEditList' }).vm.$emit('update:modelValue', [])
  expect(w.emitted('update:massEditRows')?.[0]).toEqual([[]])
  w.unmount()
})

test('Test that DialogProjectMediaPanelsColumn renders list thumbs from listMediaItems', () => {
  const w = mount(DialogProjectMediaPanelsColumn, {
    global: panelsColumnGlobal,
    props: {
      listMediaItems: [
        {
          createdAtMs: 0,
          displayName: 'saved',
          externalEmbed: '',
          externalLink: 'https://a.test/saved.png',
          externalType: 'linked',
          id: 'saved',
          internalEmbed: null,
          internalLink: '',
          internalType: 'linked_outside',
          type: 'external',
          updatedAtMs: 0
        }
      ],
      searchQuery: emptySearchQuery,
      selectedPanel: FA_DIALOG_PROJECT_MEDIA_LIST_PANEL
    }
  })

  expect(w.find('[data-test-locator="dialogProjectMedia-listGrid"]').text()).toBe('1')
  w.unmount()
})

test('Test that DialogProjectMediaPanelsColumn list grid selectItem emits selectListItem', async () => {
  const item: I_faProjectMedia = {
    createdAtMs: 0,
    displayName: 'saved',
    externalEmbed: '',
    externalLink: 'https://a.test/saved.png',
    externalType: 'linked',
    id: 'saved',
    internalEmbed: null,
    internalLink: '',
    internalType: 'linked_outside',
    type: 'external',
    updatedAtMs: 0
  }
  const w = mount(DialogProjectMediaPanelsColumn, {
    global: panelsColumnGlobal,
    props: {
      listMediaItems: [item],
      searchQuery: emptySearchQuery,
      selectedPanel: FA_DIALOG_PROJECT_MEDIA_LIST_PANEL
    }
  })

  await w.getComponent({ name: 'DialogProjectMediaListGrid' }).vm.$emit('selectItem', item)
  expect(w.emitted('selectListItem')?.[0]).toEqual([item])
  w.unmount()
})

test('Test that DialogProjectMediaPanelsColumn single-edit footer emits close and save', async () => {
  const w = mount(DialogProjectMediaPanelsColumn, {
    global: panelsColumnGlobal,
    props: {
      isSingleEditSaveDisabled: true,
      searchQuery: emptySearchQuery,
      selectedPanel: FA_DIALOG_PROJECT_MEDIA_SINGLE_EDIT_PANEL
    }
  })

  expect(
    (w.get('[data-test-locator="dialogProjectMedia-singleEdit-saveAndClose"]')
      .element as HTMLButtonElement).disabled
  ).toBe(true)
  await w.get('[data-test-locator="dialogProjectMedia-singleEdit-close"]').trigger('click')
  expect(w.emitted('singleEditClose')).toHaveLength(1)
  await w.getComponent({ name: 'DialogProjectMediaSingleEditPanel' }).vm.$emit('save')
  expect(w.emitted('singleEditSave')).toHaveLength(1)
  const singleRow = {
    createdAtMs: 0,
    displayName: 'draft',
    externalEmbed: '',
    externalLink: 'https://a.test/draft.png',
    externalType: 'linked',
    id: 'draft',
    internalEmbed: null,
    internalLink: '',
    internalType: 'linked_outside',
    isNew: false,
    type: 'external',
    updatedAtMs: 0
  }
  await w.getComponent({ name: 'DialogProjectMediaSingleEditPanel' }).vm.$emit(
    'update:row',
    singleRow
  )
  expect(w.emitted('update:singleEditRow')?.[0]).toEqual([singleRow])
  w.unmount()
})
