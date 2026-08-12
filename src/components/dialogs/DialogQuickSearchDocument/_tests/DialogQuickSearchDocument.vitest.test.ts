/** @vitest-environment jsdom */
/* eslint-disable vue/one-component-per-file -- QDialog + FaSelectInput stubs colocated with mount helpers */
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { defineComponent } from 'vue'
import { beforeEach, expect, test, vi } from 'vitest'

import { S_DialogComponent } from 'app/src/stores/S_Dialog'
import { runFaAction } from 'app/src/scripts/actionManager/faActionManagerRun_manager'

import DialogQuickSearchDocument from '../DialogQuickSearchDocument.vue'
import { loadDialogQuickSearchDocumentSources } from '../scripts/dialogQuickSearchDocumentDataWiring'

const quickSearchQDialogStub = defineComponent({
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
    <div class="quick-search-qdialog-stub" v-bind="$attrs">
      <div v-if="modelValue" class="quick-search-qdialog-inner">
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
    selectionPresentation: {
      default: 'chips',
      type: String
    },
    testLocator: {
      type: String,
      required: true
    }
  },
  emits: ['update:modelValue', 'option-activate', 'option-auxclick'],
  template: `
    <div
      class="fa-select-input-stub"
      :data-test-locator="testLocator"
      :data-popup-content-class="popupContentClass"
      :data-selection-presentation="selectionPresentation"
    >
      <slot
        name="option-trailing"
        :opt="options[0] ?? { id: 'missing', name: 'missing' }"
      />
      <slot
        name="option-context-menu"
        :opt="options[0] ?? { id: 'missing', name: 'missing' }"
      />
      <button
        type="button"
        :data-test-locator="testLocator + '-emit-activate'"
        @click="$emit('option-activate', options[0] ?? null)"
      />
      <button
        type="button"
        :data-test-locator="testLocator + '-emit-model'"
        @click="$emit('update:modelValue', options[0] ?? null)"
      />
      <button
        type="button"
        :data-test-locator="testLocator + '-emit-auxclick'"
        @click="$emit('option-auxclick', options[0] ?? null, $event)"
      />
    </div>
  `
})

const quickSearchDialogGlobal = {
  mocks: { $t: (k: string) => k },
  stubs: {
    DialogQuickSearchDocumentOptionContextMenu: {
      props: {
        documentId: {
          default: '',
          type: String
        },
        onAddUnder: {
          type: Function,
          required: true
        },
        onCopyBackgroundColor: {
          type: Function,
          required: true
        },
        onCopyDocument: {
          type: Function,
          required: true
        },
        onCopyName: {
          type: Function,
          required: true
        },
        onCopyTextColor: {
          type: Function,
          required: true
        },
        onDelete: {
          type: Function,
          required: true
        },
        onEdit: {
          type: Function,
          required: true
        },
        onOpen: {
          type: Function,
          required: true
        }
      },
      template: `
        <div data-test-locator="dialogQuickSearchDocument-optionContextMenu" :data-document-id="documentId">
          <button type="button" data-test-locator="dialogQuickSearchDocument-optionContextMenu-open" @click="onOpen(documentId)" />
          <button type="button" data-test-locator="dialogQuickSearchDocument-optionContextMenu-edit" @click="onEdit(documentId)" />
          <button type="button" data-test-locator="dialogQuickSearchDocument-optionContextMenu-copy" @click="onCopyDocument(documentId)" />
          <button type="button" data-test-locator="dialogQuickSearchDocument-optionContextMenu-addUnder" @click="onAddUnder(documentId)" />
          <button type="button" data-test-locator="dialogQuickSearchDocument-optionContextMenu-copyName" @click="onCopyName(documentId)" />
          <button type="button" data-test-locator="dialogQuickSearchDocument-optionContextMenu-copyText" @click="onCopyTextColor(documentId)" />
          <button type="button" data-test-locator="dialogQuickSearchDocument-optionContextMenu-copyBg" @click="onCopyBackgroundColor(documentId)" />
          <button type="button" data-test-locator="dialogQuickSearchDocument-optionContextMenu-delete" @click="onDelete(documentId)" />
        </div>
      `
    },
    FaSelectInput: faSelectInputStub,
    QBtn: {
      props: {
        label: {
          default: '',
          type: String
        },
        icon: {
          default: '',
          type: String
        }
      },
      template: '<button type="button" v-bind="$attrs">{{ label }}<slot /></button>'
    },
    QCard: { template: '<div><slot /></div>' },
    QCardActions: { template: '<div><slot /></div>' },
    QCardSection: { template: '<div><slot /></div>' },
    QDialog: quickSearchQDialogStub,
    QTooltip: { template: '<span><slot /></span>' }
  }
} as const

