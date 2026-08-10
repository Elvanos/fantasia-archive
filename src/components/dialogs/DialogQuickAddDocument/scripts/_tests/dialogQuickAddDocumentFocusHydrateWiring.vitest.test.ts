import { expect, test, vi } from 'vitest'
import { nextTick, ref } from 'vue'

import type { I_createUseDialogQuickAddDocumentDeps } from 'app/types/I_createUseDialogQuickAddDocument'
import type { I_dialogQuickAddDocumentFaSelectInputLike } from 'app/types/I_createUseDialogQuickAddDocument'

import {
  bindDialogQuickAddDocumentTemplateSelectRef,
  cancelDialogQuickAddDocumentTemplateFocus,
  focusDialogQuickAddDocumentTemplateSelectAfterShow,
  hydrateDialogQuickAddDocumentSources,
  isDialogQuickAddDocumentFaSelectInputLike,
  scheduleDialogQuickAddDocumentTemplateFocus
} from '../dialogQuickAddDocumentFocusHydrateWiring'

function makeSelect (
  overrides?: Partial<I_dialogQuickAddDocumentFaSelectInputLike>
): I_dialogQuickAddDocumentFaSelectInputLike {
  return {
    openPopup: vi.fn(),
    ...overrides
  }
}

function makeDeps (
  overrides?: Partial<I_createUseDialogQuickAddDocumentDeps>
): I_createUseDialogQuickAddDocumentDeps {
  return {
    buildTemplateOptions: () => [],
    buildWorldOptions: () => [],
    computed: (() => ({ value: [] })) as never,
    createTemporaryDocument: vi.fn(async () => 'temp'),
    findWorldById: () => null,
    isDialogQuickAddDocumentDirectInput: () => false,
    isDialogQuickAddDocumentStoreTarget: () => false,
    loadQuickAddDocumentSources: async () => ({
      templates: [],
      worlds: []
    }),
    nextTick,
    onBeforeUnmount: () => undefined,
    onMounted: () => undefined,
    pickFirstWorldId: () => null,
    ref,
    registerComponentDialogStackGuard: vi.fn(),
    resolveDialogComponentStoreOrNull: () => null,
    resolveNewDocumentDisplayName: () => 'Heroes',
    resolvePreferredLanguageCode: () => 'en-US',
    resolveTemplateOptionLabel: () => 'Heroes',
    resolveWorldOptionLabel: () => 'World',
    runDialogQuickAddDocumentSession: () => ({} as never),
    sleep: async () => undefined,
    templateFocusMs: 0,
    watch: () => undefined,
    ...overrides
  }
}

/**
 * isDialogQuickAddDocumentFaSelectInputLike / bindDialogQuickAddDocumentTemplateSelectRef
 */
test('Test that FaSelectInput-like guard and bindTemplateSelectRef work', () => {
  const templateSelectRef = ref<I_dialogQuickAddDocumentFaSelectInputLike | null>(null)
  expect(isDialogQuickAddDocumentFaSelectInputLike(null)).toBe(false)
  expect(isDialogQuickAddDocumentFaSelectInputLike('not-an-object')).toBe(false)
  expect(isDialogQuickAddDocumentFaSelectInputLike({ showPopup: () => undefined })).toBe(false)
  const select = makeSelect()
  expect(isDialogQuickAddDocumentFaSelectInputLike(select)).toBe(true)
  bindDialogQuickAddDocumentTemplateSelectRef(templateSelectRef, { nope: true })
  expect(templateSelectRef.value).toBeNull()
  bindDialogQuickAddDocumentTemplateSelectRef(templateSelectRef, select)
  expect(templateSelectRef.value?.openPopup).toBe(select.openPopup)
})

/**
 * focusDialogQuickAddDocumentTemplateSelectAfterShow
 * Opens popup via FaSelectInput openPopup after FA 1.0 timing.
 */
