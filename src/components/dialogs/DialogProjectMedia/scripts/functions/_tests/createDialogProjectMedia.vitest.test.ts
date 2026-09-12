import { expect, test, vi } from 'vitest'

import type {
  I_faProjectMedia,
  I_faProjectMediaMassEditRow
} from 'app/types/I_faProjectMediaDomain'
import type { I_computedRef, I_ref } from 'app/types/I_vueCompositionShims'

import { bindUseDialogProjectMedia } from '../../bindDialogProjectMediaUse'
import { bindDialogProjectMediaMassEditSave } from '../../dialogProjectMediaMassEditSave'
import { bindDialogProjectMediaSingleEditSave } from '../../dialogProjectMediaSingleEditSave'
import { createDialogProjectMedia } from '../createDialogProjectMedia'
import { bindDialogProjectMediaSingleEdit } from '../dialogProjectMediaSingleEdit'
import {
  applyDialogProjectMediaListLoad,
  attachDialogProjectMediaWatches,
  submitOnlineUrlsIntake
} from '../dialogProjectMediaSession'

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

function isFaProjectMediaMassEditRowDirty (
  draft: I_faProjectMediaMassEditRow | null,
  baseline: I_faProjectMediaMassEditRow | null
): boolean {
  if (draft === null || baseline === null) {
    return false
  }
  if (draft.displayName !== baseline.displayName) {
    return true
  }
  if (draft.type !== baseline.type) {
    return true
  }
  if (draft.internalType !== baseline.internalType) {
    return true
  }
  if (draft.externalType !== baseline.externalType) {
    return true
  }
  if (draft.externalLink !== baseline.externalLink) {
    return true
  }
  if (draft.externalEmbed !== baseline.externalEmbed) {
    return true
  }
  return draft.internalLink !== baseline.internalLink
}

function resolveFaProjectMediaDialogPersistent (input: {
  onlineUrlsDraft: string
  selectedPanel: string
  singleEditDirty: boolean
}): boolean {
  if (input.selectedPanel === 'mediaMassEdit') {
    return true
  }
  if (input.selectedPanel === 'mediaAddOnlineUrls') {
    return input.onlineUrlsDraft.trim().length > 0
  }
  if (input.selectedPanel === 'mediaAdd') {
    return false
  }
  if (input.selectedPanel === 'mediaSingleEdit') {
    return input.singleEditDirty
  }
  return true
}

function resolveFaProjectMediaDialogTitleI18nKey (selectedPanel: string): string {
  if (selectedPanel === 'mediaAdd') {
    return 'dialogs.projectMedia.titleAdd'
  }
  if (selectedPanel === 'mediaAddOnlineUrls') {
    return 'dialogs.projectMedia.titleAddOnline'
  }
  if (selectedPanel === 'mediaMassEdit') {
    return 'dialogs.projectMedia.titleMassEdit'
  }
  if (selectedPanel === 'mediaList') {
    return 'dialogs.projectMedia.titleList'
  }
  if (selectedPanel === 'mediaSingleEdit') {
    return 'dialogs.projectMedia.titleSingle'
  }
  return 'dialogs.projectMedia.title'
}

function mapRowToUpsertItem (row: I_faProjectMediaMassEditRow) {
  return {
    displayName: row.displayName.trim().length > 0 ? row.displayName.trim() : 'Untitled',
    externalEmbed: row.externalEmbed,
    externalLink: row.externalLink,
    externalType: row.externalType,
    id: row.id,
    internalLink: row.internalLink,
    internalType: row.internalType,
    type: row.type
  }
}

