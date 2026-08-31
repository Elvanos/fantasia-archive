import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'

import {
  FA_DIALOG_PROJECT_MEDIA_ADD_PANEL,
  FA_DIALOG_PROJECT_MEDIA_ADD_SUBVIEW_ONLINE_URLS,
  FA_DIALOG_PROJECT_MEDIA_LIST_PANEL,
  FA_DIALOG_PROJECT_MEDIA_MASS_EDIT_PANEL,
  FA_DIALOG_PROJECT_MEDIA_SINGLE_EDIT_PANEL
} from 'app/src/scripts/faProjectMedia/faProjectMedia_manager'

import DialogProjectMediaPanelsColumn from '../DialogProjectMediaPanelsColumn.vue'

const emptySearchQuery = ''

const panelsColumnGlobal = {
  mocks: { $t: (k: string) => k },
  stubs: {
    QBtn: {
      props: {
        label: {
          default: '',
          type: String
        }
      },
      template: '<button type="button" v-bind="$attrs">{{ label }}<slot /></button>'
    },
    QIcon: { template: '<i><slot /></i>' },
    QInput: {
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
    },
    QSeparator: { template: '<div class="q-separator-stub" v-bind="$attrs"></div>' },
    QTabPanel: { template: '<div class="q-tab-panel-stub"><slot /></div>' },
    QTabPanels: { template: '<div class="q-tab-panels-stub"><slot /></div>' },
    DialogProjectMediaMassEditTable: {
      name: 'DialogProjectMediaMassEditTable',
      props: {
        modelValue: {
          default: () => [],
          type: Array
        }
      },
      emits: ['update:modelValue'],
      template: '<div data-test-locator="dialogProjectMedia-massEditTable"></div>'
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

  expect(w.find('[data-test-locator="dialogProjectMedia-panelTitle-mediaList"]').exists()).toBe(true)
  expect(w.find('[data-test-locator="dialogProjectMedia-panelTitle-mediaAdd"]').exists()).toBe(false)
  expect(w.find('[data-test-locator="dialogProjectMedia-search"]').exists()).toBe(true)
  expect(w.find('[data-test-locator="dialogProjectMedia-addDropZone"]').exists()).toBe(true)
  expect(w.find('[data-test-locator="dialogProjectMedia-addOfflineMediaButton"]').exists()).toBe(true)
  expect(w.find('[data-test-locator="dialogProjectMedia-addOnlineMediaButton"]').exists()).toBe(true)
  expect(w.find('[data-test-locator="dialogProjectMedia-addChoiceDivider"]').exists()).toBe(true)
  expect(w.find('[data-test-locator="dialogProjectMedia-addDropZoneHintOr"]').exists()).toBe(true)
  expect(w.find('[data-test-locator="dialogProjectMedia-addDropZoneHintDrag"]').exists()).toBe(true)
  expect(w.find('[data-test-locator="dialogProjectMedia-panelTitle-mediaSingleEdit"]').exists())
    .toBe(true)
  expect(w.find('[data-test-locator="dialogProjectMedia-massEditTable"]').exists()).toBe(true)
  expect(w.text()).toContain('dialogs.projectMedia.panelMediaList')
  expect(w.text()).toContain('dialogs.projectMedia.addOfflineMediaButton')
  expect(w.text()).toContain('dialogs.projectMedia.addOnlineMediaButton')
  expect(w.text()).toContain('dialogs.projectMedia.addMediaDropZoneOr')
  expect(w.text()).toContain('dialogs.projectMedia.addMediaDropZoneDrag')
  expect(w.text()).not.toContain('dialogs.projectMedia.panelMediaAddition')
  expect(w.text()).toContain('dialogs.projectMedia.panelSingleMediumEdit')
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
  mass.unmount()
})

/**
 * DialogProjectMediaPanelsColumn
 * Add online media click should emit without leaving the add panel id.
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
 * Online URLs sub-view should hide the drop zone and show the URL textarea.
 */
test('Test that DialogProjectMediaPanelsColumn online URLs sub-view replaces the drop zone', async () => {
  const w = mount(DialogProjectMediaPanelsColumn, {
    global: panelsColumnGlobal,
    props: {
      addSubView: FA_DIALOG_PROJECT_MEDIA_ADD_SUBVIEW_ONLINE_URLS,
      searchQuery: emptySearchQuery,
      selectedPanel: FA_DIALOG_PROJECT_MEDIA_ADD_PANEL
    }
  })

  expect(w.find('[data-test-locator="dialogProjectMedia-addDropZone"]').exists()).toBe(false)
  expect(w.find('[data-test-locator="dialogProjectMedia-addOnlineUrls"]').exists()).toBe(true)
  expect(w.find('[data-test-locator="dialogProjectMedia-addOnlineUrlsTitle"]').exists()).toBe(true)
  expect(w.find('[data-test-locator="dialogProjectMedia-addOnlineUrlsSubmit"]').exists()).toBe(true)
  expect(w.text()).toContain('dialogs.projectMedia.addOnlineUrlsTitle')
  expect(w.text()).toContain('dialogs.projectMedia.addOnlineUrlsSubmitButton')
  const urlsField = w.get('[data-test-locator="dialogProjectMedia-addOnlineUrlsInput"] textarea')
  await urlsField.setValue('https://example.com/a\nhttps://example.com/b')
  expect(w.emitted('update:onlineUrlsDraft')?.[0]).toEqual([
    'https://example.com/a\nhttps://example.com/b'
  ])
  w.unmount()
})

test('Test that DialogProjectMediaPanelsColumn submit button emits submitOnlineUrls', async () => {
  const w = mount(DialogProjectMediaPanelsColumn, {
    global: panelsColumnGlobal,
    props: {
      addSubView: FA_DIALOG_PROJECT_MEDIA_ADD_SUBVIEW_ONLINE_URLS,
      searchQuery: emptySearchQuery,
      selectedPanel: FA_DIALOG_PROJECT_MEDIA_ADD_PANEL
    }
  })

  await w.get('[data-test-locator="dialogProjectMedia-addOnlineUrlsSubmit"]').trigger('click')
  expect(w.emitted('submitOnlineUrls')).toHaveLength(1)
  w.unmount()
})

test('Test that DialogProjectMediaPanelsColumn forwards mass-edit table v-model', async () => {
  const w = mount(DialogProjectMediaPanelsColumn, {
    global: panelsColumnGlobal,
    props: {
      searchQuery: emptySearchQuery,
      selectedPanel: FA_DIALOG_PROJECT_MEDIA_MASS_EDIT_PANEL
    }
  })

  await w.getComponent({ name: 'DialogProjectMediaMassEditTable' }).vm.$emit('update:modelValue', [])
  expect(w.emitted('update:massEditRows')?.[0]).toEqual([[]])
  w.unmount()
})
