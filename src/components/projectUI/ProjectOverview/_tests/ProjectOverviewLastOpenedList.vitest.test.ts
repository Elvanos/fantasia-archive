/** @vitest-environment jsdom */
import { mount } from '@vue/test-utils'
import { expect, test, vi } from 'vitest'

import ProjectOverviewLastOpenedList from '../ProjectOverviewLastOpenedList.vue'

vi.mock(
  'app/src/components/projectUI/ProjectAppControlBar/ProjectAppControlBarTabWorldIndicator.vue',
  () => {
    return {
      default: {
        name: 'WorldIndicatorStub',
        template: '<i data-test-locator="world-indicator-stub" />'
      }
    }
  }
)

vi.mock(
  'app/src/components/projectUI/ProjectHierarchyTree/ProjectHierarchyTreeNodeContextMenuCopyRows.vue',
  () => {
    return {
      default: {
        name: 'CopyRowsStub',
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
          <div data-test-locator="copy-rows-stub">
            <button type="button" data-test-locator="copy-name" @click="onCopyNameClick()" />
            <button type="button" data-test-locator="copy-bg" @click="onCopyBackgroundColorClick()" />
            <button type="button" data-test-locator="copy-text" @click="onCopyTextColorClick()" />
          </div>
        `
      }
    }
  }
)

vi.mock(
  'app/src/components/projectUI/ProjectHierarchyTree/ProjectHierarchyTreeNodeContextMenuDocumentRows.vue',
  () => {
    return {
      default: {
        name: 'DocumentRowsStub',
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
          <div data-test-locator="document-rows-stub">
            <button type="button" data-test-locator="add-under" @click="onAddNewDocumentUnderThisClick()" />
            <button type="button" data-test-locator="copy-doc" @click="onCopyDocumentClick()" />
            <button type="button" data-test-locator="open-doc" @click="onOpenDocumentClick()" />
            <button type="button" data-test-locator="edit-doc" @click="onEditDocumentClick()" />
          </div>
        `
      }
    }
  }
)

vi.mock(
  'app/src/components/projectUI/ProjectHierarchyTree/ProjectHierarchyTreeNodeContextMenuDeleteRow.vue',
  () => {
    return {
      default: {
        name: 'DeleteRowStub',
        props: {
          onDeleteDocumentClick: {
            type: Function,
            required: true
          }
        },
        template: `
          <button
            type="button"
            data-test-locator="projectHierarchyTree-nodeContextMenu-deleteDocument"
            @click="onDeleteDocumentClick()"
          />
        `
      }
    }
  }
)

const quasarStubs = {
  'q-card': { template: '<div><slot /></div>' },
  'q-card-section': { template: '<div><slot /></div>' },
  'q-list': { template: '<div><slot /></div>' },
  'q-item': {
    template: '<div class="q-item" v-bind="$attrs" @click="$attrs.onClick"><slot /></div>'
  },
  'q-item-section': { template: '<div><slot /></div>' },
  'q-item-label': { template: '<div><slot /></div>' },
  'q-icon': {
    props: {
      name: {
        type: String,
        default: ''
      }
    },
    template: '<i :data-icon="name" />'
  },
  'q-menu': { template: '<div><slot /></div>' },
  'q-separator': { template: '<hr />' }
} as const

/**
 * ProjectOverviewLastOpenedList
 * Renders last-opened rows and fires row click handlers.
 */
test('Test that ProjectOverviewLastOpenedList renders items and handles row click', async () => {
  const onRowClick = vi.fn()

  const wrapper = mount(ProjectOverviewLastOpenedList, {
    global: {
      mocks: {
        $t: (key: string) => key
      },
      stubs: quasarStubs
    },
    props: {
      items: [{
        displayName: 'Hero',
        documentBackgroundColor: null,
        documentId: 'doc-1',
        documentTextColor: null,
        isCategory: false,
        isDead: false,
        openedAtMs: 1,
        templateIcon: 'mdi-account',
        templateId: 't1',
        worldId: 'w1'
      }],
      onContextAddUnder: vi.fn(),
      onContextCopyBackgroundColor: vi.fn(),
      onContextCopyDocument: vi.fn(),
      onContextCopyName: vi.fn(),
      onContextCopyTextColor: vi.fn(),
      onContextDelete: vi.fn(),
      onContextEdit: vi.fn(),
      onContextOpen: vi.fn(),
      onRowAuxClick: vi.fn(),
      onRowClick,
      resolveItemChromeStyle: () => undefined,
      resolveWorldIndicatorColor: () => null,
      showWorldIndicators: false
    }
  })

  expect(wrapper.find('[data-test-locator=projectOverview-lastOpened]').exists()).toBe(true)
  expect(wrapper.find('[data-test-locator="projectOverview-lastOpenedItem-doc-1"]').exists()).toBe(true)
  await wrapper.find('[data-test-locator="projectOverview-lastOpenedItem-doc-1"]').trigger('click')
  expect(onRowClick).toHaveBeenCalledWith('doc-1')

  wrapper.unmount()
})

/**
 * ProjectOverviewLastOpenedList
 * Middle-click (auxclick) forwards to onRowAuxClick.
 */
