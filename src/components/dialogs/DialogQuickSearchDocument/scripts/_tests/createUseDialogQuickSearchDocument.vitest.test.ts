import { computed, nextTick, ref, watch } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { expect, test, vi } from 'vitest'

import type { I_createUseDialogQuickSearchDocumentDeps } from 'app/types/I_createUseDialogQuickSearchDocument'
import type { I_dialogQuickSearchDocumentDocumentSource } from 'app/types/I_dialogQuickSearchDocument'
import type { I_dialogQuickSearchDocumentWorldSource } from 'app/types/I_dialogQuickSearchDocument'

import { runDialogQuickSearchDocumentSession } from '../dialogQuickSearchDocumentSessionWiring'
import { createUseDialogQuickSearchDocument } from '../functions/createUseDialogQuickSearchDocument'
import {
  buildDialogQuickSearchDocumentDocumentOptions,
  buildDialogQuickSearchDocumentWorldOptions,
  pickFirstDialogQuickSearchDocumentWorldId,
  resolveDialogQuickSearchDocumentOptionIcon
} from '../functions/dialogQuickSearchDocumentOptions'
import {
  isDialogQuickSearchDocumentDirectInput,
  isDialogQuickSearchDocumentStoreTarget
} from '../functions/dialogQuickSearchDocumentDialogInput'
import { pickFaProjectDialogLastSelectedWorldId } from 'app/src/scripts/projectDialogUiPref/projectDialogUiPref_manager'

function makeWorld (id: string, sortOrder: number): I_dialogQuickSearchDocumentWorldSource {
  return {
    color: '#2196f3',
    displayNameTranslations: { 'en-US': id },
    id,
    sortOrder
  }
}

function makeDocument (
  id: string,
  displayName: string,
  isCategory = false
): I_dialogQuickSearchDocumentDocumentSource {
  return {
    displayName,
    documentTextColor: null,
    id,
    isCategory,
    sortOrder: 0,
    templateId: isCategory ? null : 'tpl-hero'
  }
}

function createDeps (overrides?: Partial<I_createUseDialogQuickSearchDocumentDeps>): {
  deps: I_createUseDialogQuickSearchDocumentDeps
  readDisableCloseAfterSelectQuickSearch: ReturnType<typeof vi.fn>
  runFaAction: ReturnType<typeof vi.fn>
  writeLastSelectedWorldId: ReturnType<typeof vi.fn>
} {
  const worlds = [
    makeWorld('world-b', 1),
    makeWorld('world-a', 0)
  ]
  const documentsByWorld: Record<string, I_dialogQuickSearchDocumentDocumentSource[]> = {
    'world-a': [
      makeDocument('doc-a', 'Aria'),
      makeDocument('cat-a', 'Category A', true)
    ],
    'world-b': [makeDocument('doc-b', 'Boris')]
  }
  const runFaAction = vi.fn()
  const writeLastSelectedWorldId = vi.fn(async () => undefined)
  const readDisableCloseAfterSelectQuickSearch = vi.fn(() => false)
  const dialogStore = {
    dialogToOpen: 'QuickSearchDocument' as const,
    dialogUUID: 'uuid-1'
  }
  const deps: I_createUseDialogQuickSearchDocumentDeps = {
    buildDocumentOptions: buildDialogQuickSearchDocumentDocumentOptions,
    buildWorldOptions: buildDialogQuickSearchDocumentWorldOptions,
    computed,
    documentFocusMs: 0,
    isDialogQuickSearchDocumentDirectInput,
    isDialogQuickSearchDocumentStoreTarget,
    loadDocumentsForWorld: async (worldId) => documentsByWorld[worldId] ?? [],
    loadQuickSearchDocumentSources: async () => ({
      templates: [{
        id: 'tpl-hero',
        icon: 'mdi-account'
      }],
      worlds
    }),
    nextTick,
    onBeforeUnmount: () => undefined,
    onMounted: (hook) => {
      hook()
    },
    pickFirstWorldId: pickFirstDialogQuickSearchDocumentWorldId,
    pickWorldIdWithSavedPreference: pickFaProjectDialogLastSelectedWorldId,
    readDisableCloseAfterSelectQuickSearch,
    readLastSelectedWorldId: async () => null,
    ref,
    registerComponentDialogStackGuard: vi.fn(),
    resolveDialogComponentStoreOrNull: () => dialogStore,
    resolveDocumentOptionIcon: resolveDialogQuickSearchDocumentOptionIcon,
    resolvePreferredLanguageCode: () => 'en-US',
    resolveWorldOptionLabel: (translations) => translations['en-US'] ?? '',
    runDialogQuickSearchDocumentSession,
    runFaAction,
    sleep: async () => undefined,
    watch,
    writeLastSelectedWorldId,
    ...overrides
  }
  return {
    deps,
    readDisableCloseAfterSelectQuickSearch,
    runFaAction,
    writeLastSelectedWorldId
  }
}

