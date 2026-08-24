import { Result } from 'neverthrow'
import { expect, test } from 'vitest'

import type { I_dialogComponentStoreLike } from 'app/types/I_dialogComponentStoreLike'

import { createResolveDialogComponentStore } from '../functions/createResolveDialogComponentStore'

const sampleStore: I_dialogComponentStoreLike = {
  dialogToOpen: 'ProjectMedia',
  dialogUUID: 'uuid-1'
}

/**
 * createResolveDialogComponentStore
 * Returns the store when getDialogComponentStore succeeds.
 */
test('Test that createResolveDialogComponentStore returns the store on success', () => {
  const api = createResolveDialogComponentStore({
    fromThrowable: Result.fromThrowable,
    getDialogComponentStore: () => sampleStore
  })

  expect(api.resolveDialogComponentStore()).toEqual(sampleStore)
})

/**
 * createResolveDialogComponentStore
 * Returns null when getDialogComponentStore throws.
 */
test('Test that createResolveDialogComponentStore returns null on error', () => {
  const api = createResolveDialogComponentStore({
    fromThrowable: Result.fromThrowable,
    getDialogComponentStore: () => {
      throw new Error('store unavailable')
    }
  })

  expect(api.resolveDialogComponentStore()).toBeNull()
})