vi.mock('../scripts/dialogQuickSearchDocumentDataWiring', () => {
  return {
    loadDialogQuickSearchDocumentDocumentsForWorld: vi.fn(async () => ([
      {
        displayName: 'Aria',
        documentTextColor: null,
        id: 'doc-a',
        isCategory: false,
        sortOrder: 0,
        templateId: 'tpl-hero'
      }
    ])),
    loadDialogQuickSearchDocumentSources: vi.fn(async () => ({
      templates: [{
        id: 'tpl-hero',
        icon: 'mdi-account'
      }],
      worlds: [
        {
          color: '#4caf50',
          displayNameTranslations: { 'en-US': 'Eldoria' },
          id: 'world-a',
          sortOrder: 0
        },
        {
          color: '#2196f3',
          displayNameTranslations: { 'en-US': 'Aurelion' },
          id: 'world-b',
          sortOrder: 1
        }
      ]
    })),
    readDialogQuickSearchDocumentDisableCloseAfterSelect: () => false,
    resolveDialogQuickSearchDocumentPreferredLanguageCode: () => 'en-US'
  }
})

vi.mock('app/src/scripts/projectDialogUiPref/projectDialogUiPref_manager', () => {
  return {
    pickFaProjectDialogLastSelectedWorldId: ({
      worlds,
      savedWorldId,
      pickFirstWorldId
    }: {
      worlds: ReadonlyArray<{ id: string }>
      savedWorldId: string | null
      pickFirstWorldId: (worlds: ReadonlyArray<{ id: string }>) => string | null
    }) => {
      if (savedWorldId !== null && worlds.some((world) => world.id === savedWorldId)) {
        return savedWorldId
      }
      return pickFirstWorldId(worlds)
    },
    readFaProjectLastSelectedWorldId: vi.fn(async () => null),
    writeFaProjectLastSelectedWorldId: vi.fn(async () => undefined)
  }
})

vi.mock('app/src/scripts/actionManager/faActionManagerRun_manager', () => {
  return {
    runFaAction: vi.fn()
  }
})

vi.mock('app/src/scripts/appGlobalManagementUI/appGlobalManagementUI_manager', () => {
  return {
    registerComponentDialogStackGuard: vi.fn()
  }
})

vi.mock('app/src/scripts/projectWorlds/faProjectWorldDisplayName_manager', () => {
  return {
    resolveFaProjectWorldDisplayName: (
      translations: Record<string, string>
    ) => translations['en-US'] ?? ''
  }
})

beforeEach(() => {
  setActivePinia(createPinia())
})

/**
 * DialogQuickSearchDocument
 * Opens via directInput and renders world + document selects with trailing action slot.
 */
test('Test that DialogQuickSearchDocument mounts with world and document selects', async () => {
  const w = mount(DialogQuickSearchDocument, {
    props: {
      directInput: 'QuickSearchDocument'
    },
    global: quickSearchDialogGlobal
  })
  await flushPromises()
  const dialog = w.findComponent({ name: 'QDialog' })
  await dialog.vm.$emit('show')
  await flushPromises()

  expect(w.find('[data-test-locator="dialogQuickSearchDocument-select-world"]').exists()).toBe(true)
  expect(w.find('[data-test-locator="dialogQuickSearchDocument-select-document"]').exists()).toBe(true)
  expect(w.find('[data-test-locator="dialogQuickSearchDocument-optionActions"]').exists()).toBe(true)
  expect(w.find('[data-test-locator="dialogQuickSearchDocument-optionContextMenu"]').exists()).toBe(true)
  expect(w.find('[data-test-locator="dialogQuickSearchDocument-button-close"]').exists()).toBe(true)
  w.unmount()
})

