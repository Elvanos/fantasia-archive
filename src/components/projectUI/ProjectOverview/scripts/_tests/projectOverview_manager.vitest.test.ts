/* eslint-disable vue/one-component-per-file -- harness components for manager wiring tests */

import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, expect, test, vi } from 'vitest'
import { defineComponent, h } from 'vue'

vi.mock('app/i18n/externalFileLoader', () => {
  return {
    i18n: {
      global: {
        t: (key: string) => key
      }
    }
  }
})

vi.mock('../projectOverviewPickRandomTipWiring', () => {
  return {
    pickProjectOverviewRandomTipCaption: () => 'Manager-wired tip.'
  }
})

vi.mock('app/src/scripts/actionManager/faActionManagerRun_manager', () => {
  return {
    runFaAction: vi.fn(),
    runFaActionAwait: vi.fn(async () => undefined)
  }
})

const listDocumentDistributionMock = vi.fn(async () => {
  return {
    counts: [],
    templates: [],
    documentTemplateTotalCount: 0,
    totalDocumentCount: 0,
    worlds: []
  }
})
const listDocumentLastOpenedMock = vi.fn(async () => {
  return { items: [] }
})

beforeEach(() => {
  setActivePinia(createPinia())
  listDocumentDistributionMock.mockClear()
  listDocumentLastOpenedMock.mockClear()
  Object.defineProperty(window, 'faContentBridgeAPIs', {
    configurable: true,
    value: {
      projectContent: {
        listDocumentDistribution: listDocumentDistributionMock,
        listDocumentLastOpened: listDocumentLastOpenedMock
      }
    }
  })
})

import { S_FaActiveProject } from 'app/src/stores/S_FaActiveProject'
import { useProjectOverview } from '../projectOverview_manager'

/**
 * useProjectOverview
 * Manager wiring exposes active project display name and loads a tip on mount.
 */
test('Test that useProjectOverview from the manager reads Pinia and loads a tip', async () => {
  S_FaActiveProject().setActiveProject({
    name: 'Wired Project',
    filePath: 'C:\\fixture.faproject',
    id: 'fixture-id'
  })

  const Harness = defineComponent({
    name: 'ProjectOverviewManagerHarness',
    setup () {
      const state = useProjectOverview()

      return () => h('div', {
        'data-test-locator': 'manager-harness',
        'data-project-name': state.projectDisplayName.value,
        'data-tip-caption': state.randomTipCaption.value
      })
    }
  })

  const wrapper = mount(Harness)

  await wrapper.vm.$nextTick()
  await Promise.resolve()

  expect(wrapper.attributes('data-project-name')).toBe('Wired Project')
  expect(wrapper.attributes('data-tip-caption')).toBe('Manager-wired tip.')
  expect(listDocumentDistributionMock).toHaveBeenCalled()
  expect(listDocumentLastOpenedMock).toHaveBeenCalled()

  wrapper.unmount()
})

/**
 * useProjectOverview
 * Uses the no-project i18n label when Pinia has no active project.
 */
test('Test that useProjectOverview from the manager falls back to the no-project label', async () => {
  const Harness = defineComponent({
    name: 'ProjectOverviewManagerHarnessNoProject',
    setup () {
      const state = useProjectOverview()

      return () => h('div', {
        'data-test-locator': 'manager-harness',
        'data-project-name': state.projectDisplayName.value
      })
    }
  })

  const wrapper = mount(Harness)

  await wrapper.vm.$nextTick()

  expect(wrapper.attributes('data-project-name')).toBe(
    'projectUI.projectOverview.noActiveProjectName'
  )

  wrapper.unmount()
})