/**
 * isDialogQuickSearchDocumentDirectInput / isDialogQuickSearchDocumentStoreTarget
 */
test('Test that dialogQuickSearchDocumentDialogInput matchers accept only QuickSearchDocument', () => {
  expect(isDialogQuickSearchDocumentDirectInput('QuickSearchDocument')).toBe(true)
  expect(isDialogQuickSearchDocumentDirectInput('QuickAddDocument')).toBe(false)
  expect(isDialogQuickSearchDocumentStoreTarget('QuickSearchDocument')).toBe(true)
  expect(isDialogQuickSearchDocumentStoreTarget('AboutFantasiaArchive')).toBe(false)
})

/**
 * createUseDialogQuickSearchDocument
 * Hydrates saved world, opens document on select, closes unless stay-open flag.
 */
test('Test that createUseDialogQuickSearchDocument opens document and closes by default', async () => {
  const { deps, runFaAction } = createDeps({
    readLastSelectedWorldId: async () => 'world-b'
  })
  const useDialog = createUseDialogQuickSearchDocument(deps)
  const api = useDialog({ directInput: 'QuickSearchDocument' })
  await flushPromises()

  expect(api.dialogModel.value).toBe(true)
  expect(api.selectedWorldId.value).toBe('world-b')
  expect(api.showWorldSelect.value).toBe(true)
  expect(api.documentOptions.value).toEqual([])

  api.documentSelectRef.value = {
    openPopup: (): void => undefined
  }
  api.onDialogShow()
  await flushPromises()

  expect(api.documentOptions.value.map((row) => row.id)).toEqual(['doc-b'])

  api.onDocumentSelect({
    id: 'doc-b',
    name: 'Boris'
  })
  await flushPromises()

  expect(runFaAction).toHaveBeenCalledWith('openHierarchyTreeDocument', { documentId: 'doc-b' })
  expect(api.dialogModel.value).toBe(false)
})

/**
 * createUseDialogQuickSearchDocument
 * disableCloseAfterSelectQuickSearch keeps dialog open and opens in middleBackground
 * (append tab, no active switch / route). activateOnly keeps menu/filter (no restore).
 */
test('Test that createUseDialogQuickSearchDocument stays open when disableCloseAfterSelectQuickSearch', async () => {
  const { deps, readDisableCloseAfterSelectQuickSearch, runFaAction } = createDeps({
    onMounted: () => undefined
  })
  readDisableCloseAfterSelectQuickSearch.mockReturnValue(true)
  const useDialog = createUseDialogQuickSearchDocument(deps)
  const api = useDialog({})
  api.dialogModel.value = true
  api.documentSelectRef.value = {
    openPopup: (): void => undefined
  }
  api.onDialogShow()
  await flushPromises()

  api.onDocumentSelect({
    id: 'doc-a',
    name: 'Aria'
  })
  await flushPromises()

  expect(runFaAction).toHaveBeenCalledWith('openHierarchyTreeDocument', {
    documentId: 'doc-a',
    openMode: 'middleBackground'
  })
  expect(api.dialogModel.value).toBe(true)
  expect(api.selectedDocumentId.value).toBeNull()
  expect(api.documentSelectActivateOnly.value).toBe(true)
})

/**
 * createUseDialogQuickSearchDocument
 * Trailing Edit / Copy / Add under left-click close then run matching actions;
 * middle-click runs actions while keeping the dialog open.
 */
test('Test that createUseDialogQuickSearchDocument trailing actions close on left click', async () => {
  const { deps, runFaAction } = createDeps({
    onMounted: () => undefined
  })
  const useDialog = createUseDialogQuickSearchDocument(deps)
  const api = useDialog({})
  api.dialogModel.value = true
  const leftClick = new MouseEvent('click', {
    button: 0
  })

  api.onDocumentEditClick('doc-a', leftClick)
  expect(api.dialogModel.value).toBe(false)
  expect(runFaAction).toHaveBeenCalledWith('editHierarchyTreeDocument', { documentId: 'doc-a' })

  api.dialogModel.value = true
  api.onDocumentCopyClick('doc-a', leftClick)
  expect(api.dialogModel.value).toBe(false)
  expect(runFaAction).toHaveBeenCalledWith('copyHierarchyTreeDocument', { documentId: 'doc-a' })

  api.dialogModel.value = true
  api.onDocumentAddUnderClick('doc-a', leftClick)
  expect(api.dialogModel.value).toBe(false)
  expect(runFaAction).toHaveBeenCalledWith('addHierarchyTreeChildDocument', { documentId: 'doc-a' })
})

