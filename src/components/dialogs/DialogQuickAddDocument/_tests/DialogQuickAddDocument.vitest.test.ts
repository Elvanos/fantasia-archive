/** @vitest-environment jsdom */
/* eslint-disable vue/one-component-per-file -- QDialog + FaSelectInput stubs colocated with mount helpers */
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { defineComponent } from 'vue'
import { beforeEach, expect, test, vi } from 'vitest'

import { S_DialogComponent } from 'app/src/stores/S_Dialog'

import DialogQuickAddDocument from '../DialogQuickAddDocument.vue'

const quickAddQDialogStub = defineComponent({
  name: 'QDialog',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'hide', 'show'],
  template: `
    <div class="quick-add-qdialog-stub" v-bind="$attrs">
      <div v-if="modelValue" class="quick-add-qdialog-inner">
        <slot />
      </div>
    </div>
  `
})

const faSelectInputStub = defineComponent({
  name: 'FaSelectInput',
  props: {
    modelValue: {
      default: null,
      type: [Object, String, Array]
    },
    options: {
      default: () => [],
      type: Array
    },
    popupContentClass: {
      default: '',
      type: String
    },
    chipRemovable: {
      default: true,
      type: Boolean
    },
    selectionPresentation: {
      default: 'chips',
      type: String
    },
    testLocator: {
      type: String,
      required: true
    }
  },
  emits: ['update:modelValue', 'option-activate'],
  template: `
    <div
      class="fa-select-input-stub"
      :data-test-locator="testLocator"
      :data-popup-content-class="popupContentClass"
      :data-chip-removable="chipRemovable ? 'true' : 'false'"
      :data-selection-presentation="selectionPresentation"
      @click="$emit('update:modelValue', options[0] ?? null)"
    >
      <button
        type="button"
        :data-test-locator="testLocator + '-activate'"
        @click.stop="$emit('option-activate', options[0] ?? null)"
      />
      <div
        v-for="(opt, index) in options"
        :key="index"
        :data-test-locator="testLocator + '-option-' + index"
      />
      <hr
        v-if="options.length > 1"
        :data-test-locator="testLocator + '-separatorAlt-1'"
      />
    </div>
  `
})

const quickAddDialogGlobal = {
  mocks: { $t: (k: string) => k },
  stubs: {
    FaSelectInput: faSelectInputStub,
    QBtn: {
      props: {
        label: {
          default: '',
          type: String
        }
      },
      template: '<button type="button" v-bind="$attrs">{{ label }}<slot /></button>'
    },
    QCard: { template: '<div><slot /></div>' },
    QCardActions: { template: '<div><slot /></div>' },
    QCardSection: { template: '<div><slot /></div>' },
    QDialog: quickAddQDialogStub
  }
} as const

beforeEach(() => {
  vi.restoreAllMocks()
  window.faContentBridgeAPIs = {
    ...window.faContentBridgeAPIs,
    projectContent: {
      ...window.faContentBridgeAPIs?.projectContent,
      listDocumentTemplatesForProjectSettings: vi.fn(async () => ({ items: [] })),
      listWorldsForProjectSettings: vi.fn(async () => ({ items: [] }))
    }
  } as unknown as typeof window.faContentBridgeAPIs
})

/**
 * DialogQuickAddDocument
 * directInput should open the dialog shell and surface the i18n title key.
 */
test('Test that DialogQuickAddDocument renders shell for QuickAddDocument input', async () => {
  const w = mount(DialogQuickAddDocument, {
    global: quickAddDialogGlobal,
    props: { directInput: 'QuickAddDocument' }
  })

  await flushPromises()

  const html = w.html()
  expect(html).toContain('dialogComponent')
  expect(html).toContain('QuickAddDocument')
  expect(w.text()).toContain('dialogs.quickAddDocument.title')
  w.unmount()
})

/**
 * DialogQuickAddDocument
 * Component dialog store UUID changes should open when dialogToOpen matches.
 */
test('Test that DialogQuickAddDocument opens from S_DialogComponent UUID watch', async () => {
  const pinia = createPinia()
  setActivePinia(pinia)
  const st = S_DialogComponent()

  const w = mount(DialogQuickAddDocument, {
    global: {
      ...quickAddDialogGlobal,
      plugins: [pinia]
    }
  })

  await flushPromises()

  st.dialogToOpen = 'QuickAddDocument'
  st.generateDialogUUID()
  await flushPromises()

  expect(w.html()).toContain('QuickAddDocument')
  expect(w.text()).toContain('dialogs.quickAddDocument.title')
  w.unmount()
})

/**
 * DialogQuickAddDocument
 * Close button uses the close i18n key and dialog close locator.
 */
test('Test that DialogQuickAddDocument renders close button', async () => {
  const w = mount(DialogQuickAddDocument, {
    global: quickAddDialogGlobal,
    props: { directInput: 'QuickAddDocument' }
  })

  await flushPromises()

  expect(w.get('[data-test-locator="dialogQuickAddDocument-button-close"]').text())
    .toContain('dialogs.quickAddDocument.closeButton')
  w.unmount()
})

/**
 * DialogQuickAddDocument
 * directInput watch should open only when the prop becomes QuickAddDocument.
 */
test('Test that DialogQuickAddDocument reacts to directInput prop after mount', async () => {
  const w = mount(DialogQuickAddDocument, {
    global: quickAddDialogGlobal
  })

  await flushPromises()

  await w.setProps({ directInput: 'QuickAddDocument' })
  await flushPromises()

  expect(w.text()).toContain('dialogs.quickAddDocument.title')
  w.unmount()
})

/**
 * DialogQuickAddDocument
 * Show/hide and select updates exercise FaSelectInput handlers.
 */
