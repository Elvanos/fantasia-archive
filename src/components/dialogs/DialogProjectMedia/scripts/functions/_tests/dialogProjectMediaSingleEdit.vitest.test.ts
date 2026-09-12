import { expect, test, vi } from 'vitest'

import type { I_dialogProjectMediaSingleEditKeydownEvent } from 'app/types/I_bindDialogProjectMediaSingleEdit'
import type {
  I_faProjectMedia,
  I_faProjectMediaMassEditRow,
  T_faProjectMediaPanel
} from 'app/types/I_faProjectMediaDomain'
import type { I_computedRef, I_ref } from 'app/types/I_vueCompositionShims'

import { bindDialogProjectMediaSingleEditSave } from '../../dialogProjectMediaSingleEditSave'
import {
  bindDialogProjectMediaSingleEdit,
  bindFaProjectMediaSingleEditSlideEscape,
  closeFaProjectMediaSingleEditSlide,
  discardFaProjectMediaSingleEditDraft,
  FA_DIALOG_PROJECT_MEDIA_SINGLE_EDIT_SLIDE_MS,
  openFaProjectMediaSingleEditSlide,
  resolveDialogProjectMediaShowGenericClose,
  shouldCloseFaProjectMediaSingleEditSlideOnEscape
} from '../dialogProjectMediaSingleEdit'
import {
  rebindFaProjectMediaSingleEditDraftFromList,
  wireDialogProjectMediaSingleEditPersistence
} from '../dialogProjectMediaSingleEditNav'

function createRef<T> (value: T): I_ref<T> {
  return { value } as I_ref<T>
}

function mapFaProjectMediaToMassEditRow (item: I_faProjectMedia): I_faProjectMediaMassEditRow {
  return {
    createdAtMs: item.createdAtMs,
    displayName: item.displayName,
    externalEmbed: item.externalEmbed,
    externalLink: item.externalLink,
    externalType: item.externalType,
    id: item.id,
    internalEmbed: item.internalEmbed,
    internalLink: item.internalLink,
    internalType: item.internalType,
    isNew: false,
    type: item.type,
    updatedAtMs: item.updatedAtMs
  }
}

function requireAttachedKeydown (
  handler: ((event: I_dialogProjectMediaSingleEditKeydownEvent) => void) | null
): (event: I_dialogProjectMediaSingleEditKeydownEvent) => void {
  if (handler === null) {
    throw new Error('missing keydown')
  }
  return handler
}

const sampleItem: I_faProjectMedia = {
  createdAtMs: 0,
  displayName: 'bar',
  externalEmbed: '',
  externalLink: 'https://cdn.example.com/foo/bar.png',
  externalType: 'linked',
  id: 'row-1',
  internalEmbed: null,
  internalLink: '',
  internalType: 'linked_outside',
  type: 'external',
  updatedAtMs: 0
}

/**
 * shouldCloseFaProjectMediaSingleEditSlideOnEscape
 * Escape closes the slide only while it is open and clean.
 */
test('Test that shouldCloseFaProjectMediaSingleEditSlideOnEscape needs open clean Escape', () => {
  expect(shouldCloseFaProjectMediaSingleEditSlideOnEscape({
    isDirty: false,
    isSlideOpen: true,
    key: 'Escape'
  })).toBe(true)
  expect(shouldCloseFaProjectMediaSingleEditSlideOnEscape({
    isDirty: true,
    isSlideOpen: true,
    key: 'Escape'
  })).toBe(false)
  expect(shouldCloseFaProjectMediaSingleEditSlideOnEscape({
    isDirty: false,
    isSlideOpen: false,
    key: 'Escape'
  })).toBe(false)
  expect(shouldCloseFaProjectMediaSingleEditSlideOnEscape({
    isDirty: false,
    isSlideOpen: true,
    key: 'Enter'
  })).toBe(false)
})

/**
 * FA_DIALOG_PROJECT_MEDIA_SINGLE_EDIT_SLIDE_MS
 * Vue Transition duration matches the CSS token (300ms).
 */
test('Test that FA_DIALOG_PROJECT_MEDIA_SINGLE_EDIT_SLIDE_MS is 300', () => {
  expect(FA_DIALOG_PROJECT_MEDIA_SINGLE_EDIT_SLIDE_MS).toBe(300)
})

/**
 * openFaProjectMediaSingleEditSlide / closeFaProjectMediaSingleEditSlide /
 * discardFaProjectMediaSingleEditDraft
 * Open clones draft and baseline; hide keeps draft; discard drops it.
 */
