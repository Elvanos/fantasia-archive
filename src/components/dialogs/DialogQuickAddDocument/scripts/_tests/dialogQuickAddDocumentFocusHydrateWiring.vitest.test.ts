import { expect, test, vi } from 'vitest'
import { computed, ref } from 'vue'

import type { I_createUseDialogQuickAddDocumentDeps } from 'app/types/I_createUseDialogQuickAddDocument'
import type { I_dialogQuickAddDocumentQSelectLike } from 'app/types/I_createUseDialogQuickAddDocument'
import type { I_dialogQuickAddDocumentTemplateSource } from 'app/types/I_dialogQuickAddDocument'
import type { I_dialogQuickAddDocumentWorldSource } from 'app/types/I_dialogQuickAddDocument'

import {
  bindDialogQuickAddDocumentTemplateSelectRef,
  cancelDialogQuickAddDocumentTemplateFocus,
  filterDialogQuickAddDocumentTemplateSelect,
  focusDialogQuickAddDocumentTemplateSelectAfterShow,
  hydrateDialogQuickAddDocumentSources,
  isDialogQuickAddDocumentQSelectLike,
  refocusDialogQuickAddDocumentTemplateSelect,
  scheduleDialogQuickAddDocumentTemplateFocus
} from '../dialogQuickAddDocumentFocusHydrateWiring'

function makeSelectMock (
  overrides?: Partial<I_dialogQuickAddDocumentQSelectLike>
): I_dialogQuickAddDocumentQSelectLike {
  return {
    moveOptionSelection: vi.fn(),
    setOptionIndex: vi.fn(),
    showPopup: vi.fn(),
    ...overrides
  }
}

function makeDeps (
  overrides?: Partial<I_createUseDialogQuickAddDocumentDeps>
): I_createUseDialogQuickAddDocumentDeps {
  return {
    buildTemplateOptions: () => [],
    buildWorldOptions: () => [],
    computed: () => ({ value: [] }) as never,
    createTemporaryDocument: vi.fn(async () => 'temp'),
    findWorldById: () => null,
    isDialogQuickAddDocumentDirectInput: () => false,
    isDialogQuickAddDocumentStoreTarget: () => false,
    loadQuickAddDocumentSources: async () => ({
      templates: [],
      worlds: []
    }),
    nextTick: async () => undefined,
    onBeforeUnmount: () => undefined,
    onMounted: () => undefined,
    pickFirstWorldId: () => null,
    ref,
    registerComponentDialogStackGuard: vi.fn(),
    resolveDialogComponentStoreOrNull: () => null,
    resolveNewDocumentDisplayName: () => 'Doc',
    resolvePreferredLanguageCode: () => 'en-US',
    resolveTemplateOptionLabel: () => 'Tpl',
    resolveWorldOptionLabel: () => 'World',
    runDialogQuickAddDocumentSession: () => ({} as never),
    sleep: async () => undefined,
    templateFocusMs: 0,
    watch: () => undefined as never,
    ...overrides
  }
}

/**
 * isDialogQuickAddDocumentQSelectLike / bindDialogQuickAddDocumentTemplateSelectRef
 * Require showPopup + setOptionIndex + moveOptionSelection.
 */
test('Test that bindDialogQuickAddDocumentTemplateSelectRef accepts full q-select instances', () => {
  const templateSelectRef = ref(null)
  const select = makeSelectMock()
  expect(isDialogQuickAddDocumentQSelectLike(null)).toBe(false)
  expect(isDialogQuickAddDocumentQSelectLike('not-an-object')).toBe(false)
  expect(isDialogQuickAddDocumentQSelectLike({ showPopup: () => undefined })).toBe(false)
  expect(isDialogQuickAddDocumentQSelectLike({
    moveOptionSelection: () => undefined,
    setOptionIndex: () => undefined,
    showPopup: 'not-a-function'
  })).toBe(false)
  expect(isDialogQuickAddDocumentQSelectLike(select)).toBe(true)

  bindDialogQuickAddDocumentTemplateSelectRef(templateSelectRef, select)
  expect(templateSelectRef.value).not.toBeNull()
  bindDialogQuickAddDocumentTemplateSelectRef(templateSelectRef, null)
  expect(templateSelectRef.value).toBeNull()
})