function createHarness (opts?: {
  incomingRows?: I_faProjectMediaMassEditRow[]
  loadListMedia?: () => Promise<I_faProjectMedia[]>
  omitInitialPanel?: boolean
  runFaActionAwait?: (
    id: 'saveProjectMedia',
    payload: { items: unknown[] }
  ) => Promise<boolean>
}): ReturnType<ReturnType<typeof createDialogProjectMedia>['useDialogProjectMedia']> & {
  runWatches: () => void
} {
  const watchers: Array<{
    effect: () => void
    last: unknown
    source: () => unknown
  }> = []
  const incoming = opts?.incomingRows ?? []
  const api = createDialogProjectMedia({
    applyListLoad: applyDialogProjectMediaListLoad,
    attachWatches: attachDialogProjectMediaWatches,
    attachWindowKeydown: () => undefined,
    bindMassEditSave: bindDialogProjectMediaMassEditSave,
    bindSingleEdit: bindDialogProjectMediaSingleEdit,
    bindSingleEditSave: bindDialogProjectMediaSingleEditSave,
    bindUse: bindUseDialogProjectMedia,
    computed: (getter) => {
      return {
        get value () {
          return getter()
        }
      } as I_computedRef<ReturnType<typeof getter>>
    },
    createMassEditRowsFromOnlineUrlsDraft: () => incoming,
    detachWindowKeydown: () => undefined,
    getRequestedPanel: () => 'mediaMassEdit',
    hasFaProjectMediaOnlineUrlDraftContent: (draft) => draft.trim().length > 0,
    isDialogProjectMediaDirectInput: (input) => input === 'ProjectMedia',
    isDialogProjectMediaStoreTarget: (dialogToOpen) => dialogToOpen === 'ProjectMedia',
    isMassEditRowDirty: isFaProjectMediaMassEditRowDirty,
    loadListMedia: opts?.loadListMedia ?? (async () => []),
    mapMediaToMassEditRow: mapFaProjectMediaToMassEditRow,
    mapRowToUpsertItem,
    mapRowsToUpsertItems: (rows) => rows.map(mapRowToUpsertItem),
    normalizeFaProjectMediaPanel: (value) => {
      if (
        value === 'mediaAdd' ||
        value === 'mediaAddOnlineUrls' ||
        value === 'mediaList' ||
        value === 'mediaMassEdit' ||
        value === 'mediaSingleEdit'
      ) {
        return value
      }
      return 'mediaMassEdit'
    },
    onBeforeUnmount: () => undefined,
    onMounted: (hook) => {
      hook()
    },
    ref: createRef,
    registerComponentDialogStackGuard: () => undefined,
    resolveDialogComponentStore: () => null,
    resolveFaProjectMediaDialogPersistent,
    resolveFaProjectMediaDialogTitleI18nKey,
    runFaActionAwait: opts?.runFaActionAwait ?? (async () => true),
    submitOnlineUrlsIntake,
    watch: (source, effect) => {
      watchers.push({
        effect,
        last: source(),
        source
      })
    }
  })
  const bound = api.useDialogProjectMedia(
    opts?.omitInitialPanel === true
      ? { directInput: 'ProjectMedia' }
      : {
          directInput: 'ProjectMedia',
          initialPanel: 'mediaAdd'
        }
  )
  for (const watcher of watchers) {
    watcher.last = watcher.source()
  }
  function runWatches (): void {
    for (const watcher of watchers) {
      const next = watcher.source()
      if (next !== watcher.last) {
        watcher.last = next
        watcher.effect()
      }
    }
  }
  return {
    ...bound,
    runWatches
  }
}

test('Test that createDialogProjectMedia submitOnlineUrls appends rows and switches to mass-edit', () => {
  const incoming: I_faProjectMediaMassEditRow[] = [
    {
      id: 'a',
      displayName: 'one',
      type: 'external',
      internalType: 'linked_outside',
      externalType: 'linked',
      externalLink: 'https://a.test/one',
      externalEmbed: '',
      internalLink: '',
      internalEmbed: null,
      createdAtMs: 0,
      updatedAtMs: 0,
      isNew: true
    }
  ]
  const harness = createHarness({ incomingRows: incoming })
  expect(harness.selectedPanel.value).toBe('mediaAdd')
  expect(harness.isMassEditPanel.value).toBe(false)
  expect(harness.isAddOnlineUrlsPanel.value).toBe(false)
  expect(harness.isOnlineUrlsSubmitDisabled.value).toBe(true)
  expect(harness.isPersistent.value).toBe(false)
  expect(harness.dialogTitleI18nKey.value).toBe('dialogs.projectMedia.titleAdd')
  harness.submitOnlineUrls()
  expect(harness.massEditRows.value).toHaveLength(1)
  expect(harness.selectedPanel.value).toBe('mediaMassEdit')
  expect(harness.isMassEditPanel.value).toBe(true)
  expect(harness.isPersistent.value).toBe(true)
  expect(harness.dialogTitleI18nKey.value).toBe('dialogs.projectMedia.titleMassEdit')
  harness.submitOnlineUrls()
  expect(harness.massEditRows.value).toHaveLength(2)
})