/**
 * createUseDialogQuickSearchDocument
 * Middle-click trailing actions keep the dialog open so more results can be opened.
 */
test('Test that createUseDialogQuickSearchDocument trailing middle-click keeps dialog open', async () => {
  const { deps, runFaAction } = createDeps({
    onMounted: () => undefined
  })
  const useDialog = createUseDialogQuickSearchDocument(deps)
  const api = useDialog({})
  api.dialogModel.value = true
  const middleAux = new MouseEvent('auxclick', {
    button: 1
  })

  api.onDocumentEditClick('doc-a', middleAux)
  expect(api.dialogModel.value).toBe(true)
  expect(runFaAction).toHaveBeenCalledWith('editHierarchyTreeDocument', {
    documentId: 'doc-a',
    openMode: 'middleBackground'
  })

  api.onDocumentCopyClick('doc-a', middleAux)
  expect(api.dialogModel.value).toBe(true)
  expect(runFaAction).toHaveBeenCalledWith('copyHierarchyTreeDocument', {
    documentId: 'doc-a',
    openMode: 'middleBackground'
  })

  api.onDocumentAddUnderClick('doc-a', middleAux)
  expect(api.dialogModel.value).toBe(true)
  expect(runFaAction).toHaveBeenCalledWith('addHierarchyTreeChildDocument', {
    documentId: 'doc-a',
    openMode: 'middleBackground'
  })
})

/**
 * createUseDialogQuickSearchDocument
 * Non-middle auxclick on trailing actions is ignored.
 */
test('Test that createUseDialogQuickSearchDocument trailing auxclick ignores non-middle buttons', async () => {
  const { deps, runFaAction } = createDeps({
    onMounted: () => undefined
  })
  const useDialog = createUseDialogQuickSearchDocument(deps)
  const api = useDialog({})
  api.dialogModel.value = true
  const rightAux = new MouseEvent('auxclick', {
    button: 2
  })

  api.onDocumentEditClick('doc-a', rightAux)
  expect(api.dialogModel.value).toBe(true)
  expect(runFaAction).not.toHaveBeenCalled()
})

/**
 * createUseDialogQuickSearchDocument
 * Option context menu always closes dialog then runs the matching hierarchy action.
 */
test('Test that createUseDialogQuickSearchDocument context menu closes then runs actions', async () => {
  const { deps, runFaAction } = createDeps({
    onMounted: () => undefined
  })
  const useDialog = createUseDialogQuickSearchDocument(deps)
  const api = useDialog({})

  api.dialogModel.value = true
  api.onDocumentContextCopyName('doc-a')
  expect(api.dialogModel.value).toBe(false)
  expect(runFaAction).toHaveBeenCalledWith('copyHierarchyTreeDocumentName', { documentId: 'doc-a' })

  api.dialogModel.value = true
  api.onDocumentContextCopyTextColor('doc-a')
  expect(api.dialogModel.value).toBe(false)
  expect(runFaAction).toHaveBeenCalledWith('copyHierarchyTreeDocumentTextColor', { documentId: 'doc-a' })

  api.dialogModel.value = true
  api.onDocumentContextCopyBackgroundColor('doc-a')
  expect(api.dialogModel.value).toBe(false)
  expect(runFaAction).toHaveBeenCalledWith('copyHierarchyTreeDocumentBackgroundColor', { documentId: 'doc-a' })

  api.dialogModel.value = true
  api.onDocumentContextOpen('doc-a')
  expect(api.dialogModel.value).toBe(false)
  expect(runFaAction).toHaveBeenCalledWith('openHierarchyTreeDocument', { documentId: 'doc-a' })

  api.dialogModel.value = true
  api.onDocumentContextEdit('doc-a')
  expect(api.dialogModel.value).toBe(false)
  expect(runFaAction).toHaveBeenCalledWith('editHierarchyTreeDocument', { documentId: 'doc-a' })

  api.dialogModel.value = true
  api.onDocumentContextCopyDocument('doc-a')
  expect(api.dialogModel.value).toBe(false)
  expect(runFaAction).toHaveBeenCalledWith('copyHierarchyTreeDocument', { documentId: 'doc-a' })

  api.dialogModel.value = true
  api.onDocumentContextAddUnder('doc-a')
  expect(api.dialogModel.value).toBe(false)
  expect(runFaAction).toHaveBeenCalledWith('addHierarchyTreeChildDocument', { documentId: 'doc-a' })

  api.dialogModel.value = true
  api.onDocumentContextDelete('doc-a')
  expect(api.dialogModel.value).toBe(false)
  expect(runFaAction).toHaveBeenCalledWith('deleteHierarchyTreeDocument', { documentId: 'doc-a' })
})

