import { expect, test, vi } from 'vitest'
import { nextTick, ref } from 'vue'

import type { I_createUseDialogQuickSearchDocumentDeps } from 'app/types/I_createUseDialogQuickSearchDocument'
import type { I_dialogQuickSearchDocumentFaSelectInputLike } from 'app/types/I_createUseDialogQuickSearchDocument'
import type {
  I_dialogQuickSearchDocumentDocumentSource,
  I_dialogQuickSearchDocumentWorldSource
} from 'app/types/I_dialogQuickSearchDocument'

import {
  bindDialogQuickSearchDocumentSelectRef,
  cancelDialogQuickSearchDocumentFocus,
  focusDialogQuickSearchDocumentSelectAfterShow,
  hydrateDialogQuickSearchDocumentDocuments,
  hydrateDialogQuickSearchDocumentSources,
  isDialogQuickSearchDocumentFaSelectInputLike,
  scheduleDialogQuickSearchDocumentFocus
} from '../dialogQuickSearchDocumentFocusHydrateWiring'

function makeSelect (
  overrides?: Partial<I_dialogQuickSearchDocumentFaSelectInputLike>
): I_dialogQuickSearchDocumentFaSelectInputLike {
  return {
    openPopup: vi.fn(),
    ...overrides
  }
}

function makeDeps (
  overrides?: Partial<I_createUseDialogQuickSearchDocumentDeps>
): I_createUseDialogQuickSearchDocumentDeps {
  return {
    buildDocumentOptions: () => [],
    buildWorldOptions: () => [],
    computed: (() => ({ value: [] })) as never,
    documentFocusMs: 0,
    isDialogQuickSearchDocumentDirectInput: () => false,
    isDialogQuickSearchDocumentStoreTarget: () => false,
    loadDocumentsForWorld: async () => [],
    loadQuickSearchDocumentSources: async () => ({
      templates: [],
      worlds: []
    }),
    nextTick,
    onBeforeUnmount: () => undefined,
    onMounted: () => undefined,
    pickFirstWorldId: () => null,
    pickWorldIdWithSavedPreference: ({ pickFirstWorldId, worlds }) => pickFirstWorldId(worlds),
    readDisableCloseAfterSelectQuickSearch: () => false,
    readLastSelectedWorldId: async () => null,
    ref,
    registerComponentDialogStackGuard: vi.fn(),
    resolveDialogComponentStoreOrNull: () => null,
    resolveDocumentOptionIcon: () => 'mdi-file-outline',
    resolvePreferredLanguageCode: () => 'en-US',
    resolveWorldOptionLabel: () => 'World',
    runDialogQuickSearchDocumentSession: () => ({} as never),
    runFaAction: vi.fn(),
    sleep: async () => undefined,
    watch: () => undefined,
    writeLastSelectedWorldId: async () => undefined,
    ...overrides
  }
}

/**
 * isDialogQuickSearchDocumentFaSelectInputLike / bindDialogQuickSearchDocumentSelectRef
 */
test('Test that FaSelectInput-like guard and bindDocumentSelectRef work', () => {
  const documentSelectRef = ref<I_dialogQuickSearchDocumentFaSelectInputLike | null>(null)
  expect(isDialogQuickSearchDocumentFaSelectInputLike(null)).toBe(false)
  expect(isDialogQuickSearchDocumentFaSelectInputLike('not-an-object')).toBe(false)
  expect(isDialogQuickSearchDocumentFaSelectInputLike({ showPopup: () => undefined })).toBe(false)
  const select = makeSelect()
  expect(isDialogQuickSearchDocumentFaSelectInputLike(select)).toBe(true)
  bindDialogQuickSearchDocumentSelectRef(documentSelectRef, { nope: true })
  expect(documentSelectRef.value).toBeNull()
  bindDialogQuickSearchDocumentSelectRef(documentSelectRef, select)
  expect(documentSelectRef.value?.openPopup).toBe(select.openPopup)
})

/**
 * focusDialogQuickSearchDocumentSelectAfterShow
 * Opens popup via FaSelectInput openPopup after FA 1.0 timing.
 */
test('Test that focusDialogQuickSearchDocumentSelectAfterShow calls openPopup', async () => {
  const select = makeSelect()
  const session = {
    dialogModel: ref(true),
    documentSelectRef: ref<I_dialogQuickSearchDocumentFaSelectInputLike | null>(select),
    focusGeneration: ref(1)
  }
  await focusDialogQuickSearchDocumentSelectAfterShow(makeDeps(), session, 1)
  expect(select.openPopup).toHaveBeenCalledTimes(1)
})

/**
 * focusDialogQuickSearchDocumentSelectAfterShow
 * Cancels when generation bumps before open.
 */