/**
 * focusDialogQuickAddDocumentTemplateSelectAfterShow
 * Opens popup then highlights the first option (FA 1.0 refocusSelect).
 */
test('Test that focusDialogQuickAddDocumentTemplateSelectAfterShow opens popup and highlights first option', async () => {
  const select = makeSelectMock()
  const sleep = vi.fn(async () => undefined)
  const deps = makeDeps({
    sleep,
    templateFocusMs: 300
  })
  const templateOptions = computed(() => [{
    icon: 'mdi-a',
    label: 'Heroes',
    titlePluralTranslations: { 'en-US': 'Heroes' },
    titleSingularTranslations: { 'en-US': 'Hero' },
    value: 'tpl-hero'
  }])
  const session = {
    dialogModel: ref(true),
    filteredTemplateOptions: ref<typeof templateOptions.value>([]),
    focusGeneration: ref(1),
    templateOptions,
    templateSelectRef: ref(select)
  }

  await focusDialogQuickAddDocumentTemplateSelectAfterShow(deps, session, 1)

  expect(sleep).toHaveBeenCalledWith(300)
  expect(session.filteredTemplateOptions.value).toHaveLength(1)
  expect(select.showPopup).toHaveBeenCalledTimes(1)
  expect(select.setOptionIndex).toHaveBeenCalledWith(-1)
  expect(select.moveOptionSelection).toHaveBeenCalledWith(1, true)
})

/**
 * focusDialogQuickAddDocumentTemplateSelectAfterShow
 * Ignores open when generation was cancelled during sleep.
 */
test('Test that focusDialogQuickAddDocumentTemplateSelectAfterShow skips after cancel', async () => {
  const select = makeSelectMock()
  const deps = makeDeps()
  const session = {
    dialogModel: ref(true),
    filteredTemplateOptions: ref([]),
    focusGeneration: ref(1),
    templateOptions: computed(() => []),
    templateSelectRef: ref(select)
  }

  await focusDialogQuickAddDocumentTemplateSelectAfterShow(deps, session, 0)

  expect(select.showPopup).not.toHaveBeenCalled()
})

/**
 * focusDialogQuickAddDocumentTemplateSelectAfterShow
 * Skips when dialog closed after the FA 1.0 sleep.
 */
test('Test that focusDialogQuickAddDocumentTemplateSelectAfterShow skips when dialog closed', async () => {
  const select = makeSelectMock()
  const deps = makeDeps()
  const session = {
    dialogModel: ref(false),
    filteredTemplateOptions: ref([]),
    focusGeneration: ref(1),
    templateOptions: computed(() => []),
    templateSelectRef: ref(select)
  }

  await focusDialogQuickAddDocumentTemplateSelectAfterShow(deps, session, 1)

  expect(select.showPopup).not.toHaveBeenCalled()
})

/**
 * focusDialogQuickAddDocumentTemplateSelectAfterShow
 * Skips when templateSelectRef is not a Quasar q-select-like instance.
 */
test('Test that focusDialogQuickAddDocumentTemplateSelectAfterShow skips non q-select refs', async () => {
  const deps = makeDeps()
  const session = {
    dialogModel: ref(true),
    filteredTemplateOptions: ref([]),
    focusGeneration: ref(1),
    templateOptions: computed(() => []),
    templateSelectRef: ref(null)
  }

  await focusDialogQuickAddDocumentTemplateSelectAfterShow(deps, session, 1)

  expect(session.filteredTemplateOptions.value).toEqual([])
})

/**
 * focusDialogQuickAddDocumentTemplateSelectAfterShow
 * Cancels highlight when generation bumps between showPopup and second nextTick.
 */
