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

const quickAddDialogGlobal = {
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
    QCard: { template: '<div><slot /></div>' },
    QCardActions: { template: '<div><slot /></div>' },
    QCardSection: { template: '<div><slot /></div>' },
    QDialog: quickAddQDialogStub,
    QIcon: { template: '<i />' },
    QItem: { template: '<div><slot /></div>' },
    QItemLabel: { template: '<div><slot /></div>' },
    QItemSection: { template: '<div><slot /></div>' },
    QSelect: {
      template: '<div class="q-select-stub" v-bind="$attrs"><slot name="option" :opt="{ icon: \'mdi-earth\', label: \'Opt\', color: \'#abc\' }" :index="0" :itemProps="{}" /><slot name="option" :opt="{ icon: \'mdi-earth\', label: \'Opt2\', color: \'#def\' }" :index="1" :itemProps="{}" /><slot name="selected-item" :opt="{ icon: \'mdi-earth\', label: \'Opt\', color: \'#abc\' }" /></div>'
    },
    QSeparator: {
      template: '<hr v-bind="$attrs" />'
    }
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
 * Show/hide and select updates exercise template option slots and handlers.
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

  const emittingSelectStub = {
    template: `
      <div
        class="q-select-stub"
        v-bind="$attrs"
        @click="$emit('update:modelValue', null)"
        @focus="$emit('filter', 'Hero', (fn, afterFn) => { fn(); afterFn && afterFn({ moveOptionSelection: () => undefined, setOptionIndex: () => undefined, showPopup: () => undefined }) })"
      >
        <slot name="option" :opt="{ icon: 'mdi-x', label: 'Opt', color: '#abc' }" :index="0" :itemProps="{}" />
        <slot name="option" :opt="{ icon: 'mdi-y', label: 'Opt2', color: '#def' }" :index="1" :itemProps="{}" />
        <slot name="selected-item" :opt="{ icon: 'mdi-x', label: 'Opt', color: '#abc' }" />
      </div>
    `
  }

  const w = mount(DialogQuickAddDocument, {
    global: {
      mocks: { $t: (k: string) => k },
      plugins: [pinia],
      stubs: {
        ...quickAddDialogGlobal.stubs,
        QSelect: emittingSelectStub
      }
    },
    props: { directInput: 'QuickAddDocument' }
  })

  await flushPromises()

  const dialog = w.findComponent({ name: 'QDialog' })
  await dialog.vm.$emit('show')
  await flushPromises()

  expect(w.html()).toContain('Opt')

  const selects = w.findAll('.q-select-stub')
  expect(selects.length).toBe(1)
  await selects[0]!.trigger('focus')
  await flushPromises()
  await selects[0]!.trigger('click')
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
  expect(w.find('[data-test-locator="dialogQuickAddDocument-select-template"]').exists()).toBe(true)
  expect(
    w.find('[data-test-locator="dialogQuickAddDocument-select-template"]').attributes('popup-content-class')
  ).toBe('dialogQuickAddDocument__selectMenu')
  expect(
    w.find('[data-test-locator="dialogQuickAddDocument-select-template"]').attributes('use-input')
  ).toBeDefined()
  expect(
    w.find('[data-test-locator="dialogQuickAddDocument-select-template"]').attributes('menu-anchor')
  ).toBe('bottom middle')
  expect(
    w.find('[data-test-locator="dialogQuickAddDocument-select-template"]').attributes('menu-self')
  ).toBe('top middle')

  w.unmount()
})

/**
 * DialogQuickAddDocument
 * Multi-world: world select centers like template menu and shows separatorAlt between options.
 */
test('Test that DialogQuickAddDocument world select is centered and shows separatorAlt', async () => {
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

  const worldEmittingSelectStub = {
    template: `
      <div
        class="q-select-stub"
        v-bind="$attrs"
        @click="$emit('update:modelValue', 'world-2')"
      >
        <slot name="option" :opt="{ icon: 'mdi-earth', label: 'Earth', color: '#e91e63' }" :index="0" :itemProps="{}" />
        <slot name="option" :opt="{ icon: 'mdi-earth', label: 'Venus', color: '#3f51b5' }" :index="1" :itemProps="{}" />
        <slot name="selected-item" :opt="{ icon: 'mdi-earth', label: 'Earth', color: '#e91e63' }" />
      </div>
    `
  }

  const w = mount(DialogQuickAddDocument, {
    global: {
      mocks: { $t: (k: string) => k },
      plugins: [pinia],
      stubs: {
        ...quickAddDialogGlobal.stubs,
        QSelect: worldEmittingSelectStub
      }
    },
    props: { directInput: 'QuickAddDocument' }
  })

  await flushPromises()
  const dialog = w.findComponent({ name: 'QDialog' })
  await dialog.vm.$emit('show')
  await flushPromises()

  const worldSelect = w.find('[data-test-locator="dialogQuickAddDocument-select-world"]')
  expect(worldSelect.exists()).toBe(true)
  expect(worldSelect.attributes('menu-anchor')).toBe('bottom middle')
  expect(worldSelect.attributes('menu-self')).toBe('top middle')
  expect(w.find('[data-test-locator="dialogQuickAddDocument-world-separatorAlt-1"]').exists()).toBe(true)
  expect(w.find('[data-test-locator="dialogQuickAddDocument-template-separatorAlt-1"]').exists()).toBe(true)
  expect(w.find('[data-test-locator="dialogQuickAddDocument-world-option-0"]').exists()).toBe(true)
  expect(w.find('[data-test-locator="dialogQuickAddDocument-template-option-0"]').exists()).toBe(true)

  await worldSelect.trigger('click')
  await flushPromises()

  w.unmount()
})