test('Test that focusDialogQuickSearchDocumentSelectAfterShow skips after mid-open cancel', async () => {
  const select = makeSelect()
  const session = {
    dialogModel: ref(true),
    documentSelectRef: ref<I_dialogQuickSearchDocumentFaSelectInputLike | null>(select),
    focusGeneration: ref(1)
  }
  const deps = makeDeps({
    sleep: async () => {
      session.focusGeneration.value = 2
    }
  })
  await focusDialogQuickSearchDocumentSelectAfterShow(deps, session, 1)
  expect(select.openPopup).not.toHaveBeenCalled()
})

/**
 * focusDialogQuickSearchDocumentSelectAfterShow
 * Skips when dialog closed or select missing.
 */
test('Test that focusDialogQuickSearchDocumentSelectAfterShow skips when dialog closed', async () => {
  const select = makeSelect()
  const session = {
    dialogModel: ref(false),
    documentSelectRef: ref<I_dialogQuickSearchDocumentFaSelectInputLike | null>(select),
    focusGeneration: ref(1)
  }
  await focusDialogQuickSearchDocumentSelectAfterShow(makeDeps(), session, 1)
  expect(select.openPopup).not.toHaveBeenCalled()
})

/**
 * focusDialogQuickSearchDocumentSelectAfterShow
 * Skips when document select ref is not FaSelectInput-like.
 */
test('Test that focusDialogQuickSearchDocumentSelectAfterShow skips without select expose', async () => {
  const session = {
    dialogModel: ref(true),
    documentSelectRef: ref<I_dialogQuickSearchDocumentFaSelectInputLike | null>(null),
    focusGeneration: ref(1)
  }
  await focusDialogQuickSearchDocumentSelectAfterShow(makeDeps(), session, 1)
})

/**
 * scheduleDialogQuickSearchDocumentFocus / cancelDialogQuickSearchDocumentFocus
 */
test('Test that schedule and cancel bump focus generation', async () => {
  const select = makeSelect()
  const session = {
    dialogModel: ref(true),
    documentSelectRef: ref<I_dialogQuickSearchDocumentFaSelectInputLike | null>(select),
    focusGeneration: ref(0)
  }
  const generation = scheduleDialogQuickSearchDocumentFocus(makeDeps(), session)
  expect(generation).toBe(1)
  cancelDialogQuickSearchDocumentFocus(session)
  expect(session.focusGeneration.value).toBe(2)
  await nextTick()
})

/**
 * hydrateDialogQuickSearchDocumentDocuments
 * Clears documents when no world is selected.
 */
test('Test that hydrateDialogQuickSearchDocumentDocuments clears without world id', async () => {
  const documents = ref([{
    displayName: 'Old',
    documentTextColor: null,
    id: 'doc-old',
    isCategory: false,
    sortOrder: 0,
    templateId: null
  }])
  await hydrateDialogQuickSearchDocumentDocuments(makeDeps(), {
    documents,
    selectedWorldId: ref(null)
  })
  expect(documents.value).toEqual([])

  documents.value = [{
    displayName: 'Old',
    documentTextColor: null,
    id: 'doc-old',
    isCategory: false,
    sortOrder: 0,
    templateId: null
  }]
  await hydrateDialogQuickSearchDocumentDocuments(makeDeps(), {
    documents,
    selectedWorldId: ref('')
  })
  expect(documents.value).toEqual([])
})

/**
 * hydrateDialogQuickSearchDocumentSources
 * Seeds worlds, templates, and documents for the picked world.
 */
test('Test that hydrateDialogQuickSearchDocumentSources seeds worlds then documents', async () => {
  const selectedDocumentId = ref<string | null>('old-doc')
  const selectedWorldId = ref<string | null>(null)
  const templateIconsById = ref(new Map<string, { icon: string, id: string }>())
  const worlds = ref<I_dialogQuickSearchDocumentWorldSource[]>([])
  const documents = ref<I_dialogQuickSearchDocumentDocumentSource[]>([])
  const deps = makeDeps({
    loadDocumentsForWorld: async () => [{
      displayName: 'Aria',
      documentTextColor: null,
      id: 'doc-a',
      isCategory: false,
      sortOrder: 0,
      templateId: 'tpl-hero'
    }],
    loadQuickSearchDocumentSources: async () => ({
      templates: [{
        icon: 'mdi-account',
        id: 'tpl-hero'
      }],
      worlds: [{
        color: '#abc',
        displayNameTranslations: { 'en-US': 'World' },
        id: 'world-a',
        sortOrder: 0
      }]
    }),
    pickFirstWorldId: () => 'world-a'
  })
  await hydrateDialogQuickSearchDocumentSources(deps, {
    documents,
    selectedDocumentId,
    selectedWorldId,
    templateIconsById,
    worlds
  })
  expect(selectedDocumentId.value).toBeNull()
  expect(selectedWorldId.value).toBe('world-a')
  expect(worlds.value).toHaveLength(1)
  expect(templateIconsById.value.get('tpl-hero')?.icon).toBe('mdi-account')
  expect(documents.value.map((row) => row.id)).toEqual(['doc-a'])
})
