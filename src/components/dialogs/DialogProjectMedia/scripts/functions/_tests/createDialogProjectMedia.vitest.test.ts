import { expect, test } from 'vitest'

import type { I_faProjectMediaMassEditRow } from 'app/types/I_faProjectMediaDomain'
import type { I_ref } from 'app/types/I_vueCompositionShims'

import { createDialogProjectMedia } from '../createDialogProjectMedia'

function createRef<T> (value: T): I_ref<T> {
  return { value } as I_ref<T>
}

function createHarness (opts?: {
  incomingRows?: I_faProjectMediaMassEditRow[]
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
    createMassEditRowsFromOnlineUrlsDraft: () => incoming,
    getRequestedPanel: () => 'mediaMassEdit',
    isDialogProjectMediaDirectInput: (input) => input === 'ProjectMedia',
    isDialogProjectMediaStoreTarget: (dialogToOpen) => dialogToOpen === 'ProjectMedia',
    normalizeFaProjectMediaPanel: (value) => {
      if (value === 'mediaAdd' || value === 'mediaMassEdit') {
        return value
      }
      return 'mediaMassEdit'
    },
    onMounted: (hook) => {
      hook()
    },
    ref: createRef,
    registerComponentDialogStackGuard: () => undefined,
    resolveDialogComponentStore: () => null,
    watch: (source, effect) => {
      watchers.push({
        effect,
        last: source(),
        source
      })
    }
  })
  const bound = api.useDialogProjectMedia({
    directInput: 'ProjectMedia',
    initialPanel: 'mediaAdd'
  })
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
      internalLink: '',
      internalEmbed: null,
      createdAtMs: 0,
      updatedAtMs: 0,
      isNew: true
    }
  ]
  const harness = createHarness({ incomingRows: incoming })
  expect(harness.selectedPanel.value).toBe('mediaAdd')
  harness.submitOnlineUrls()
  expect(harness.massEditRows.value).toHaveLength(1)
  expect(harness.selectedPanel.value).toBe('mediaMassEdit')
  harness.submitOnlineUrls()
  expect(harness.massEditRows.value).toHaveLength(2)
})

test('Test that createDialogProjectMedia close clears mass-edit rows and add sub-view', () => {
  const incoming: I_faProjectMediaMassEditRow[] = [
    {
      id: 'a',
      displayName: 'one',
      type: 'external',
      internalType: 'linked_outside',
      externalType: 'linked',
      externalLink: 'https://a.test/one',
      internalLink: '',
      internalEmbed: null,
      createdAtMs: 0,
      updatedAtMs: 0,
      isNew: true
    }
  ]
  const harness = createHarness({ incomingRows: incoming })
  harness.showAddOnlineUrlsSubView()
  harness.onlineUrlsDraft.value = 'https://a.test/one'
  harness.submitOnlineUrls()
  expect(harness.massEditRows.value).toHaveLength(1)
  harness.dialogModel.value = false
  harness.runWatches()
  expect(harness.massEditRows.value).toHaveLength(0)
  expect(harness.addSubView.value).toBe('dropZone')
  expect(harness.onlineUrlsDraft.value).toBe('')
})
