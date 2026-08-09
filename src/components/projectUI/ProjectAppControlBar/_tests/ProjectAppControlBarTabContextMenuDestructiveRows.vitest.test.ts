import { mount } from '@vue/test-utils'
import { expect, test, vi } from 'vitest'

import ProjectAppControlBarTabContextMenuDestructiveRows from '../ProjectAppControlBarTabContextMenuDestructiveRows.vue'

const menuStubs = {
  QIcon: { template: '<span />' },
  QItem: {
    emits: ['click'],
    template: '<div v-bind="$attrs" @click="$emit(\'click\', $event)"><slot /></div>'
  },
  QItemSection: { template: '<div><slot /></div>' },
  QSeparator: {
    inheritAttrs: false,
    template: '<hr v-bind="$attrs" />'
  }
}

test('Test that ProjectAppControlBarTabContextMenuDestructiveRows shows force-close then delete with primary-bright dividers', async () => {
  const onDeleteThisDocumentClick = vi.fn()
  const onForceCloseAllTabsClick = vi.fn()
  const onForceCloseAllTabsExceptThisOneClick = vi.fn()

  const wrapper = mount(ProjectAppControlBarTabContextMenuDestructiveRows, {
    props: {
      deleteThisDocumentLabel: 'Delete this document',
      forceCloseAllTabsExceptThisOneLabel: 'Force close all except this one',
      forceCloseAllTabsLabel: 'Force close all tabs',
      onDeleteThisDocumentClick,
      onForceCloseAllTabsClick,
      onForceCloseAllTabsExceptThisOneClick,
      showDeleteThisDocument: true
    },
    global: {
      stubs: menuStubs
    }
  })

  const forceExcept = wrapper.get(
    '[data-test-locator="projectAppControlBar-tabContextMenu-forceCloseAllTabsExceptThisOne"]'
  )
  const forceAll = wrapper.get('[data-test-locator="projectAppControlBar-tabContextMenu-forceCloseAllTabs"]')
  const deleteRow = wrapper.get('[data-test-locator="projectAppControlBar-tabContextMenu-deleteThisDocument"]')

  expect(forceExcept.classes()).toContain('text-secondary')
  expect(forceAll.classes()).toContain('text-secondary')
  expect(deleteRow.classes()).toContain('text-secondary')
  expect(forceExcept.element.previousElementSibling?.classList.contains(
    'projectAppControlBarTabContextMenu__separatorPrimaryBright'
  )).toBe(true)
  expect(deleteRow.element.previousElementSibling?.classList.contains(
    'projectAppControlBarTabContextMenu__separatorPrimaryBright'
  )).toBe(true)
  expect(
    forceExcept.element.compareDocumentPosition(deleteRow.element) & Node.DOCUMENT_POSITION_FOLLOWING
  ).toBeTruthy()

  await forceExcept.trigger('click')
  await forceAll.trigger('click')
  await deleteRow.trigger('click')

  expect(onForceCloseAllTabsExceptThisOneClick).toHaveBeenCalled()
  expect(onForceCloseAllTabsClick).toHaveBeenCalled()
  expect(onDeleteThisDocumentClick).toHaveBeenCalled()

  wrapper.unmount()
})

test('Test that ProjectAppControlBarTabContextMenuDestructiveRows hides delete row when showDeleteThisDocument is false', () => {
  const wrapper = mount(ProjectAppControlBarTabContextMenuDestructiveRows, {
    props: {
      deleteThisDocumentLabel: 'Delete this document',
      forceCloseAllTabsExceptThisOneLabel: 'Force close all except this one',
      forceCloseAllTabsLabel: 'Force close all tabs',
      onDeleteThisDocumentClick: vi.fn(),
      onForceCloseAllTabsClick: vi.fn(),
      onForceCloseAllTabsExceptThisOneClick: vi.fn(),
      showDeleteThisDocument: false
    },
    global: {
      stubs: menuStubs
    }
  })

  expect(wrapper.find('[data-test-locator="projectAppControlBar-tabContextMenu-deleteThisDocument"]').exists()).toBe(false)
  const forceExcept = wrapper.get(
    '[data-test-locator="projectAppControlBar-tabContextMenu-forceCloseAllTabsExceptThisOne"]'
  )
  expect(forceExcept.element.previousElementSibling?.classList.contains(
    'projectAppControlBarTabContextMenu__separatorPrimaryBright'
  )).toBe(true)
  wrapper.unmount()
})
