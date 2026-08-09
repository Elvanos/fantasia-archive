import { mount } from '@vue/test-utils'
import { expect, test, vi } from 'vitest'

import ProjectHierarchyTreeNodeContextMenuDocumentRows from '../ProjectHierarchyTreeNodeContextMenuDocumentRows.vue'

test('Test that ProjectHierarchyTreeNodeContextMenuDocumentRows delegates document row clicks', async () => {
  const onAddNewDocumentUnderThisClick = vi.fn()
  const onCopyDocumentClick = vi.fn()
  const onEditDocumentClick = vi.fn()
  const onOpenDocumentClick = vi.fn()

  const wrapper = mount(ProjectHierarchyTreeNodeContextMenuDocumentRows, {
    props: {
      addNewDocumentUnderThisLabel: 'Add new document under this',
      copyDocumentLabel: 'Copy document',
      editDocumentLabel: 'Edit document',
      onAddNewDocumentUnderThisClick,
      onCopyDocumentClick,
      onEditDocumentClick,
      onOpenDocumentClick,
      openDocumentLabel: 'Open document'
    },
    global: {
      stubs: {
        QIcon: { template: '<span />' },
        QItem: {
          emits: ['click'],
          template: '<div @click="$emit(\'click\', $event)"><slot /></div>'
        },
        QItemSection: { template: '<div><slot /></div>' },
        QSeparator: { template: '<hr />' }
      }
    }
  })

  await wrapper.get('[data-test-locator="projectHierarchyTree-nodeContextMenu-openDocument"]').trigger('click')
  await wrapper.get('[data-test-locator="projectHierarchyTree-nodeContextMenu-editDocument"]').trigger('click')
  await wrapper.get('[data-test-locator="projectHierarchyTree-nodeContextMenu-copyDocument"]').trigger('click')
  await wrapper.get('[data-test-locator="projectHierarchyTree-nodeContextMenu-addNewDocumentUnderThis"]').trigger('click')

  expect(onOpenDocumentClick).toHaveBeenCalled()
  expect(onEditDocumentClick).toHaveBeenCalled()
  expect(onCopyDocumentClick).toHaveBeenCalled()
  expect(onAddNewDocumentUnderThisClick).toHaveBeenCalled()

  wrapper.unmount()
})

/**
 * ProjectHierarchyTreeNodeContextMenuDocumentRows
 * Last-opened style: copy + add-under only (no open/edit rows).
 */
test('Test that ProjectHierarchyTreeNodeContextMenuDocumentRows can hide open and edit rows', () => {
  const wrapper = mount(ProjectHierarchyTreeNodeContextMenuDocumentRows, {
    props: {
      addNewDocumentUnderThisLabel: 'Add new document under this',
      copyDocumentLabel: 'Copy document',
      editDocumentLabel: 'Edit document',
      onAddNewDocumentUnderThisClick: vi.fn(),
      onCopyDocumentClick: vi.fn(),
      onEditDocumentClick: vi.fn(),
      onOpenDocumentClick: vi.fn(),
      openDocumentLabel: 'Open document',
      showsOpenEdit: false
    },
    global: {
      stubs: {
        QIcon: { template: '<span />' },
        QItem: {
          emits: ['click'],
          template: '<div @click="$emit(\'click\', $event)"><slot /></div>'
        },
        QItemSection: { template: '<div><slot /></div>' },
        QSeparator: { template: '<hr />' }
      }
    }
  })

  expect(wrapper.find('[data-test-locator="projectHierarchyTree-nodeContextMenu-openDocument"]').exists())
    .toBe(false)
  expect(wrapper.find('[data-test-locator="projectHierarchyTree-nodeContextMenu-editDocument"]').exists())
    .toBe(false)
  expect(wrapper.find('[data-test-locator="projectHierarchyTree-nodeContextMenu-copyDocument"]').exists())
    .toBe(true)
  expect(
    wrapper.find('[data-test-locator="projectHierarchyTree-nodeContextMenu-addNewDocumentUnderThis"]').exists()
  ).toBe(true)

  wrapper.unmount()
})
