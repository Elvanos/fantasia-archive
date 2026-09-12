import { expect, test } from 'vitest'

import type {
  I_faProjectMedia,
  I_faProjectMediaMassEditRow,
  T_faProjectMediaPanel
} from 'app/types/I_faProjectMediaDomain'
import type { I_ref } from 'app/types/I_vueCompositionShims'

import {
  applyDialogProjectMediaListLoad,
  attachDialogProjectMediaWatches,
  resetOnlineUrlsDraftIfEnteringPanel,
  resetSessionOnClose,
  resolveDialogProjectMediaSessionWatchKey,
  scheduleDialogProjectMediaListLoad,
  shouldReloadDialogProjectMediaList,
  submitOnlineUrlsIntake
} from '../dialogProjectMediaSession'

function createRef<T> (value: T): I_ref<T> {
  return { value } as I_ref<T>
}

function emptySingleEditSession () {
  return {
    singleEditBaseline: createRef<I_faProjectMediaMassEditRow | null>(null),
    singleEditDraft: createRef<I_faProjectMediaMassEditRow | null>(null),
    singleEditSlideOpen: createRef(false)
  }
}

const sampleMedia: I_faProjectMedia = {
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

const sampleRow: I_faProjectMediaMassEditRow = {
  ...sampleMedia,
  isNew: true
}

/**
 * shouldReloadDialogProjectMediaList
 * List reload only while the dialog is open on the list slide.
 */
test('Test that shouldReloadDialogProjectMediaList is true only for an open list panel', () => {
  expect(shouldReloadDialogProjectMediaList(true, 'mediaList')).toBe(true)
  expect(shouldReloadDialogProjectMediaList(false, 'mediaList')).toBe(false)
  expect(shouldReloadDialogProjectMediaList(true, 'mediaAdd')).toBe(false)
})

/**
 * resolveDialogProjectMediaSessionWatchKey
 * Dialog open flag and panel id become one watch key.
 */
test('Test that resolveDialogProjectMediaSessionWatchKey joins open state and panel', () => {
  expect(resolveDialogProjectMediaSessionWatchKey(true, 'mediaList')).toBe('true:mediaList')
  expect(resolveDialogProjectMediaSessionWatchKey(false, 'mediaAdd')).toBe('false:mediaAdd')
})

/**
 * resetOnlineUrlsDraftIfEnteringPanel
 * URL draft clears only when entering the paste slide.
 */
test('Test that resetOnlineUrlsDraftIfEnteringPanel clears only on the URL panel', () => {
  const draft = createRef('https://keep.test')
  resetOnlineUrlsDraftIfEnteringPanel('mediaAdd', draft)
  expect(draft.value).toBe('https://keep.test')
  resetOnlineUrlsDraftIfEnteringPanel('mediaAddOnlineUrls', draft)
  expect(draft.value).toBe('')
})

/**
 * resetSessionOnClose
 * Close clears rows and snaps the URL slide back to add.
 */
test('Test that resetSessionOnClose clears session state and snaps the URL panel', () => {
  const selectedPanel = createRef<T_faProjectMediaPanel>('mediaAddOnlineUrls')
  const onlineUrlsDraft = createRef('https://keep.test')
  const massEditRows = createRef([sampleRow])
  const listMediaItems = createRef([sampleMedia])
  const singleEditDraft = createRef<I_faProjectMediaMassEditRow | null>(sampleRow)
  const singleEditBaseline = createRef<I_faProjectMediaMassEditRow | null>(sampleRow)
  const singleEditSlideOpen = createRef(true)
  resetSessionOnClose(
    selectedPanel,
    onlineUrlsDraft,
    massEditRows,
    listMediaItems,
    singleEditDraft,
    singleEditBaseline,
    singleEditSlideOpen
  )
  expect(onlineUrlsDraft.value).toBe('')
  expect(massEditRows.value).toHaveLength(0)
  expect(listMediaItems.value).toHaveLength(0)
  expect(singleEditDraft.value).toBeNull()
  expect(singleEditBaseline.value).toBeNull()
  expect(singleEditSlideOpen.value).toBe(false)
  expect(selectedPanel.value).toBe('mediaAdd')
})

/**
 * resetSessionOnClose
 * Non-URL panels stay on their slide when the dialog closes.
 */
test('Test that resetSessionOnClose keeps a non-URL panel', () => {
  const selectedPanel = createRef<T_faProjectMediaPanel>('mediaList')
  const onlineUrlsDraft = createRef('')
  const massEditRows = createRef<I_faProjectMediaMassEditRow[]>([])
  const listMediaItems = createRef([sampleMedia])
  resetSessionOnClose(
    selectedPanel,
    onlineUrlsDraft,
    massEditRows,
    listMediaItems,
    createRef<I_faProjectMediaMassEditRow | null>(null),
    createRef<I_faProjectMediaMassEditRow | null>(null),
    createRef(false)
  )
  expect(selectedPanel.value).toBe('mediaList')
  expect(listMediaItems.value).toHaveLength(0)
})

/**
 * submitOnlineUrlsIntake
 * Empty intake is a no-op; nonempty appends and switches to mass-edit.
 */
test('Test that submitOnlineUrlsIntake appends rows or no-ops when empty', () => {
  const massEditRows = createRef<I_faProjectMediaMassEditRow[]>([])
  const onlineUrlsDraft = createRef('https://a.test')
  const selectedPanel = createRef<T_faProjectMediaPanel>('mediaAddOnlineUrls')
  submitOnlineUrlsIntake({
    createMassEditRowsFromOnlineUrlsDraft: () => [],
    massEditRows,
    onlineUrlsDraft,
    selectedPanel
  })
  expect(massEditRows.value).toHaveLength(0)
  expect(selectedPanel.value).toBe('mediaAddOnlineUrls')
  submitOnlineUrlsIntake({
    createMassEditRowsFromOnlineUrlsDraft: () => [sampleRow],
    massEditRows,
    onlineUrlsDraft,
    selectedPanel
  })
  expect(massEditRows.value).toEqual([sampleRow])
  expect(selectedPanel.value).toBe('mediaMassEdit')
})

/**
 * applyDialogProjectMediaListLoad
 * A newer generation wins over a slower earlier load.
 */
test('Test that applyDialogProjectMediaListLoad ignores a stale generation', async () => {
  const generation = { value: 0 }
  const listItems = createRef<I_faProjectMedia[]>([])
  let finishFirst: (items: I_faProjectMedia[]) => void = () => undefined
  const firstWave = new Promise<I_faProjectMedia[]>((resolve) => {
    finishFirst = resolve
  })
  let calls = 0
  const staleItem: I_faProjectMedia = {
    ...sampleMedia,
    id: 'stale'
  }
  const loadListMedia = async () => {
    calls += 1
    if (calls === 1) {
      return firstWave
    }
    return [sampleMedia]
  }
  const firstLoad = applyDialogProjectMediaListLoad({
    generation,
    listItems,
    loadListMedia
  })
  const secondLoad = applyDialogProjectMediaListLoad({
    generation,
    listItems,
    loadListMedia
  })
  finishFirst([staleItem])
  await firstLoad
  await secondLoad
  expect(listItems.value).toEqual([sampleMedia])
})

/**
 * scheduleDialogProjectMediaListLoad
 * Non-list panels skip the loader.
 */
test('Test that scheduleDialogProjectMediaListLoad skips when the list is not showing', async () => {
  let called = false
  scheduleDialogProjectMediaListLoad({
    dialogOpen: true,
    generation: { value: 0 },
    listItems: createRef<I_faProjectMedia[]>([]),
    loadListMedia: async () => {
      called = true
      return [sampleMedia]
    },
    selectedPanel: 'mediaAdd'
  })
  await Promise.resolve()
  expect(called).toBe(false)
})

/**
 * scheduleDialogProjectMediaListLoad
 * Open list panel starts a load.
 */
test('Test that scheduleDialogProjectMediaListLoad loads when the list is showing', async () => {
  const listItems = createRef<I_faProjectMedia[]>([])
  scheduleDialogProjectMediaListLoad({
    dialogOpen: true,
    generation: { value: 0 },
    listItems,
    loadListMedia: async () => [sampleMedia],
    selectedPanel: 'mediaList'
  })
  await Promise.resolve()
  await Promise.resolve()
  expect(listItems.value).toEqual([sampleMedia])
})

/**
 * attachDialogProjectMediaWatches
 * Store UUID, requested panel, URL reset, close, and list load.
 */
test('Test that attachDialogProjectMediaWatches opens, resets, and reloads the list', async () => {
  const watchers: Array<{
    effect: () => void
    last: unknown
    source: () => unknown
  }> = []
  const dialogModel = createRef(false)
  const selectedPanel = createRef<T_faProjectMediaPanel>('mediaAdd')
  const onlineUrlsDraft = createRef('https://keep.test')
  const massEditRows = createRef([sampleRow])
  const listMediaItems = createRef<I_faProjectMedia[]>([])
  let requestedPanel: T_faProjectMediaPanel = 'mediaList'
  let store: { dialogToOpen: unknown, dialogUUID: unknown } | null = {
    dialogToOpen: 'ProjectMedia',
    dialogUUID: 1
  }
  let opened: string | null = null
  attachDialogProjectMediaWatches({
    dialogModel,
    getDirectInput: () => undefined,
    getRequestedPanel: () => requestedPanel,
    isDialogProjectMediaDirectInput: (input) => input === 'ProjectMedia',
    isDialogProjectMediaStoreTarget: (dialogToOpen) => dialogToOpen === 'ProjectMedia',
    listLoadGeneration: { value: 0 },
    listMediaItems,
    loadListMedia: async () => [sampleMedia],
    massEditRows,
    onlineUrlsDraft,
    openDialog (input) {
      opened = input
      selectedPanel.value = requestedPanel
      dialogModel.value = true
    },
    resolveDialogComponentStore: () => store,
    selectedPanel,
    ...emptySingleEditSession(),
    watch (source, effect) {
      watchers.push({
        effect,
        last: source(),
        source
      })
    }
  })
  function runWatches (): void {
    for (const watcher of watchers) {
      const next = watcher.source()
      if (next !== watcher.last) {
        watcher.last = next
        watcher.effect()
      }
    }
  }
  store = {
    dialogToOpen: 'ProjectMedia',
    dialogUUID: 2
  }
  runWatches()
  expect(opened).toBe('ProjectMedia')
  expect(dialogModel.value).toBe(true)
  expect(selectedPanel.value).toBe('mediaList')
  runWatches()
  await Promise.resolve()
  await Promise.resolve()
  expect(listMediaItems.value).toEqual([sampleMedia])
  requestedPanel = 'mediaAddOnlineUrls'
  runWatches()
  expect(selectedPanel.value).toBe('mediaAddOnlineUrls')
  expect(onlineUrlsDraft.value).toBe('')
  onlineUrlsDraft.value = 'https://keep.test'
  dialogModel.value = false
  runWatches()
  expect(massEditRows.value).toHaveLength(0)
  expect(listMediaItems.value).toHaveLength(0)
  expect(selectedPanel.value).toBe('mediaAdd')
  expect(onlineUrlsDraft.value).toBe('')
})

/**
 * attachDialogProjectMediaWatches
 * Direct input watch opens Project Media.
 */
test('Test that attachDialogProjectMediaWatches opens from directInput', () => {
  const watchers: Array<{
    effect: () => void
    last: unknown
    source: () => unknown
  }> = []
  const dialogModel = createRef(false)
  const selectedPanel = createRef<T_faProjectMediaPanel>('mediaAdd')
  const directInput = { value: undefined as 'ProjectMedia' | undefined }
  let opened: string | null = null
  attachDialogProjectMediaWatches({
    dialogModel,
    getDirectInput: () => directInput.value,
    getRequestedPanel: () => 'mediaAdd',
    isDialogProjectMediaDirectInput: (input) => input === 'ProjectMedia',
    isDialogProjectMediaStoreTarget: () => false,
    listLoadGeneration: { value: 0 },
    listMediaItems: createRef<I_faProjectMedia[]>([]),
    loadListMedia: async () => [],
    massEditRows: createRef<I_faProjectMediaMassEditRow[]>([]),
    onlineUrlsDraft: createRef(''),
    openDialog (input) {
      opened = input
      dialogModel.value = true
    },
    resolveDialogComponentStore: () => null,
    selectedPanel,
    ...emptySingleEditSession(),
    watch (source, effect) {
      watchers.push({
        effect,
        last: source(),
        source
      })
    }
  })
  directInput.value = 'ProjectMedia'
  for (const watcher of watchers) {
    const next = watcher.source()
    if (next !== watcher.last) {
      watcher.last = next
      watcher.effect()
    }
  }
  expect(opened).toBe('ProjectMedia')
})

/**
 * attachDialogProjectMediaWatches
 * Store and directInput misses do not open; requested panel stays put while closed.
 */
test('Test that attachDialogProjectMediaWatches ignores non-project-media open signals', () => {
  const watchers: Array<{
    effect: () => void
    last: unknown
    source: () => unknown
  }> = []
  const dialogModel = createRef(false)
  const selectedPanel = createRef<T_faProjectMediaPanel>('mediaAdd')
  let requestedPanel: T_faProjectMediaPanel = 'mediaList'
  let store: { dialogToOpen: unknown, dialogUUID: unknown } | null = {
    dialogToOpen: 'AppSettings',
    dialogUUID: 1
  }
  let opened: string | null = null
  let propsDirectInput: 'AppSettings' | 'ProjectMedia' | undefined = 'AppSettings'
  attachDialogProjectMediaWatches({
    dialogModel,
    getDirectInput: () => propsDirectInput,
    getRequestedPanel: () => requestedPanel,
    isDialogProjectMediaDirectInput: (input) => input === 'ProjectMedia',
    isDialogProjectMediaStoreTarget: (dialogToOpen) => dialogToOpen === 'ProjectMedia',
    listLoadGeneration: { value: 0 },
    listMediaItems: createRef<I_faProjectMedia[]>([]),
    loadListMedia: async () => [],
    massEditRows: createRef<I_faProjectMediaMassEditRow[]>([]),
    onlineUrlsDraft: createRef(''),
    openDialog (input) {
      opened = input
    },
    resolveDialogComponentStore: () => store,
    selectedPanel,
    ...emptySingleEditSession(),
    watch (source, effect) {
      watchers.push({
        effect,
        last: source(),
        source
      })
    }
  })
  function runWatches (): void {
    for (const watcher of watchers) {
      const next = watcher.source()
      if (next !== watcher.last) {
        watcher.last = next
        watcher.effect()
      }
    }
  }
  store = {
    dialogToOpen: 'AppSettings',
    dialogUUID: 2
  }
  runWatches()
  expect(opened).toBeNull()
  store = null
  runWatches()
  expect(opened).toBeNull()
  requestedPanel = 'mediaMassEdit'
  runWatches()
  expect(selectedPanel.value).toBe('mediaAdd')
  propsDirectInput = undefined
  runWatches()
  expect(opened).toBeNull()
})
