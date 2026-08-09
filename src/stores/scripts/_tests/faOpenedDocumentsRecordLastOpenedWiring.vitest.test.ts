import { afterEach, expect, test, vi } from 'vitest'

import { recordFaOpenedDocumentLastOpenedBestEffort } from '../faOpenedDocumentsRecordLastOpenedWiring'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

/**
 * recordFaOpenedDocumentLastOpenedBestEffort
 * Calls projectContent.recordDocumentLastOpened when the bridge method exists.
 */
test('Test that recordFaOpenedDocumentLastOpenedBestEffort records via bridge', async () => {
  const recordDocumentLastOpened = vi.fn(async () => undefined)
  vi.stubGlobal('window', {
    faContentBridgeAPIs: {
      projectContent: {
        recordDocumentLastOpened
      }
    }
  })

  await recordFaOpenedDocumentLastOpenedBestEffort('doc-1')
  expect(recordDocumentLastOpened).toHaveBeenCalledWith({ documentId: 'doc-1' })
})

/**
 * recordFaOpenedDocumentLastOpenedBestEffort
 * No-ops when recordDocumentLastOpened is missing on the bridge.
 */
test('Test that recordFaOpenedDocumentLastOpenedBestEffort no-ops without bridge method', async () => {
  vi.stubGlobal('window', {
    faContentBridgeAPIs: {
      projectContent: {}
    }
  })

  await expect(recordFaOpenedDocumentLastOpenedBestEffort('doc-1')).resolves.toBeUndefined()
})

/**
 * recordFaOpenedDocumentLastOpenedBestEffort
 * Swallows bridge failures and logs a warning.
 */
test('Test that recordFaOpenedDocumentLastOpenedBestEffort warns on bridge failure', async () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
  vi.stubGlobal('window', {
    faContentBridgeAPIs: {
      projectContent: {
        recordDocumentLastOpened: vi.fn(async () => {
          throw new Error('ipc down')
        })
      }
    }
  })

  await expect(recordFaOpenedDocumentLastOpenedBestEffort('doc-1')).resolves.toBeUndefined()
  expect(warn).toHaveBeenCalled()
})
