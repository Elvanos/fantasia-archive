import { computed, nextTick, ref, watch } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { expect, test, vi } from 'vitest'

import type { I_createUseDialogQuickAddDocumentDeps } from 'app/types/I_createUseDialogQuickAddDocument'
import type { I_dialogQuickAddDocumentTemplateSource } from 'app/types/I_dialogQuickAddDocument'
import type { I_dialogQuickAddDocumentWorldSource } from 'app/types/I_dialogQuickAddDocument'

import { runDialogQuickAddDocumentSession } from '../dialogQuickAddDocumentSessionWiring'
import { createUseDialogQuickAddDocument } from '../functions/createUseDialogQuickAddDocument'
import {
  buildDialogQuickAddDocumentTemplateOptions,
  buildDialogQuickAddDocumentWorldOptions,
  findDialogQuickAddDocumentWorldById,
  pickFirstDialogQuickAddDocumentWorldId
} from '../functions/dialogQuickAddDocumentOptions'
import {
  isDialogQuickAddDocumentDirectInput,
  isDialogQuickAddDocumentStoreTarget
} from '../functions/dialogQuickAddDocumentDialogInput'

function makeWorld (
  id: string,
  sortOrder: number,
  templateIds: string[]
): I_dialogQuickAddDocumentWorldSource {
  return {
    color: '#2196f3',
    displayNameTranslations: { 'en-US': id },
    id,
    sortOrder,
    templateLayout: {
      groups: [],
      placements: templateIds.map((documentTemplateId, index) => ({
        documentTemplateId,
        groupId: null,
        groupSortOrder: null,
        rootSortOrder: index
      }))
    }
  }
}

function makeTemplate (id: string, plural: string): I_dialogQuickAddDocumentTemplateSource {
  return {
    icon: `mdi-${id}`,
    id,
    titlePluralTranslations: { 'en-US': plural },
    titleSingularTranslations: { 'en-US': plural }
  }
}

function createDeps (overrides?: Partial<I_createUseDialogQuickAddDocumentDeps>): {
  createTemporaryDocument: ReturnType<typeof vi.fn>
  deps: I_createUseDialogQuickAddDocumentDeps
  showPopupCalls: { count: number }
} {
  const createTemporaryDocument = vi.fn(async () => 'temp-doc')
  const showPopupCalls = { count: 0 }
  const worlds = [
    makeWorld('world-b', 1, ['tpl-place']),
    makeWorld('world-a', 0, ['tpl-hero'])
  ]
  const templates = [
    makeTemplate('tpl-hero', 'Heroes'),
    makeTemplate('tpl-place', 'Places')
  ]
  const dialogStore = {
    dialogToOpen: 'QuickAddDocument' as const,
    dialogUUID: 'uuid-1'
  }
  const deps: I_createUseDialogQuickAddDocumentDeps = {
    buildTemplateOptions: buildDialogQuickAddDocumentTemplateOptions,
    buildWorldOptions: buildDialogQuickAddDocumentWorldOptions,
    computed,
    createTemporaryDocument,
    findWorldById: findDialogQuickAddDocumentWorldById,
    isDialogQuickAddDocumentDirectInput,
    isDialogQuickAddDocumentStoreTarget,
    loadQuickAddDocumentSources: async () => ({
      templates,
      worlds
    }),
    nextTick,
    onBeforeUnmount: () => undefined,
    onMounted: (hook) => {
      hook()
    },
    pickFirstWorldId: pickFirstDialogQuickAddDocumentWorldId,
    ref,
    registerComponentDialogStackGuard: vi.fn(),
    resolveDialogComponentStoreOrNull: () => dialogStore,
    resolveNewDocumentDisplayName: () => 'Heroes',
    resolvePreferredLanguageCode: () => 'en-US',
    resolveTemplateOptionLabel: (template) => {
      return template.titlePluralTranslations['en-US'] ?? template.id
    },
    resolveWorldOptionLabel: (translations) => translations['en-US'] ?? '',
    runDialogQuickAddDocumentSession,
    sleep: async () => undefined,
    templateFocusMs: 0,
    watch,
    ...overrides
  }
  return {
    createTemporaryDocument,
    deps,
    showPopupCalls
  }
}

/**
 * isDialogQuickAddDocumentDirectInput / isDialogQuickAddDocumentStoreTarget
 * Guard QuickAddDocument store and prop open paths.
 */
test('Test that dialogQuickAddDocumentDialogInput matchers accept only QuickAddDocument', () => {
  expect(isDialogQuickAddDocumentDirectInput('QuickAddDocument')).toBe(true)
  expect(isDialogQuickAddDocumentDirectInput('NewProject')).toBe(false)
  expect(isDialogQuickAddDocumentStoreTarget('QuickAddDocument')).toBe(true)
  expect(isDialogQuickAddDocumentStoreTarget('AboutFantasiaArchive')).toBe(false)
})

/**
 * createUseDialogQuickAddDocument
 * Opens via directInput, hydrates worlds, and creates a temporary document on template pick.
 */
test('Test that createUseDialogQuickAddDocument creates temporary document then closes', async () => {
  const { createTemporaryDocument, deps, showPopupCalls } = createDeps()
  const useDialog = createUseDialogQuickAddDocument(deps)
  const api = useDialog({ directInput: 'QuickAddDocument' })
  expect(api.dialogModel.value).toBe(true)

  api.templateSelectRef.value = {
    moveOptionSelection: () => undefined,
    setOptionIndex: () => undefined,
    showPopup: (): void => {
      showPopupCalls.count += 1
    }
  }
  api.onDialogShow()
  await flushPromises()

  expect(api.selectedWorldId.value).toBe('world-a')
  expect(api.showWorldSelect.value).toBe(true)
  expect(api.worldOptions.value.map((row) => row.value)).toEqual(['world-a', 'world-b'])
  expect(showPopupCalls.count).toBeGreaterThan(0)

  api.onTemplateFilter('', (fn, afterFn) => {
    fn()
    afterFn?.(api.templateSelectRef.value as never)
  })
  expect(api.filteredTemplateOptions.value.map((row) => row.value)).toEqual(['tpl-hero'])

  await api.onTemplateSelect('tpl-hero')
  expect(createTemporaryDocument).toHaveBeenCalledWith({
    displayName: 'Heroes',
    templateId: 'tpl-hero',
    worldId: 'world-a'
  })
  expect(api.dialogModel.value).toBe(false)
})

/**
 * createUseDialogQuickAddDocument
 * World change clears template and re-opens the template select after hydrate skip flag clears.
 */
test('Test that createUseDialogQuickAddDocument world change clears template and reopens popup', async () => {
  const { deps, showPopupCalls } = createDeps({
    onMounted: () => undefined
  })
  const useDialog = createUseDialogQuickAddDocument(deps)
  const api = useDialog({})
  api.dialogModel.value = true
  api.templateSelectRef.value = {
    moveOptionSelection: () => undefined,
    setOptionIndex: () => undefined,
    showPopup: (): void => {
      showPopupCalls.count += 1
    }
  }
  api.onDialogShow()
  await flushPromises()

  showPopupCalls.count = 0
  api.onWorldSelect('world-b')
  await flushPromises()

  expect(api.selectedWorldId.value).toBe('world-b')
  expect(api.selectedTemplateId.value).toBeNull()
  expect(showPopupCalls.count).toBeGreaterThan(0)
  api.onDialogHide()
  expect(api.selectedWorldId.value).toBeNull()
})