test('Test that createDialogProjectMedia submitOnlineUrls no-ops when intake is empty', () => {
  const harness = createHarness()
  expect(harness.selectedPanel.value).toBe('mediaAdd')
  harness.submitOnlineUrls()
  expect(harness.massEditRows.value).toHaveLength(0)
  expect(harness.selectedPanel.value).toBe('mediaAdd')
  expect(harness.isMassEditPanel.value).toBe(false)
})

test('Test that createDialogProjectMedia without initialPanel uses requested panel', () => {
  const harness = createHarness({ omitInitialPanel: true })
  expect(harness.selectedPanel.value).toBe('mediaMassEdit')
})

test('Test that createDialogProjectMedia close clears mass-edit rows and URL panel', () => {
  const incoming: I_faProjectMediaMassEditRow[] = [
    {
      id: 'a',
      displayName: 'one',
      type: 'external',
      internalType: 'linked_outside',
      externalType: 'linked',
      externalLink: 'https://a.test/one',
      externalEmbed: '',
      internalLink: '',
      internalEmbed: null,
      createdAtMs: 0,
      updatedAtMs: 0,
      isNew: true
    }
  ]
  const harness = createHarness({ incomingRows: incoming })
  harness.showAddOnlineUrlsPanel()
  harness.runWatches()
  harness.onlineUrlsDraft.value = 'https://a.test/one'
  harness.submitOnlineUrls()
  expect(harness.massEditRows.value).toHaveLength(1)
  harness.listMediaItems.value = [{
    createdAtMs: 0,
    displayName: 'kept',
    externalEmbed: '',
    externalLink: 'https://a.test/one',
    externalType: 'linked',
    id: 'a',
    internalEmbed: null,
    internalLink: '',
    internalType: 'linked_outside',
    type: 'external',
    updatedAtMs: 0
  }]
  harness.dialogModel.value = false
  harness.runWatches()
  expect(harness.massEditRows.value).toHaveLength(0)
  expect(harness.listMediaItems.value).toHaveLength(0)
  expect(harness.onlineUrlsDraft.value).toBe('')
})

test('Test that createDialogProjectMedia entering the URL panel resets the draft', () => {
  const harness = createHarness()
  harness.showAddOnlineUrlsPanel()
  harness.runWatches()
  expect(harness.selectedPanel.value).toBe('mediaAddOnlineUrls')
  expect(harness.isAddOnlineUrlsPanel.value).toBe(true)
  expect(harness.isOnlineUrlsSubmitDisabled.value).toBe(true)
  expect(harness.isPersistent.value).toBe(false)
  expect(harness.dialogTitleI18nKey.value).toBe('dialogs.projectMedia.titleAddOnline')
  harness.onlineUrlsDraft.value = 'https://keep.test'
  expect(harness.isOnlineUrlsSubmitDisabled.value).toBe(false)
  expect(harness.isPersistent.value).toBe(true)
  harness.selectedPanel.value = 'mediaAdd'
  harness.runWatches()
  expect(harness.onlineUrlsDraft.value).toBe('https://keep.test')
  expect(harness.isPersistent.value).toBe(false)
  harness.showAddOnlineUrlsPanel()
  harness.runWatches()
  expect(harness.onlineUrlsDraft.value).toBe('')
  expect(harness.isPersistent.value).toBe(false)
})

test('Test that createDialogProjectMedia close snaps the URL panel back to add', () => {
  const harness = createHarness()
  harness.showAddOnlineUrlsPanel()
  harness.runWatches()
  harness.onlineUrlsDraft.value = 'https://keep.test'
  harness.dialogModel.value = false
  harness.runWatches()
  expect(harness.selectedPanel.value).toBe('mediaAdd')
  expect(harness.onlineUrlsDraft.value).toBe('')
  expect(harness.isPersistent.value).toBe(false)
})