test('Test that open and close FaProjectMediaSingleEditSlide clone then hide then discard', () => {
  const draft = createRef<I_faProjectMediaMassEditRow | null>(null)
  const baseline = createRef<I_faProjectMediaMassEditRow | null>(null)
  const slideOpen = createRef(false)
  openFaProjectMediaSingleEditSlide({
    baseline,
    draft,
    item: sampleItem,
    mapItemToRow: mapFaProjectMediaToMassEditRow,
    slideOpen
  })
  expect(slideOpen.value).toBe(true)
  expect(draft.value).not.toBeNull()
  expect(baseline.value).not.toBeNull()
  expect(draft.value).not.toBe(baseline.value)
  expect(draft.value?.displayName).toBe('bar')
  expect(draft.value?.isNew).toBe(false)
  if (draft.value !== null) {
    draft.value.displayName = 'changed'
  }
  expect(baseline.value?.displayName).toBe('bar')
  closeFaProjectMediaSingleEditSlide({
    slideOpen
  })
  expect(slideOpen.value).toBe(false)
  expect(draft.value).not.toBeNull()
  expect(baseline.value).not.toBeNull()
  discardFaProjectMediaSingleEditDraft({
    baseline,
    draft
  })
  expect(draft.value).toBeNull()
  expect(baseline.value).toBeNull()
})

/**
 * resolveDialogProjectMediaShowGenericClose
 * Generic Close hides on mass-edit, URL paste, single-edit tab, and list slide.
 */
test('Test that resolveDialogProjectMediaShowGenericClose hides on occupied footers', () => {
  expect(resolveDialogProjectMediaShowGenericClose({
    isAddOnlineUrlsPanel: false,
    isMassEditPanel: false,
    isSingleEditPanel: false,
    isSingleEditSlideOpen: false
  })).toBe(true)
  expect(resolveDialogProjectMediaShowGenericClose({
    isAddOnlineUrlsPanel: false,
    isMassEditPanel: true,
    isSingleEditPanel: false,
    isSingleEditSlideOpen: false
  })).toBe(false)
  expect(resolveDialogProjectMediaShowGenericClose({
    isAddOnlineUrlsPanel: true,
    isMassEditPanel: false,
    isSingleEditPanel: false,
    isSingleEditSlideOpen: false
  })).toBe(false)
  expect(resolveDialogProjectMediaShowGenericClose({
    isAddOnlineUrlsPanel: false,
    isMassEditPanel: false,
    isSingleEditPanel: true,
    isSingleEditSlideOpen: false
  })).toBe(false)
  expect(resolveDialogProjectMediaShowGenericClose({
    isAddOnlineUrlsPanel: false,
    isMassEditPanel: false,
    isSingleEditPanel: false,
    isSingleEditSlideOpen: true
  })).toBe(false)
})

/**
 * bindFaProjectMediaSingleEditSlideEscape
 * Open attaches the handler; Escape closes when clean; unmount detaches.
 */
test('Test that bindFaProjectMediaSingleEditSlideEscape attaches and closes on clean Escape', () => {
  const watchers: Array<{
    effect: () => void
    last: unknown
    source: () => unknown
  }> = []
  const isSlideOpen = createRef(false)
  const isDirty = { value: false }
  const closeSlide = vi.fn()
  let attached: ((event: I_dialogProjectMediaSingleEditKeydownEvent) => void) | null = null
  const unmountHooks: Array<() => void> = []
  bindFaProjectMediaSingleEditSlideEscape({
    attachWindowKeydown (handler) {
      attached = handler
    },
    closeSlide,
    detachWindowKeydown () {
      attached = null
    },
    isDirty: isDirty as I_computedRef<boolean>,
    isSlideOpen,
    onBeforeUnmount (hook) {
      unmountHooks.push(hook)
    },
    watch (source, effect) {
      watchers.push({
        effect,
        last: source(),
        source
      })
    }
  })
  isSlideOpen.value = true
  for (const watcher of watchers) {
    watcher.effect()
  }
  requireAttachedKeydown(attached)({
    key: 'Enter',
    preventDefault () {
      return undefined
    }
  })
  expect(closeSlide).not.toHaveBeenCalled()
  isDirty.value = true
  requireAttachedKeydown(attached)({
    key: 'Escape',
    preventDefault () {
      return undefined
    }
  })
  expect(closeSlide).not.toHaveBeenCalled()
  isDirty.value = false
  const preventDefault = vi.fn()
  requireAttachedKeydown(attached)({
    key: 'Escape',
    preventDefault
  })
  expect(preventDefault).toHaveBeenCalledOnce()
  expect(closeSlide).toHaveBeenCalledOnce()
  isSlideOpen.value = false
  for (const watcher of watchers) {
    watcher.effect()
  }
  expect(attached).toBeNull()
  isSlideOpen.value = true
  for (const watcher of watchers) {
    watcher.effect()
  }
  expect(attached).not.toBeNull()
  unmountHooks[0]?.()
  expect(attached).toBeNull()
})