test('Test that focusDialogQuickAddDocumentTemplateSelectAfterShow skips highlight after mid-open cancel', async () => {
  const select = makeSelectMock()
  const session = {
    dialogModel: ref(true),
    filteredTemplateOptions: ref<{
      icon: string
      label: string
      titlePluralTranslations: Record<string, string>
      titleSingularTranslations: Record<string, string>
      value: string
    }[]>([]),
    focusGeneration: ref(1),
    templateOptions: computed(() => [{
      icon: 'mdi-a',
      label: 'Heroes',
      titlePluralTranslations: { 'en-US': 'Heroes' },
      titleSingularTranslations: { 'en-US': 'Hero' },
      value: 'tpl-hero'
    }]),
    templateSelectRef: ref(select)
  }
  let nextTickCount = 0
  const deps = makeDeps({
    nextTick: async () => {
      nextTickCount += 1
      if (nextTickCount === 2) {
        session.focusGeneration.value += 1
      }
    }
  })

  await focusDialogQuickAddDocumentTemplateSelectAfterShow(deps, session, 1)

  expect(select.showPopup).toHaveBeenCalledTimes(1)
  expect(select.setOptionIndex).not.toHaveBeenCalled()
})

/**
 * focusDialogQuickAddDocumentTemplateSelectAfterShow
 * Opens popup without highlight when seeded options are empty.
 */
test('Test that focusDialogQuickAddDocumentTemplateSelectAfterShow skips highlight for empty options', async () => {
  const select = makeSelectMock()
  const deps = makeDeps()
  const session = {
    dialogModel: ref(true),
    filteredTemplateOptions: ref([]),
    focusGeneration: ref(1),
    templateOptions: computed(() => []),
    templateSelectRef: ref(select)
  }

  await focusDialogQuickAddDocumentTemplateSelectAfterShow(deps, session, 1)

  expect(select.showPopup).toHaveBeenCalledTimes(1)
  expect(select.setOptionIndex).not.toHaveBeenCalled()
})

/**
 * scheduleDialogQuickAddDocumentTemplateFocus
 * Bumps generation and runs FA 1.0-timed open sequence.
 */
test('Test that scheduleDialogQuickAddDocumentTemplateFocus bumps generation and opens popup', async () => {
  const select = makeSelectMock()
  const deps = makeDeps()
  const session = {
    dialogModel: ref(true),
    filteredTemplateOptions: ref([]),
    focusGeneration: ref(0),
    templateOptions: computed(() => []),
    templateSelectRef: ref(select)
  }

  const gen = scheduleDialogQuickAddDocumentTemplateFocus(deps, session)
  expect(gen).toBe(1)
  await Promise.resolve()
  await Promise.resolve()
  expect(select.showPopup).toHaveBeenCalledTimes(1)
})

/**
 * cancelDialogQuickAddDocumentTemplateFocus
 * Bumps generation so in-flight open is ignored.
 */
test('Test that cancelDialogQuickAddDocumentTemplateFocus bumps generation', () => {
  const session = { focusGeneration: ref(3) }
  cancelDialogQuickAddDocumentTemplateFocus(session)
  expect(session.focusGeneration.value).toBe(4)
})

/**
 * filterDialogQuickAddDocumentTemplateSelect
 * Filter updates options and highlights the first row via Quasar update afterFn.
 */
test('Test that filterDialogQuickAddDocumentTemplateSelect filters and highlights via afterFn', async () => {
  const select = makeSelectMock()
  const deps = makeDeps()
  const session = {
    filteredTemplateOptions: ref<{
      icon: string
      label: string
      titlePluralTranslations: Record<string, string>
      titleSingularTranslations: Record<string, string>
      value: string
    }[]>([]),
    templateOptions: computed(() => [
      {
        icon: 'mdi-a',
        label: 'Heroes',
        titlePluralTranslations: { 'en-US': 'Heroes' },
        titleSingularTranslations: { 'en-US': 'Hero' },
        value: 'tpl-hero'
      },
      {
        icon: 'mdi-b',
        label: 'Places',
        titlePluralTranslations: { 'en-US': 'Places' },
        titleSingularTranslations: { 'en-US': 'Place' },
        value: 'tpl-place'
      }
    ]),
    templateSelectRef: ref(select)
  }

  filterDialogQuickAddDocumentTemplateSelect(session, 'pla', (fn, afterFn) => {
    fn()
    afterFn?.(select)
  })
  expect(session.filteredTemplateOptions.value.map((row) => row.value)).toEqual(['tpl-place'])
  expect(select.setOptionIndex).toHaveBeenCalledWith(-1)
  expect(select.moveOptionSelection).toHaveBeenCalledWith(1, true)

  await refocusDialogQuickAddDocumentTemplateSelect(deps, ref(null))
  await refocusDialogQuickAddDocumentTemplateSelect(deps, ref(select))
  expect(select.setOptionIndex).toHaveBeenCalledTimes(2)
  expect(select.moveOptionSelection).toHaveBeenCalledTimes(2)
})