test('Test that createDialogProjectMedia save and back to list clears rows after success', async () => {
  const incoming: I_faProjectMediaMassEditRow[] = [
    {
      createdAtMs: 0,
      displayName: 'one',
      externalEmbed: '',
      externalLink: 'https://a.test/one',
      externalType: 'linked',
      id: 'a',
      internalEmbed: null,
      internalLink: '',
      internalType: 'linked_outside',
      isNew: true,
      type: 'external',
      updatedAtMs: 0
    }
  ]
  const runFaActionAwait = vi.fn(async () => true)
  const harness = createHarness({
    incomingRows: incoming,
    runFaActionAwait
  })
  harness.submitOnlineUrls()
  expect(harness.selectedPanel.value).toBe('mediaMassEdit')
  await harness.saveAndBackToList()
  expect(runFaActionAwait).toHaveBeenCalledWith('saveProjectMedia', {
    items: [{
      displayName: 'one',
      externalEmbed: '',
      externalLink: 'https://a.test/one',
      externalType: 'linked',
      id: 'a',
      internalLink: '',
      internalType: 'linked_outside',
      type: 'external'
    }]
  })
  expect(harness.massEditRows.value).toHaveLength(0)
  expect(harness.selectedPanel.value).toBe('mediaList')
  expect(harness.dialogModel.value).toBe(true)
  expect(harness.dialogTitleI18nKey.value).toBe('dialogs.projectMedia.titleList')
})

test('Test that createDialogProjectMedia save and close dismisses after success', async () => {
  const incoming: I_faProjectMediaMassEditRow[] = [
    {
      createdAtMs: 0,
      displayName: 'one',
      externalEmbed: '',
      externalLink: 'https://a.test/one',
      externalType: 'linked',
      id: 'a',
      internalEmbed: null,
      internalLink: '',
      internalType: 'linked_outside',
      isNew: true,
      type: 'external',
      updatedAtMs: 0
    }
  ]
  const harness = createHarness({ incomingRows: incoming })
  harness.submitOnlineUrls()
  await harness.saveAndClose()
  expect(harness.dialogModel.value).toBe(false)
})

test('Test that createDialogProjectMedia failed save keeps the mass-edit session', async () => {
  const incoming: I_faProjectMediaMassEditRow[] = [
    {
      createdAtMs: 0,
      displayName: 'one',
      externalEmbed: '',
      externalLink: 'https://a.test/one',
      externalType: 'linked',
      id: 'a',
      internalEmbed: null,
      internalLink: '',
      internalType: 'linked_outside',
      isNew: true,
      type: 'external',
      updatedAtMs: 0
    }
  ]
  const harness = createHarness({
    incomingRows: incoming,
    runFaActionAwait: async () => false
  })
  harness.submitOnlineUrls()
  await harness.saveAndBackToList()
  expect(harness.massEditRows.value).toHaveLength(1)
  expect(harness.selectedPanel.value).toBe('mediaMassEdit')
  await harness.saveAndClose()
  expect(harness.dialogModel.value).toBe(true)
})

test('Test that createDialogProjectMedia save and back to list reloads list media', async () => {
  const listed: I_faProjectMedia[] = [
    {
      createdAtMs: 0,
      displayName: 'saved',
      externalEmbed: '',
      externalLink: 'https://a.test/saved.png',
      externalType: 'linked',
      id: 'saved',
      internalEmbed: null,
      internalLink: '',
      internalType: 'linked_outside',
      type: 'external',
      updatedAtMs: 0
    }
  ]
  const incoming: I_faProjectMediaMassEditRow[] = [
    {
      createdAtMs: 0,
      displayName: 'one',
      externalEmbed: '',
      externalLink: 'https://a.test/one',
      externalType: 'linked',
      id: 'a',
      internalEmbed: null,
      internalLink: '',
      internalType: 'linked_outside',
      isNew: true,
      type: 'external',
      updatedAtMs: 0
    }
  ]
  const harness = createHarness({
    incomingRows: incoming,
    loadListMedia: async () => listed
  })
  harness.submitOnlineUrls()
  await harness.saveAndBackToList()
  harness.runWatches()
  await vi.waitFor(() => {
    expect(harness.listMediaItems.value).toEqual(listed)
  })
})