/**
 * bindDialogProjectMediaSingleEdit
 * Open slide, hide generic Close, save reloads, tab Close dismisses.
 */
test('Test that bindDialogProjectMediaSingleEdit opens slide and save reloads list', async () => {
  const dialogModel = createRef(true)
  const selectedPanel = createRef<T_faProjectMediaPanel>('mediaList')
  const listMediaItems = createRef<I_faProjectMedia[]>([])
  const applyListLoad = vi.fn(async () => {
    listMediaItems.value = [sampleItem]
  })
  const bound = bindDialogProjectMediaSingleEdit({
    applyListLoad,
    attachWindowKeydown: () => undefined,
    bindSingleEditSave: bindDialogProjectMediaSingleEditSave,
    wirePersistence: wireDialogProjectMediaSingleEditPersistence,
    computed: (getter) => {
      return {
        get value () {
          return getter()
        }
      } as I_computedRef<ReturnType<typeof getter>>
    },
    detachWindowKeydown: () => undefined,
    dialogModel,
    isAddOnlineUrlsPanel: { value: false } as I_computedRef<boolean>,
    isDirtyFn: (draft, baseline) => {
      if (draft === null || baseline === null) {
        return false
      }
      return draft.displayName !== baseline.displayName
    },
    isMassEditPanel: { value: false } as I_computedRef<boolean>,
    listLoadGeneration: { value: 0 },
    listMediaItems,
    loadListMedia: async () => [sampleItem],
    mapItemToRow: mapFaProjectMediaToMassEditRow,
    mapRowToUpsertItem: (row) => {
      return {
        displayName: row.displayName,
        externalEmbed: row.externalEmbed,
        externalLink: row.externalLink,
        externalType: row.externalType,
        id: row.id,
        internalLink: row.internalLink,
        internalType: row.internalType,
        type: row.type
      }
    },
    onBeforeUnmount: () => undefined,
    ref: createRef,
    runFaActionAwait: async () => true,
    selectedPanel,
    watch: () => undefined
  })
  expect(bound.showGenericClose.value).toBe(true)
  expect(bound.isSingleEditSaveDisabled.value).toBe(true)
  bound.openSingleEditSlide(sampleItem)
  expect(bound.isSingleEditSlideOpen.value).toBe(true)
  expect(bound.showGenericClose.value).toBe(false)
  expect(bound.isSingleEditSaveDisabled.value).toBe(false)
  expect(bound.isSingleEditDirty.value).toBe(false)
  if (bound.singleEditDraft.value !== null) {
    bound.singleEditDraft.value = {
      ...bound.singleEditDraft.value,
      displayName: 'changed'
    }
  }
  expect(bound.isSingleEditDirty.value).toBe(true)
  await bound.saveSingleEditSlide()
  expect(bound.isSingleEditSlideOpen.value).toBe(false)
  expect(bound.singleEditDraft.value).not.toBeNull()
  bound.discardSingleEditSlide()
  expect(bound.singleEditDraft.value).toBeNull()
  expect(applyListLoad).toHaveBeenCalledOnce()
  bound.openSingleEditSlide(sampleItem)
  selectedPanel.value = 'mediaSingleEdit'
  expect(bound.isSingleEditPanel.value).toBe(true)
  expect(bound.showGenericClose.value).toBe(false)
  bound.closeSingleEditDialog()
  expect(dialogModel.value).toBe(false)
})

/**
 * rebindFaProjectMediaSingleEditDraftFromList
 * Found ids remap draft; missing ids copy draft into baseline.
 */