test('Test that DialogQuickAddDocument show hide and select handlers run', async () => {
  window.faContentBridgeAPIs = {
    ...window.faContentBridgeAPIs,
    projectContent: {
      ...window.faContentBridgeAPIs?.projectContent,
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
          color: '#00bcd4',
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
      }))
    }
  } as unknown as typeof window.faContentBridgeAPIs

  const pinia = createPinia()
  setActivePinia(pinia)

  const w = mount(DialogQuickAddDocument, {
    global: {
      ...quickAddDialogGlobal,
      plugins: [pinia]
    },
    props: { directInput: 'QuickAddDocument' }
  })

  await flushPromises()

  const dialog = w.findComponent({ name: 'QDialog' })
  await dialog.vm.$emit('show')
  await flushPromises()

  expect(w.find('[data-test-locator="dialogQuickAddDocument-select-template"]').exists()).toBe(true)

  await w.find('[data-test-locator="dialogQuickAddDocument-select-template"]').trigger('click')
  await flushPromises()

  await dialog.vm.$emit('update:modelValue', false)
  await flushPromises()
  await dialog.vm.$emit('hide')
  await flushPromises()

  w.unmount()
})

/**
 * DialogQuickAddDocument
 * World picker stays hidden when the project has only one world.
 */
test('Test that DialogQuickAddDocument hides world select for a single world', async () => {
  window.faContentBridgeAPIs = {
    ...window.faContentBridgeAPIs,
    projectContent: {
      ...window.faContentBridgeAPIs?.projectContent,
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
          color: '#9c27b0',
          displayNameTranslations: { 'en-US': 'Only' },
          id: 'world-1',
          sortOrder: 0,
          templateLayout: {
            groups: [],
            placements: []
          }
        }]
      }))
    }
  } as unknown as typeof window.faContentBridgeAPIs

  const pinia = createPinia()
  setActivePinia(pinia)

  const w = mount(DialogQuickAddDocument, {
    global: {
      ...quickAddDialogGlobal,
      plugins: [pinia]
    },
    props: { directInput: 'QuickAddDocument' }
  })

  await flushPromises()
  const dialog = w.findComponent({ name: 'QDialog' })
  await dialog.vm.$emit('show')
  await flushPromises()

  expect(w.find('[data-test-locator="dialogQuickAddDocument-select-world"]').exists()).toBe(false)
  const templateSelect = w.find('[data-test-locator="dialogQuickAddDocument-select-template"]')
  expect(templateSelect.exists()).toBe(true)
  expect(templateSelect.attributes('data-popup-content-class'))
    .toContain('dialogQuickAddDocument__selectMenu')
  expect(templateSelect.attributes('data-selection-presentation')).toBe('inline')
  expect(templateSelect.attributes('data-chip-removable')).toBe('true')

  w.unmount()
})

/**
 * DialogQuickAddDocument
 * Multi-world: world + template FaSelectInput options and separator hooks render.
 */
test('Test that DialogQuickAddDocument world select shows with option hooks', async () => {
  window.faContentBridgeAPIs = {
    ...window.faContentBridgeAPIs,
    projectContent: {
      ...window.faContentBridgeAPIs?.projectContent,
      listDocumentTemplatesForProjectSettings: vi.fn(async () => ({
        items: [{
          icon: 'mdi-account',
          id: 'tpl-1',
          titlePluralTranslations: { 'en-US': 'Heroes' },
          titleSingularTranslations: { 'en-US': 'Hero' }
        }]
      })),
      listWorldsForProjectSettings: vi.fn(async () => ({
        items: [
          {
            color: '#e91e63',
            displayNameTranslations: { 'en-US': 'Earth' },
            id: 'world-1',
            sortOrder: 0,
            templateLayout: {
              groups: [],
              placements: []
            }
          },
          {
            color: '#3f51b5',
            displayNameTranslations: { 'en-US': 'Venus' },
            id: 'world-2',
            sortOrder: 1,
            templateLayout: {
              groups: [],
              placements: []
            }
          }
        ]
      }))
    }
  } as unknown as typeof window.faContentBridgeAPIs

  const pinia = createPinia()
  setActivePinia(pinia)

  const w = mount(DialogQuickAddDocument, {
    global: {
      ...quickAddDialogGlobal,
      plugins: [pinia]
    },
    props: { directInput: 'QuickAddDocument' }
  })

  await flushPromises()
  const dialog = w.findComponent({ name: 'QDialog' })
  await dialog.vm.$emit('show')
  await flushPromises()

  const worldSelect = w.find('[data-test-locator="dialogQuickAddDocument-select-world"]')
  expect(worldSelect.exists()).toBe(true)
  expect(worldSelect.attributes('data-selection-presentation')).toBe('inline')
  expect(worldSelect.attributes('data-chip-removable')).toBe('true')
  expect(w.find('[data-test-locator="dialogQuickAddDocument-select-world-separatorAlt-1"]').exists())
    .toBe(true)
  expect(w.find('[data-test-locator="dialogQuickAddDocument-select-world-option-0"]').exists())
    .toBe(true)
  expect(w.find('[data-test-locator="dialogQuickAddDocument-select-template"]').exists()).toBe(true)

  await worldSelect.trigger('click')
  await flushPromises()

  await w.find('[data-test-locator="dialogQuickAddDocument-select-world-activate"]').trigger('click')
  await flushPromises()

  const worldSelectWrap = w.find('.dialogQuickAddDocument__worldSelect')
  expect(worldSelectWrap.exists()).toBe(true)
  await worldSelectWrap.trigger('keydown.enter')
  await flushPromises()

  w.unmount()
})
