/* eslint-disable vue/one-component-per-file -- colocated Quasar stub components for Vue Test Utils mounts */

import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { defineComponent } from 'vue'
import { beforeEach, expect, test, vi } from 'vitest'

import * as dialogStores from 'app/src/stores/S_Dialog'
import { S_DialogComponent } from 'app/src/stores/S_Dialog'

import DialogProjectMedia from '../DialogProjectMedia.vue'
import DialogProjectMediaPanelsColumn from '../DialogProjectMediaPanelsColumn.vue'

const projectMediaQDialogStub = defineComponent({
  name: 'QDialog',
  inheritAttrs: false,
  props: {
    modelValue: {
      default: false,
      type: Boolean
    },
    persistent: {
      default: false,
      type: Boolean
    }
  },
  emits: ['update:modelValue', 'hide'],
  template: `
    <div
      class="project-media-qdialog-stub"
      :data-persistent="String(persistent)"
    >
      <div v-if="modelValue" class="project-media-qdialog-inner">
        <slot />
      </div>
    </div>
  `
})

const projectMediaQInputStub = defineComponent({
  inheritAttrs: true,
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
})

const projectMediaDialogGlobal = {
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
    QDialog: projectMediaQDialogStub,
    QIcon: { template: '<i><slot /></i>' },
    QInput: projectMediaQInputStub,
    QSeparator: { template: '<div class="q-separator-stub" v-bind="$attrs"></div>' },
    QTabPanel: { template: '<div class="q-tab-panel-stub"><slot /></div>' },
    QTabPanels: { template: '<div class="q-tab-panels-stub"><slot /></div>' }
  }
} as const

beforeEach(() => {
  vi.restoreAllMocks()
})

/**
 * DialogProjectMedia
 * directInput should open the shell and surface i18n title, search, and close keys.
 */
test('Test that DialogProjectMedia renders shell for ProjectMedia input', async () => {
  const w = mount(DialogProjectMedia, {
    global: projectMediaDialogGlobal,
    props: { directInput: 'ProjectMedia' }
  })

  await flushPromises()

  expect(w.html()).toContain('dialogComponent')
  expect(w.html()).toContain('ProjectMedia')
  expect(w.text()).toContain('dialogs.projectMedia.title')
  expect(w.text()).toContain('dialogs.projectMedia.closeButton')
  expect(w.find('[data-test-locator="dialogProjectMedia-search"]').exists()).toBe(true)
  expect(w.find('.project-media-qdialog-stub').attributes('data-persistent')).toBe('true')
  expect(w.getComponent(DialogProjectMediaPanelsColumn).props('selectedPanel')).toBe('mediaList')
  expect(w.find('[data-test-locator="dialogProjectMedia-panelTitle-mediaList"]').exists()).toBe(true)
  const searchInput = w.get('[data-test-locator="dialogProjectMedia-search"] input')
  await searchInput.setValue('needle')
  await flushPromises()
  expect((searchInput.element as HTMLInputElement).value).toBe('needle')
  await w.get('[data-test-locator="dialogProjectMedia-button-close"]').trigger('click')
  w.unmount()
})

/**
 * DialogProjectMedia
 * Component dialog store UUID changes should open when dialogToOpen matches.
 */
test('Test that DialogProjectMedia opens from S_DialogComponent UUID watch', async () => {
  const pinia = createPinia()
  setActivePinia(pinia)
  const st = S_DialogComponent()

  const w = mount(DialogProjectMedia, {
    global: {
      ...projectMediaDialogGlobal,
      plugins: [pinia]
    }
  })

  await flushPromises()

  st.dialogToOpen = 'ProjectMedia'
  st.generateDialogUUID()
  await flushPromises()

  expect(w.find('.project-media-qdialog-inner').exists()).toBe(true)
  expect(w.text()).toContain('dialogs.projectMedia.title')
  w.unmount()
})

/**
 * DialogProjectMedia
 * directInput watch should open only when the prop becomes ProjectMedia.
 */
test('Test that DialogProjectMedia reacts to directInput prop after mount', async () => {
  const w = mount(DialogProjectMedia, {
    global: projectMediaDialogGlobal
  })

  await flushPromises()

  await w.setProps({ directInput: 'ProjectMedia' })
  await flushPromises()

  expect(w.text()).toContain('dialogs.projectMedia.title')
  w.unmount()
})

/**
 * DialogProjectMedia
 * resolveDialogComponentStore should swallow failures after registerComponentDialogStackGuard captured a store instance.
 */