const sampleListItem: I_faProjectMedia = {
  createdAtMs: 0,
  displayName: 'saved',
  externalEmbed: '',
  externalLink: 'https://a.test/saved.png',
  externalType: 'linked',
  id: 'saved',
  internalEmbed: null,
  internalLink: '',
  internalType: 'linked_outside',
  type: 'external',
  updatedAtMs: 0
}

test('Test that createDialogProjectMedia list thumb opens the single-edit slide', () => {
  const harness = createHarness()
  expect(harness.showGenericClose.value).toBe(true)
  expect(harness.isSingleEditSaveDisabled.value).toBe(true)
  harness.openSingleEditSlide(sampleListItem)
  expect(harness.isSingleEditSlideOpen.value).toBe(true)
  expect(harness.singleEditDraft.value?.id).toBe('saved')
  expect(harness.singleEditDraft.value?.isNew).toBe(false)
  expect(harness.showGenericClose.value).toBe(false)
  expect(harness.isSingleEditSaveDisabled.value).toBe(false)
  harness.closeSingleEditSlide()
  expect(harness.isSingleEditSlideOpen.value).toBe(false)
  expect(harness.singleEditDraft.value?.id).toBe('saved')
  expect(harness.showGenericClose.value).toBe(true)
  harness.discardSingleEditSlide()
  expect(harness.singleEditDraft.value).toBeNull()
})

test('Test that createDialogProjectMedia single-edit tab is sticky only when dirty', () => {
  const harness = createHarness()
  harness.selectedPanel.value = 'mediaSingleEdit'
  expect(harness.dialogTitleI18nKey.value).toBe('dialogs.projectMedia.titleSingle')
  expect(harness.isPersistent.value).toBe(false)
  expect(harness.showGenericClose.value).toBe(false)
  harness.openSingleEditSlide(sampleListItem)
  expect(harness.isPersistent.value).toBe(false)
  if (harness.singleEditDraft.value !== null) {
    harness.singleEditDraft.value = {
      ...harness.singleEditDraft.value,
      displayName: 'changed'
    }
  }
  expect(harness.isPersistent.value).toBe(true)
})

test('Test that createDialogProjectMedia single-edit slide save reloads the list', async () => {
  const listed = [sampleListItem]
  const runFaActionAwait = vi.fn(async () => true)
  const harness = createHarness({
    loadListMedia: async () => listed,
    runFaActionAwait
  })
  harness.openSingleEditSlide(sampleListItem)
  await harness.saveSingleEditSlide()
  expect(runFaActionAwait).toHaveBeenCalledWith('saveProjectMedia', {
    items: [{
      displayName: 'saved',
      externalEmbed: '',
      externalLink: 'https://a.test/saved.png',
      externalType: 'linked',
      id: 'saved',
      internalLink: '',
      internalType: 'linked_outside',
      type: 'external'
    }]
  })
  expect(harness.isSingleEditSlideOpen.value).toBe(false)
  expect(harness.dialogModel.value).toBe(true)
  await vi.waitFor(() => {
    expect(harness.listMediaItems.value).toEqual(listed)
  })
})

test('Test that createDialogProjectMedia failed single-edit save stays open', async () => {
  const harness = createHarness({
    runFaActionAwait: async () => false
  })
  harness.openSingleEditSlide(sampleListItem)
  await harness.saveSingleEditSlide()
  expect(harness.isSingleEditSlideOpen.value).toBe(true)
  expect(harness.singleEditDraft.value?.displayName).toBe('saved')
  await harness.saveSingleEditAndCloseDialog()
  expect(harness.dialogModel.value).toBe(true)
})

test('Test that createDialogProjectMedia single-edit save and close dismisses', async () => {
  const harness = createHarness()
  harness.openSingleEditSlide(sampleListItem)
  await harness.saveSingleEditAndCloseDialog()
  expect(harness.dialogModel.value).toBe(false)
})

test('Test that createDialogProjectMedia single-edit tab Close dismisses the dialog', () => {
  const harness = createHarness()
  harness.openSingleEditSlide(sampleListItem)
  harness.closeSingleEditDialog()
  expect(harness.dialogModel.value).toBe(false)
})