test('Test that focusDialogQuickAddDocumentTemplateSelectAfterShow calls openPopup', async () => {
  const select = makeSelect()
  const session = {
    dialogModel: ref(true),
    focusGeneration: ref(1),
    templateSelectRef: ref<I_dialogQuickAddDocumentFaSelectInputLike | null>(select)
  }
  const deps = makeDeps()
  await focusDialogQuickAddDocumentTemplateSelectAfterShow(deps, session, 1)
  expect(select.openPopup).toHaveBeenCalledTimes(1)
})

/**
 * focusDialogQuickAddDocumentTemplateSelectAfterShow
 * Cancels when generation bumps before open.
 */
test('Test that focusDialogQuickAddDocumentTemplateSelectAfterShow skips after mid-open cancel', async () => {
  const select = makeSelect()
  const session = {
    dialogModel: ref(true),
    focusGeneration: ref(1),
    templateSelectRef: ref<I_dialogQuickAddDocumentFaSelectInputLike | null>(select)
  }
  const deps = makeDeps({
    sleep: async () => {
      session.focusGeneration.value = 2
    }
  })
  await focusDialogQuickAddDocumentTemplateSelectAfterShow(deps, session, 1)
  expect(select.openPopup).not.toHaveBeenCalled()
})

/**
 * focusDialogQuickAddDocumentTemplateSelectAfterShow
 * Skips when dialog closed or select missing.
 */
test('Test that focusDialogQuickAddDocumentTemplateSelectAfterShow skips when dialog closed', async () => {
  const select = makeSelect()
  const session = {
    dialogModel: ref(false),
    focusGeneration: ref(1),
    templateSelectRef: ref<I_dialogQuickAddDocumentFaSelectInputLike | null>(select)
  }
  await focusDialogQuickAddDocumentTemplateSelectAfterShow(makeDeps(), session, 1)
  expect(select.openPopup).not.toHaveBeenCalled()
})

/**
 * scheduleDialogQuickAddDocumentTemplateFocus / cancelDialogQuickAddDocumentTemplateFocus
 */
test('Test that schedule and cancel bump focus generation', async () => {
  const select = makeSelect()
  const session = {
    dialogModel: ref(true),
    focusGeneration: ref(0),
    templateSelectRef: ref<I_dialogQuickAddDocumentFaSelectInputLike | null>(select)
  }
  const generation = scheduleDialogQuickAddDocumentTemplateFocus(makeDeps(), session)
  expect(generation).toBe(1)
  cancelDialogQuickAddDocumentTemplateFocus(session)
  expect(session.focusGeneration.value).toBe(2)
  await nextTick()
})

/**
 * hydrateDialogQuickAddDocumentSources
 */
test('Test that hydrateDialogQuickAddDocumentSources seeds worlds and first world id', async () => {
  const selectedTemplateId = ref<string | null>('old')
  const selectedWorldId = ref<string | null>(null)
  const templatesById = ref(new Map())
  const worlds = ref([])
  const deps = makeDeps({
    loadQuickAddDocumentSources: async () => ({
      templates: [{
        icon: 'mdi-x',
        id: 'tpl-hero',
        titlePluralTranslations: { 'en-US': 'Heroes' },
        titleSingularTranslations: { 'en-US': 'Hero' }
      }],
      worlds: [{
        color: '#abc',
        displayNameTranslations: { 'en-US': 'World' },
        id: 'world-a',
        sortOrder: 0,
        templateLayout: {
          groups: [],
          placements: []
        }
      }]
    }),
    pickFirstWorldId: () => 'world-a'
  })
  await hydrateDialogQuickAddDocumentSources(deps, {
    selectedTemplateId,
    selectedWorldId,
    templatesById,
    worlds
  })
  expect(selectedTemplateId.value).toBeNull()
  expect(selectedWorldId.value).toBe('world-a')
  expect(worlds.value).toHaveLength(1)
  expect(templatesById.value.get('tpl-hero')?.id).toBe('tpl-hero')
})