/**
 * DialogQuickSearchDocument
 * Store dialogUUID watch opens QuickSearchDocument target.
 */
test('Test that DialogQuickSearchDocument opens from dialog store target', async () => {
  const store = S_DialogComponent()
  const w = mount(DialogQuickSearchDocument, {
    global: quickSearchDialogGlobal
  })
  await flushPromises()
  store.dialogToOpen = 'QuickSearchDocument'
  store.dialogUUID = 'open-1'
  await flushPromises()
  expect(w.find('.quick-search-qdialog-inner').exists()).toBe(true)
  w.unmount()
})

/**
 * DialogQuickSearchDocument
 * Trailing edit / copy / add-under buttons and show/hide handlers run.
 */
test('Test that DialogQuickSearchDocument trailing actions and hide run', async () => {
  const w = mount(DialogQuickSearchDocument, {
    props: {
      directInput: 'QuickSearchDocument'
    },
    global: quickSearchDialogGlobal
  })
  await flushPromises()
  const dialog = w.findComponent({ name: 'QDialog' })
  await dialog.vm.$emit('show')
  await flushPromises()

  const editBtn = w.get('[data-test-locator="dialogQuickSearchDocument-optionAction-edit-doc-a"]')
  await editBtn.trigger('auxclick', {
    button: 1
  })
  expect(runFaAction).toHaveBeenCalledWith('editHierarchyTreeDocument', {
    documentId: 'doc-a',
    openMode: 'middleBackground'
  })
  await editBtn.trigger('click')
  expect(runFaAction).toHaveBeenCalledWith('editHierarchyTreeDocument', { documentId: 'doc-a' })

  const store = S_DialogComponent()
  store.dialogToOpen = 'QuickSearchDocument'
  store.dialogUUID = 'reopen-copy'
  await flushPromises()
  await dialog.vm.$emit('show')
  await flushPromises()
  const copyBtn = w.get('[data-test-locator="dialogQuickSearchDocument-optionAction-copy-doc-a"]')
  await copyBtn.trigger('auxclick', {
    button: 1
  })
  await copyBtn.trigger('click')
  expect(runFaAction).toHaveBeenCalledWith('copyHierarchyTreeDocument', { documentId: 'doc-a' })

  store.dialogUUID = 'reopen-add'
  await flushPromises()
  await dialog.vm.$emit('show')
  await flushPromises()
  const addBtn = w.get('[data-test-locator="dialogQuickSearchDocument-optionAction-addUnder-doc-a"]')
  await addBtn.trigger('auxclick', {
    button: 1
  })
  await addBtn.trigger('click')
  expect(runFaAction).toHaveBeenCalledWith('addHierarchyTreeChildDocument', { documentId: 'doc-a' })

  store.dialogUUID = 'reopen-actions-div'
  await flushPromises()
  await dialog.vm.$emit('show')
  await flushPromises()
  const actionsDiv = w.get('[data-test-locator="dialogQuickSearchDocument-optionActions"]')
  await actionsDiv.trigger('auxclick')
  await actionsDiv.trigger('click')
  await actionsDiv.trigger('mousedown')
  await actionsDiv.trigger('pointerdown')

  await dialog.vm.$emit('update:modelValue', false)
  await flushPromises()
  await dialog.vm.$emit('hide')
  await flushPromises()
  w.unmount()
})

/**
 * DialogQuickSearchDocument
 * Document / world FaSelectInput emits exercise select and auxclick handlers.
 */
test('Test that DialogQuickSearchDocument select emits open documents', async () => {
  const w = mount(DialogQuickSearchDocument, {
    props: {
      directInput: 'QuickSearchDocument'
    },
    global: quickSearchDialogGlobal
  })
  await flushPromises()
  const dialog = w.findComponent({ name: 'QDialog' })
  await dialog.vm.$emit('show')
  await flushPromises()

  await w.get('[data-test-locator="dialogQuickSearchDocument-select-world-emit-activate"]').trigger('click')
  await flushPromises()
  await w.get('[data-test-locator="dialogQuickSearchDocument-select-document-emit-auxclick"]').trigger('click')
  await flushPromises()
  await w.get('[data-test-locator="dialogQuickSearchDocument-select-document-emit-model"]').trigger('click')
  await flushPromises()
  expect(runFaAction).toHaveBeenCalled()
  w.unmount()
})