/**
 * createUseDialogQuickSearchDocument
 * Option-row middle-click opens preview in middleBackground and keeps dialog open.
 */
test('Test that createUseDialogQuickSearchDocument option middle-click opens preview in background', async () => {
  const { deps, runFaAction } = createDeps({
    onMounted: () => undefined
  })
  const useDialog = createUseDialogQuickSearchDocument(deps)
  const api = useDialog({})
  api.dialogModel.value = true
  const middleAux = new MouseEvent('auxclick', {
    button: 1
  })

  api.onDocumentOptionAuxClick({
    id: 'doc-a',
    name: 'Aria'
  }, middleAux)

  expect(api.dialogModel.value).toBe(true)
  expect(runFaAction).toHaveBeenCalledWith('openHierarchyTreeDocument', {
    documentId: 'doc-a',
    openMode: 'middleBackground'
  })
})

/**
 * createUseDialogQuickSearchDocument
 * Non-middle option auxclick is ignored.
 */
test('Test that createUseDialogQuickSearchDocument option auxclick ignores non-middle buttons', async () => {
  const { deps, runFaAction } = createDeps({
    onMounted: () => undefined
  })
  const useDialog = createUseDialogQuickSearchDocument(deps)
  const api = useDialog({})
  api.dialogModel.value = true
  const rightAux = new MouseEvent('auxclick', {
    button: 2
  })

  api.onDocumentOptionAuxClick({
    id: 'doc-a',
    name: 'Aria'
  }, rightAux)

  expect(api.dialogModel.value).toBe(true)
  expect(runFaAction).not.toHaveBeenCalled()
})

/**
 * createUseDialogQuickSearchDocument
 * World change persists last world and reloads documents.
 */
test('Test that createUseDialogQuickSearchDocument world change persists and reloads documents', async () => {
  const { deps, writeLastSelectedWorldId } = createDeps({
    onMounted: () => undefined
  })
  const useDialog = createUseDialogQuickSearchDocument(deps)
  const api = useDialog({})
  api.dialogModel.value = true
  api.onDialogShow()
  await flushPromises()

  api.onWorldSelect({
    id: 'world-b',
    name: 'world-b'
  })
  await flushPromises()

  expect(writeLastSelectedWorldId).toHaveBeenCalledWith('world-b')
  expect(api.selectedWorldId.value).toBe('world-b')
  expect(api.documentOptions.value.map((row) => row.id)).toEqual(['doc-b'])
  api.onDialogHide()
  expect(api.selectedWorldId.value).toBeNull()
})

/**
 * createUseDialogQuickSearchDocument
 * selectedWorldOption / selectedDocumentOption stay null without ids or unknown ids;
 * bindDocumentSelectRef stores FaSelectInput expose.
 */
test('Test that createUseDialogQuickSearchDocument selected options and bindDocumentSelectRef', async () => {
  const { deps } = createDeps({
    onMounted: () => undefined
  })
  const useDialog = createUseDialogQuickSearchDocument(deps)
  const api = useDialog({})

  expect(api.selectedWorldOption.value).toBeNull()
  expect(api.selectedDocumentOption.value).toBeNull()

  api.dialogModel.value = true
  api.documentSelectRef.value = {
    openPopup: (): void => undefined
  }
  api.onDialogShow()
  await flushPromises()

  expect(api.selectedWorldOption.value?.id).toBe('world-a')
  expect(api.documentOptions.value.map((row) => row.id)).toContain('doc-a')
  api.selectedDocumentId.value = 'doc-a'
  expect(api.selectedDocumentOption.value?.id).toBe('doc-a')

  api.selectedWorldId.value = 'missing-world'
  expect(api.selectedWorldOption.value).toBeNull()
  api.selectedDocumentId.value = 'missing-doc'
  expect(api.selectedDocumentOption.value).toBeNull()

  const openPopup = vi.fn()
  api.bindDocumentSelectRef({
    openPopup
  })
  expect(api.documentSelectRef.value?.openPopup).toBe(openPopup)
  api.bindDocumentSelectRef(null)
  expect(api.documentSelectRef.value).toBeNull()
})