test('Test that DialogProjectMedia tolerates S_DialogComponent throwing from resolve helper', async () => {
  const pinia = createPinia()
  setActivePinia(pinia)
  const orig = dialogStores.S_DialogComponent
  let calls = 0
  vi.spyOn(dialogStores, 'S_DialogComponent').mockImplementation(() => {
    calls += 1
    if (calls === 1) {
      return orig()
    }
    throw new Error('component dialog store unavailable')
  })

  const w = mount(DialogProjectMedia, {
    global: projectMediaDialogGlobal,
    props: { directInput: 'ProjectMedia' }
  })

  await flushPromises()
  w.unmount()
})

/**
 * DialogProjectMedia
 * Root q-dialog should accept v-model updates from the dialog shell.
 */
test('Test that DialogProjectMedia forwards q-dialog v-model updates', async () => {
  const w = mount(DialogProjectMedia, {
    global: projectMediaDialogGlobal,
    props: { directInput: 'ProjectMedia' }
  })

  await flushPromises()

  const dlg = w.findComponent({ name: 'QDialog' })
  await dlg.vm.$emit('update:modelValue', false)
  await flushPromises()

  expect(w.find('.project-media-qdialog-inner').exists()).toBe(false)
  w.unmount()
})

/**
 * DialogProjectMedia
 * Store UUID watch should ignore dialogToOpen values other than ProjectMedia.
 */
test('Test that DialogProjectMedia store watch skips non-project-media dialogToOpen', async () => {
  const pinia = createPinia()
  setActivePinia(pinia)
  const st = S_DialogComponent()

  const w = mount(DialogProjectMedia, {
    global: {
      ...projectMediaDialogGlobal,
      plugins: [pinia]
    }
  })

  await flushPromises()

  st.dialogToOpen = 'AppSettings'
  st.generateDialogUUID()
  await flushPromises()

  expect(w.find('.project-media-qdialog-inner').exists()).toBe(false)
  w.unmount()
})

/**
 * DialogProjectMedia
 * directInput watch should ignore values other than ProjectMedia.
 */
test('Test that DialogProjectMedia directInput watch skips other dialog names', async () => {
  const w = mount(DialogProjectMedia, {
    global: projectMediaDialogGlobal
  })

  await flushPromises()

  await w.setProps({ directInput: 'AppSettings' })
  await flushPromises()

  expect(w.find('.project-media-qdialog-inner').exists()).toBe(false)
  w.unmount()
})

/**
 * DialogProjectMedia
 * directInput watch should no-op when the prop becomes undefined.
 */
test('Test that DialogProjectMedia directInput watch handles undefined', async () => {
  const w = mount(DialogProjectMedia, {
    global: projectMediaDialogGlobal,
    props: { directInput: 'ProjectMedia' }
  })

  await flushPromises()

  await w.setProps({ directInput: undefined })
  await flushPromises()

  w.unmount()
})

/**
 * DialogProjectMedia
 * initialPanel prop wins over the store requested panel on open.
 */
test('Test that DialogProjectMedia initialPanel prop selects the add panel', async () => {
  const pinia = createPinia()
  setActivePinia(pinia)
  S_DialogComponent().projectMediaRequestedPanel = 'mediaMassEdit'

  const w = mount(DialogProjectMedia, {
    global: {
      ...projectMediaDialogGlobal,
      plugins: [pinia]
    },
    props: {
      directInput: 'ProjectMedia',
      initialPanel: 'mediaAdd'
    }
  })

  await flushPromises()

  expect(w.getComponent(DialogProjectMediaPanelsColumn).props('selectedPanel')).toBe('mediaAdd')
  expect(w.find('[data-test-locator="dialogProjectMedia-addDropZone"]').exists()).toBe(true)
  expect(w.find('[data-test-locator="dialogProjectMedia-addOfflineMediaButton"]').exists()).toBe(true)
  expect(w.find('[data-test-locator="dialogProjectMedia-addOnlineMediaButton"]').exists()).toBe(true)
  w.unmount()
})

/**
 * DialogProjectMedia
 * Live store panel changes switch the slide while the dialog stays open.
 */
test('Test that DialogProjectMedia switches panel from projectMediaRequestedPanel while open', async () => {
  const pinia = createPinia()
  setActivePinia(pinia)
  const st = S_DialogComponent()

  const w = mount(DialogProjectMedia, {
    global: {
      ...projectMediaDialogGlobal,
      plugins: [pinia]
    },
    props: { directInput: 'ProjectMedia' }
  })

  await flushPromises()

  expect(w.getComponent(DialogProjectMediaPanelsColumn).props('selectedPanel')).toBe('mediaList')
  st.projectMediaRequestedPanel = 'mediaSingleEdit'
  await flushPromises()
  expect(w.getComponent(DialogProjectMediaPanelsColumn).props('selectedPanel')).toBe(
    'mediaSingleEdit'
  )
  w.unmount()
})