test('Test that ProjectOverviewLastOpenedList forwards middle-click auxclick', async () => {
  const onRowAuxClick = vi.fn()

  const wrapper = mount(ProjectOverviewLastOpenedList, {
    global: {
      mocks: {
        $t: (key: string) => key
      },
      stubs: quasarStubs
    },
    props: {
      items: [{
        displayName: 'Hero',
        documentBackgroundColor: null,
        documentId: 'doc-1',
        documentTextColor: null,
        isCategory: false,
        isDead: false,
        openedAtMs: 1,
        templateIcon: 'mdi-account',
        templateId: 't1',
        worldId: 'w1'
      }],
      onContextAddUnder: vi.fn(),
      onContextCopyBackgroundColor: vi.fn(),
      onContextCopyDocument: vi.fn(),
      onContextCopyName: vi.fn(),
      onContextCopyTextColor: vi.fn(),
      onContextDelete: vi.fn(),
      onContextEdit: vi.fn(),
      onContextOpen: vi.fn(),
      onRowAuxClick,
      onRowClick: vi.fn(),
      resolveItemChromeStyle: () => undefined,
      resolveWorldIndicatorColor: () => null,
      showWorldIndicators: false
    }
  })

  await wrapper.find('[data-test-locator="projectOverview-lastOpenedItem-doc-1"]')
    .trigger('auxclick', { button: 1 })
  expect(onRowAuxClick).toHaveBeenCalledWith('doc-1', expect.any(Event))

  wrapper.unmount()
})

/**
 * ProjectOverviewLastOpenedList
 * Covers dead/category icons, world indicators, and context menu action props.
 */
test('Test that ProjectOverviewLastOpenedList covers dead category world and context branches', async () => {
  const onContextAddUnder = vi.fn()
  const onContextCopyBackgroundColor = vi.fn()
  const onContextCopyDocument = vi.fn()
  const onContextCopyName = vi.fn()
  const onContextCopyTextColor = vi.fn()
  const onContextDelete = vi.fn()
  const onContextEdit = vi.fn()
  const onContextOpen = vi.fn()

  const wrapper = mount(ProjectOverviewLastOpenedList, {
    global: {
      mocks: {
        $t: (key: string) => key
      },
      stubs: quasarStubs
    },
    props: {
      items: [
        {
          displayName: 'Dead Folder',
          documentBackgroundColor: '#000',
          documentId: 'doc-dead',
          documentTextColor: '#fff',
          isCategory: true,
          isDead: true,
          openedAtMs: 1,
          templateIcon: '',
          templateId: 't1',
          worldId: 'w1'
        },
        {
          displayName: 'Plain Doc',
          documentBackgroundColor: null,
          documentId: 'doc-plain',
          documentTextColor: null,
          isCategory: false,
          isDead: false,
          openedAtMs: 2,
          templateIcon: '',
          templateId: 't2',
          worldId: 'w2'
        }
      ],
      onContextAddUnder,
      onContextCopyBackgroundColor,
      onContextCopyDocument,
      onContextCopyName,
      onContextCopyTextColor,
      onContextDelete,
      onContextEdit,
      onContextOpen,
      onRowAuxClick: vi.fn(),
      onRowClick: vi.fn(),
      resolveItemChromeStyle: () => ({
        backgroundColor: '#000',
        color: '#fff'
      }),
      resolveWorldIndicatorColor: () => '#abcdef',
      showWorldIndicators: true
    }
  })

  expect(wrapper.findAll('[data-test-locator="world-indicator-stub"]').length).toBe(2)
  expect(wrapper.text()).toContain('†')
  expect(wrapper.find('[data-icon="mdi-folder-open"]').exists()).toBe(true)
  expect(wrapper.find('[data-icon="mdi-file-outline"]').exists()).toBe(true)

  await wrapper.findAll('[data-test-locator="copy-name"]')[0]!.trigger('click')
  await wrapper.findAll('[data-test-locator="copy-bg"]')[0]!.trigger('click')
  await wrapper.findAll('[data-test-locator="copy-text"]')[0]!.trigger('click')
  await wrapper.findAll('[data-test-locator="add-under"]')[0]!.trigger('click')
  await wrapper.findAll('[data-test-locator="copy-doc"]')[0]!.trigger('click')
  await wrapper.findAll('[data-test-locator="open-doc"]')[0]!.trigger('click')
  await wrapper.findAll('[data-test-locator="edit-doc"]')[0]!.trigger('click')
  await wrapper.findAll('[data-test-locator="projectHierarchyTree-nodeContextMenu-deleteDocument"]')[0]!
    .trigger('click')

  expect(onContextCopyName).toHaveBeenCalledWith('doc-dead')
  expect(onContextCopyBackgroundColor).toHaveBeenCalledWith('doc-dead')
  expect(onContextCopyTextColor).toHaveBeenCalledWith('doc-dead')
  expect(onContextAddUnder).toHaveBeenCalledWith('doc-dead')
  expect(onContextCopyDocument).toHaveBeenCalledWith('doc-dead')
  expect(onContextOpen).toHaveBeenCalledWith('doc-dead')
  expect(onContextEdit).toHaveBeenCalledWith('doc-dead')
  expect(onContextDelete).toHaveBeenCalledWith('doc-dead')

  wrapper.unmount()
})