/**
 * filterDialogQuickAddDocumentTemplateSelect
 * No highlight when the filtered option list is empty.
 */
test('Test that filterDialogQuickAddDocumentTemplateSelect skips highlight for empty matches', () => {
  const select = makeSelectMock()
  const session = {
    filteredTemplateOptions: ref<{
      icon: string
      label: string
      titlePluralTranslations: Record<string, string>
      titleSingularTranslations: Record<string, string>
      value: string
    }[]>([]),
    templateOptions: computed(() => [
      {
        icon: 'mdi-a',
        label: 'Heroes',
        titlePluralTranslations: { 'en-US': 'Heroes' },
        titleSingularTranslations: { 'en-US': 'Hero' },
        value: 'tpl-hero'
      }
    ]),
    templateSelectRef: ref(select)
  }

  filterDialogQuickAddDocumentTemplateSelect(session, 'zzz-no-match', (fn, afterFn) => {
    fn()
    afterFn?.(select)
  })
  expect(session.filteredTemplateOptions.value).toEqual([])
  expect(select.setOptionIndex).not.toHaveBeenCalled()
})

/**
 * filterDialogQuickAddDocumentTemplateSelect
 * Empty needle (popup open) still highlights the first option — FA 1.0 empty-filter path.
 */
test('Test that empty filter highlights the first template option', () => {
  const select = makeSelectMock()
  const session = {
    filteredTemplateOptions: ref<{
      icon: string
      label: string
      titlePluralTranslations: Record<string, string>
      titleSingularTranslations: Record<string, string>
      value: string
    }[]>([]),
    templateOptions: computed(() => [
      {
        icon: 'mdi-a',
        label: 'Heroes',
        titlePluralTranslations: { 'en-US': 'Heroes' },
        titleSingularTranslations: { 'en-US': 'Hero' },
        value: 'tpl-hero'
      }
    ]),
    templateSelectRef: ref(select)
  }

  filterDialogQuickAddDocumentTemplateSelect(session, '', (fn, afterFn) => {
    fn()
    afterFn?.(select)
  })
  expect(session.filteredTemplateOptions.value.map((row) => row.value)).toEqual(['tpl-hero'])
  expect(select.setOptionIndex).toHaveBeenCalledWith(-1)
  expect(select.moveOptionSelection).toHaveBeenCalledWith(1, true)
})

/**
 * hydrateDialogQuickAddDocumentSources
 * Loads worlds/templates and preselects the first world id.
 */
test('Test that hydrateDialogQuickAddDocumentSources maps sources and picks first world', async () => {
  const worlds: I_dialogQuickAddDocumentWorldSource[] = [{
    color: '',
    displayNameTranslations: { 'en-US': 'A' },
    id: 'world-a',
    sortOrder: 0,
    templateLayout: {
      groups: [],
      placements: []
    }
  }]
  const templates: I_dialogQuickAddDocumentTemplateSource[] = [{
    icon: 'mdi-x',
    id: 'tpl-1',
    titlePluralTranslations: { 'en-US': 'Heroes' },
    titleSingularTranslations: { 'en-US': 'Hero' }
  }]
  const deps = makeDeps({
    loadQuickAddDocumentSources: async () => ({
      templates,
      worlds
    }),
    pickFirstWorldId: () => 'world-a'
  })
  const session = {
    selectedTemplateId: ref<string | null>('old'),
    selectedWorldId: ref<string | null>(null),
    templatesById: ref(new Map<string, I_dialogQuickAddDocumentTemplateSource>()),
    worlds: ref<I_dialogQuickAddDocumentWorldSource[]>([])
  }

  await hydrateDialogQuickAddDocumentSources(deps, session)

  expect(session.worlds.value).toEqual(worlds)
  expect(session.templatesById.value.get('tpl-1')?.id).toBe('tpl-1')
  expect(session.selectedTemplateId.value).toBeNull()
  expect(session.selectedWorldId.value).toBe('world-a')
})