/**
 * DialogQuickSearchDocument
 * Option context menu stub buttons invoke hierarchy action handlers.
 */
test('Test that DialogQuickSearchDocument context menu stub buttons run actions', async () => {
  const w = mount(DialogQuickSearchDocument, {
    props: {
      directInput: 'QuickSearchDocument'
    },
    global: quickSearchDialogGlobal
  })
  await flushPromises()
  const dialog = w.findComponent({ name: 'QDialog' })
  const store = S_DialogComponent()
  const reopen = async (uuid: string): Promise<void> => {
    store.dialogToOpen = 'QuickSearchDocument'
    store.dialogUUID = uuid
    await flushPromises()
    await dialog.vm.$emit('show')
    await flushPromises()
  }

  await dialog.vm.$emit('show')
  await flushPromises()
  await w.get('[data-test-locator="dialogQuickSearchDocument-optionContextMenu-open"]').trigger('click')
  await reopen('ctx-edit')
  await w.get('[data-test-locator="dialogQuickSearchDocument-optionContextMenu-edit"]').trigger('click')
  await reopen('ctx-copy')
  await w.get('[data-test-locator="dialogQuickSearchDocument-optionContextMenu-copy"]').trigger('click')
  await reopen('ctx-add')
  await w.get('[data-test-locator="dialogQuickSearchDocument-optionContextMenu-addUnder"]').trigger('click')
  await reopen('ctx-copy-name')
  await w.get('[data-test-locator="dialogQuickSearchDocument-optionContextMenu-copyName"]').trigger('click')
  await reopen('ctx-copy-text')
  await w.get('[data-test-locator="dialogQuickSearchDocument-optionContextMenu-copyText"]').trigger('click')
  await reopen('ctx-copy-bg')
  await w.get('[data-test-locator="dialogQuickSearchDocument-optionContextMenu-copyBg"]').trigger('click')
  await reopen('ctx-delete')
  await w.get('[data-test-locator="dialogQuickSearchDocument-optionContextMenu-delete"]').trigger('click')
  expect(runFaAction).toHaveBeenCalled()
  w.unmount()
})

/**
 * DialogQuickSearchDocument
 * directInput prop watch opens after mount when set to QuickSearchDocument.
 */
test('Test that DialogQuickSearchDocument reacts to directInput prop after mount', async () => {
  const w = mount(DialogQuickSearchDocument, {
    global: quickSearchDialogGlobal
  })
  await flushPromises()
  await w.setProps({ directInput: 'QuickSearchDocument' })
  await flushPromises()
  expect(w.find('.quick-search-qdialog-inner').exists()).toBe(true)
  expect(w.text()).toContain('dialogs.quickSearchDocument.title')
  w.unmount()
})

/**
 * DialogQuickSearchDocument
 * World select stays hidden when the project has only one world.
 */
test('Test that DialogQuickSearchDocument hides world select for a single world', async () => {
  vi.mocked(loadDialogQuickSearchDocumentSources).mockResolvedValueOnce({
    templates: [{
      id: 'tpl-hero',
      icon: 'mdi-account'
    }],
    worlds: [{
      color: '#4caf50',
      displayNameTranslations: { 'en-US': 'Only' },
      id: 'world-a',
      sortOrder: 0
    }]
  })
  const w = mount(DialogQuickSearchDocument, {
    props: {
      directInput: 'QuickSearchDocument'
    },
    global: quickSearchDialogGlobal
  })
  await flushPromises()
  const dialog = w.findComponent({ name: 'QDialog' })
  await dialog.vm.$emit('show')
  await flushPromises()
  expect(w.find('[data-test-locator="dialogQuickSearchDocument-select-world"]').exists()).toBe(false)
  expect(w.find('[data-test-locator="dialogQuickSearchDocument-select-document"]').exists()).toBe(true)
  w.unmount()
})