test('Test that rebindFaProjectMediaSingleEditDraftFromList remaps or copies baseline', () => {
  const draft = createRef<I_faProjectMediaMassEditRow | null>(
    mapFaProjectMediaToMassEditRow(sampleItem)
  )
  const baseline = createRef<I_faProjectMediaMassEditRow | null>(
    mapFaProjectMediaToMassEditRow(sampleItem)
  )
  if (draft.value !== null) {
    draft.value = {
      ...draft.value,
      displayName: 'changed'
    }
  }
  rebindFaProjectMediaSingleEditDraftFromList({
    baseline,
    draft,
    id: sampleItem.id,
    items: [{
      ...sampleItem,
      displayName: 'from-list'
    }],
    mapItemToRow: mapFaProjectMediaToMassEditRow
  })
  expect(draft.value?.displayName).toBe('from-list')
  expect(baseline.value?.displayName).toBe('from-list')
  if (draft.value !== null) {
    draft.value = {
      ...draft.value,
      displayName: 'stale'
    }
  }
  rebindFaProjectMediaSingleEditDraftFromList({
    baseline,
    draft,
    id: sampleItem.id,
    items: [],
    mapItemToRow: mapFaProjectMediaToMassEditRow
  })
  expect(draft.value?.displayName).toBe('stale')
  expect(baseline.value?.displayName).toBe('stale')
  const emptyDraft = createRef<I_faProjectMediaMassEditRow | null>(null)
  const emptyBaseline = createRef<I_faProjectMediaMassEditRow | null>(null)
  rebindFaProjectMediaSingleEditDraftFromList({
    baseline: emptyBaseline,
    draft: emptyDraft,
    id: 'gone',
    items: [],
    mapItemToRow: mapFaProjectMediaToMassEditRow
  })
  expect(emptyDraft.value).toBeNull()
})

/**
 * bindDialogProjectMediaSingleEdit
 * Slide prev/next walk the list while clean; stay save keeps the slide open.
 */
test('Test that bindDialogProjectMediaSingleEdit slide nav and stay save', async () => {
  const secondItem: I_faProjectMedia = {
    ...sampleItem,
    displayName: 'two',
    id: 'row-2'
  }
  const listMediaItems = createRef<I_faProjectMedia[]>([sampleItem, secondItem])
  const applyListLoad = vi.fn(async () => {
    listMediaItems.value = [{
      ...sampleItem,
      displayName: 'saved-one'
    }, secondItem]
  })
  const bound = bindDialogProjectMediaSingleEdit({
    applyListLoad,
    attachWindowKeydown: () => undefined,
    bindSingleEditSave: bindDialogProjectMediaSingleEditSave,
    wirePersistence: wireDialogProjectMediaSingleEditPersistence,
    computed: (getter) => {
      return {
        get value () {
          return getter()
        }
      } as I_computedRef<ReturnType<typeof getter>>
    },
    detachWindowKeydown: () => undefined,
    dialogModel: createRef(true),
    isAddOnlineUrlsPanel: { value: false } as I_computedRef<boolean>,
    isDirtyFn: (draft, baseline) => {
      if (draft === null || baseline === null) {
        return false
      }
      return draft.displayName !== baseline.displayName
    },
    isMassEditPanel: { value: false } as I_computedRef<boolean>,
    listLoadGeneration: { value: 0 },
    listMediaItems,
    loadListMedia: async () => listMediaItems.value,
    mapItemToRow: mapFaProjectMediaToMassEditRow,
    mapRowToUpsertItem: (row) => {
      return {
        displayName: row.displayName,
        externalEmbed: row.externalEmbed,
        externalLink: row.externalLink,
        externalType: row.externalType,
        id: row.id,
        internalLink: row.internalLink,
        internalType: row.internalType,
        type: row.type
      }
    },
    onBeforeUnmount: () => undefined,
    ref: createRef,
    runFaActionAwait: async () => true,
    selectedPanel: createRef<T_faProjectMediaPanel>('mediaList'),
    watch: () => undefined
  })
  bound.openSingleEditSlide(sampleItem)
  expect(bound.isSlidePreviousDisabled.value).toBe(true)
  expect(bound.isSlideNextDisabled.value).toBe(false)
  bound.openSingleEditSlideNext()
  expect(bound.singleEditDraft.value?.id).toBe('row-2')
  bound.openSingleEditSlidePrevious()
  expect(bound.singleEditDraft.value?.id).toBe('row-1')
  if (bound.singleEditDraft.value !== null) {
    bound.singleEditDraft.value = {
      ...bound.singleEditDraft.value,
      displayName: 'dirty'
    }
  }
  expect(bound.isSlideNextDisabled.value).toBe(true)
  bound.openSingleEditSlideNext()
  expect(bound.singleEditDraft.value?.id).toBe('row-1')
  await bound.saveSingleEditSlideStay()
  expect(bound.isSingleEditSlideOpen.value).toBe(true)
  expect(bound.singleEditDraft.value?.displayName).toBe('saved-one')
  expect(bound.isSingleEditDirty.value).toBe(false)
})
