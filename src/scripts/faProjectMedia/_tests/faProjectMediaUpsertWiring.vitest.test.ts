/** @vitest-environment jsdom */
import { afterEach, expect, test, vi } from 'vitest'

import type { I_faProjectMediaUpsertItem } from 'app/types/I_faProjectMediaDomain'

import { upsertFaProjectMediaViaContentBridge } from '../faProjectMediaUpsertWiring'

vi.mock('app/i18n/externalFileLoader', () => {
  return {
    i18n: {
      global: {
        t: (key: string) => key
      }
    }
  }
})

const sampleItems: I_faProjectMediaUpsertItem[] = [{
  displayName: 'Art',
  externalEmbed: '',
  externalLink: 'https://cdn.example.test/art.png',
  externalType: 'linked',
  id: '550e8400-e29b-41d4-a716-446655440000',
  internalLink: '',
  internalType: '',
  type: 'external'
}]

afterEach(() => {
  vi.unstubAllGlobals()
})

/**
 * upsertFaProjectMediaViaContentBridge
 * Missing projectContent.upsertMedia throws the save error string.
 */
test('Test that upsertFaProjectMediaViaContentBridge throws without upsertMedia', async () => {
  vi.stubGlobal('window', { faContentBridgeAPIs: {} })
  await expect(upsertFaProjectMediaViaContentBridge(sampleItems)).rejects.toThrow(
    'dialogs.projectMedia.saveError'
  )
})

/**
 * upsertFaProjectMediaViaContentBridge
 * Successful IPC upsert resolves.
 */
test('Test that upsertFaProjectMediaViaContentBridge upserts items', async () => {
  const upsertMedia = vi.fn(async () => undefined)
  vi.stubGlobal('window', {
    faContentBridgeAPIs: {
      projectContent: {
        upsertMedia
      }
    }
  })
  await expect(upsertFaProjectMediaViaContentBridge(sampleItems)).resolves.toBeUndefined()
  expect(upsertMedia).toHaveBeenCalledWith(sampleItems)
})

/**
 * upsertFaProjectMediaViaContentBridge
 * Rejected upsertMedia throws the save error string.
 */
test('Test that upsertFaProjectMediaViaContentBridge throws when upsertMedia rejects', async () => {
  vi.stubGlobal('window', {
    faContentBridgeAPIs: {
      projectContent: {
        upsertMedia: async () => {
          throw new Error('ipc')
        }
      }
    }
  })
  await expect(upsertFaProjectMediaViaContentBridge(sampleItems)).rejects.toThrow(
    'dialogs.projectMedia.saveError'
  )
})
