/** @vitest-environment jsdom */
import { mount } from '@vue/test-utils'
import { expect, test, vi } from 'vitest'

import DialogQuickSearchDocumentOptionContextMenu from '../DialogQuickSearchDocumentOptionContextMenu.vue'

/**
 * DialogQuickSearchDocumentOptionContextMenu
 * Delegates copy / document / delete row clicks to the injected handlers.
 */
test('Test that DialogQuickSearchDocumentOptionContextMenu delegates row clicks', async () => {
  const onAddUnder = vi.fn()
  const onCopyBackgroundColor = vi.fn()
  const onCopyDocument = vi.fn()
  const onCopyName = vi.fn()
  const onCopyTextColor = vi.fn()
  const onDelete = vi.fn()
  const onEdit = vi.fn()
  const onOpen = vi.fn()

  const wrapper = mount(DialogQuickSearchDocumentOptionContextMenu, {
    props: {
      documentId: 'doc-a',
      onAddUnder,
      onCopyBackgroundColor,
      onCopyDocument,
      onCopyName,
      onCopyTextColor,
      onDelete,
      onEdit,
      onOpen
    },
    global: {
      mocks: {
        $t: (key: string) => key
      },
      stubs: {
        ProjectHierarchyTreeNodeContextMenuCopyRows: {
          props: {
            onCopyBackgroundColorClick: {
              type: Function,
              required: true
            },
            onCopyNameClick: {
              type: Function,
              required: true
            },
            onCopyTextColorClick: {
              type: Function,
              required: true
            }
          },
          template: `
            <div>
              <button data-test-locator="copy-name" @click="onCopyNameClick()" />
              <button data-test-locator="copy-text" @click="onCopyTextColorClick()" />
              <button data-test-locator="copy-bg" @click="onCopyBackgroundColorClick()" />
            </div>
          `
        },
        ProjectHierarchyTreeNodeContextMenuDeleteRow: {
          props: {
            onDeleteDocumentClick: {
              type: Function,
              required: true
            }
          },
          template: '<button data-test-locator="delete" @click="onDeleteDocumentClick()" />'
        },
        ProjectHierarchyTreeNodeContextMenuDocumentRows: {
          props: {
            onAddNewDocumentUnderThisClick: {
              type: Function,
              required: true
            },
            onCopyDocumentClick: {
              type: Function,
              required: true
            },
            onEditDocumentClick: {
              type: Function,
              required: true
            },
            onOpenDocumentClick: {
              type: Function,
              required: true
            }
          },
          template: `
            <div>
              <button data-test-locator="open" @click="onOpenDocumentClick()" />
              <button data-test-locator="edit" @click="onEditDocumentClick()" />
              <button data-test-locator="copy-doc" @click="onCopyDocumentClick()" />
              <button data-test-locator="add-under" @click="onAddNewDocumentUnderThisClick()" />
            </div>
          `
        },
        QList: { template: '<div><slot /></div>' },
        QMenu: { template: '<div data-test-locator="dialogQuickSearchDocument-optionContextMenu"><slot /></div>' },
        QSeparator: { template: '<hr />' }
      }
    }
  })

  expect(wrapper.find('[data-test-locator="dialogQuickSearchDocument-optionContextMenu"]').exists())
    .toBe(true)

  await wrapper.get('[data-test-locator="copy-name"]').trigger('click')
  await wrapper.get('[data-test-locator="copy-text"]').trigger('click')
  await wrapper.get('[data-test-locator="copy-bg"]').trigger('click')
  await wrapper.get('[data-test-locator="open"]').trigger('click')
  await wrapper.get('[data-test-locator="edit"]').trigger('click')
  await wrapper.get('[data-test-locator="copy-doc"]').trigger('click')
  await wrapper.get('[data-test-locator="add-under"]').trigger('click')
  await wrapper.get('[data-test-locator="delete"]').trigger('click')

  expect(onCopyName).toHaveBeenCalledWith('doc-a')
  expect(onCopyTextColor).toHaveBeenCalledWith('doc-a')
  expect(onCopyBackgroundColor).toHaveBeenCalledWith('doc-a')
  expect(onOpen).toHaveBeenCalledWith('doc-a')
  expect(onEdit).toHaveBeenCalledWith('doc-a')
  expect(onCopyDocument).toHaveBeenCalledWith('doc-a')
  expect(onAddUnder).toHaveBeenCalledWith('doc-a')
  expect(onDelete).toHaveBeenCalledWith('doc-a')

  wrapper.unmount()
})
