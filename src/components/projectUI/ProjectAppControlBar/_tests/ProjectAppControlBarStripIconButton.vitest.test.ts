/* eslint-disable vue/one-component-per-file -- colocated Quasar stub components for Vue Test Utils mounts */

import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { expect, test, vi } from 'vitest'

import ProjectAppControlBarStripIconButton from '../ProjectAppControlBarStripIconButton.vue'

const qBtnStub = defineComponent({
  inheritAttrs: true,
  emits: ['click'],
  template: `
    <button type="button" class="q-btn-stub" v-bind="$attrs" @click="$emit('click', $event)">
      <slot />
    </button>
  `
})

const qTooltipStub = defineComponent({
  template: '<span class="q-tooltip-stub"><slot /></span>'
})

const cornerDotStub = defineComponent({
  props: {
    locator: {
      required: true,
      type: String
    },
    visible: {
      required: true,
      type: Boolean
    }
  },
  template: '<span class="corner-dot-stub" :data-test-locator="locator" :data-visible="String(visible)" />'
})

const mountGlobal = {
  stubs: {
    FaCornerContentDot: cornerDotStub,
    QBtn: qBtnStub,
    QTooltip: qTooltipStub
  }
}

/**
 * ProjectAppControlBarStripIconButton
 * Renders locator, tooltip, and keybind hint, then forwards click.
 */
test('Test that ProjectAppControlBarStripIconButton wires click tooltip and keybind hint', async () => {
  const onClick = vi.fn()
  const wrapper = mount(ProjectAppControlBarStripIconButton, {
    global: mountGlobal,
    props: {
      icon: 'mdi-page-layout-sidebar-left',
      keybindLabel: 'Ctrl + M',
      keybindTestLocator: 'projectAppControlBar-openProjectMediaButton-keybind',
      locator: 'projectAppControlBar-openProjectMediaButton',
      onClick,
      tooltip: 'Open project media'
    }
  })

  expect(wrapper.find('[data-test-locator="projectAppControlBar-openProjectMediaButton"]').exists()).toBe(true)
  expect(wrapper.text()).toContain('Open project media')
  expect(
    wrapper.find('[data-test-locator="projectAppControlBar-openProjectMediaButton-keybind"]').text()
  ).toBe('(Ctrl + M)')
  expect(wrapper.find('.corner-dot-stub').exists()).toBe(false)

  await wrapper.get('[data-test-locator="projectAppControlBar-openProjectMediaButton"]').trigger('click')
  expect(onClick).toHaveBeenCalledTimes(1)

  wrapper.unmount()
})

/**
 * ProjectAppControlBarStripIconButton
 * Optional content-dot locator renders visibility from contentDotVisible.
 */
test('Test that ProjectAppControlBarStripIconButton shows content dot when locator is set', () => {
  const wrapper = mount(ProjectAppControlBarStripIconButton, {
    global: mountGlobal,
    props: {
      buttonClass: 'projectAppControlBarFixedStripLeft__noteboardButton',
      contentDotLocator: 'projectAppControlBar-toggleAppNoteboardButton-contentDot',
      contentDotVisible: true,
      icon: 'mdi-clipboard-edit-outline',
      keybindLabel: null,
      keybindTestLocator: 'projectAppControlBar-toggleAppNoteboardButton-keybind',
      locator: 'projectAppControlBar-toggleAppNoteboardButton',
      onClick: vi.fn(),
      tooltip: 'Toggle app noteboard'
    }
  })

  expect(wrapper.classes()).toContain('projectAppControlBarFixedStripLeft__noteboardButton')
  expect(
    wrapper.find('[data-test-locator="projectAppControlBar-toggleAppNoteboardButton-contentDot"]').attributes('data-visible')
  ).toBe('true')
  expect(
    wrapper.find('[data-test-locator="projectAppControlBar-toggleAppNoteboardButton-keybind"]').exists()
  ).toBe(false)

  wrapper.unmount()

  const hiddenDot = mount(ProjectAppControlBarStripIconButton, {
    global: mountGlobal,
    props: {
      contentDotLocator: 'projectAppControlBar-toggleAppNoteboardButton-contentDot',
      contentDotVisible: false,
      icon: 'mdi-clipboard-edit-outline',
      keybindLabel: null,
      keybindTestLocator: 'projectAppControlBar-toggleAppNoteboardButton-keybind',
      locator: 'projectAppControlBar-toggleAppNoteboardButton',
      onClick: vi.fn(),
      tooltip: 'Toggle app noteboard'
    }
  })

  expect(
    hiddenDot.find('[data-test-locator="projectAppControlBar-toggleAppNoteboardButton-contentDot"]').attributes('data-visible')
  ).toBe('false')

  hiddenDot.unmount()
})
