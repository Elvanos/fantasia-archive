import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'

import {
  FA_DIALOG_PROJECT_MEDIA_ADD_PANEL,
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
        }
      },
      emits: ['update:modelValue'],
      template: `
        <div class="q-input-stub" v-bind="$attrs">
          <slot name="prepend" />
          <input
            :placeholder="placeholder"
            :value="modelValue"
            @input="$emit('update:modelValue', ($event.target).value)"
          />
        </div>
      `
    },
    QSeparator: { template: '<div class="q-separator-stub" v-bind="$attrs"></div>' },
    QTabPanel: { template: '<div class="q-tab-panel-stub"><slot /></div>' },
    QTabPanels: { template: '<div class="q-tab-panels-stub"><slot /></div>' }
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
  expect(w.find('[data-test-locator="dialogProjectMedia-panelTitle-mediaMassEdit"]').exists())
    .toBe(true)
  expect(w.text()).toContain('dialogs.projectMedia.panelMediaList')
  expect(w.text()).toContain('dialogs.projectMedia.addOfflineMediaButton')
  expect(w.text()).toContain('dialogs.projectMedia.addOnlineMediaButton')
  expect(w.text()).toContain('dialogs.projectMedia.addMediaDropZoneOr')
  expect(w.text()).toContain('dialogs.projectMedia.addMediaDropZoneDrag')
  expect(w.text()).not.toContain('dialogs.projectMedia.panelMediaAddition')
  expect(w.text()).toContain('dialogs.projectMedia.panelSingleMediumEdit')
  expect(w.text()).toContain('dialogs.projectMedia.panelMassMediumEdit')
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
