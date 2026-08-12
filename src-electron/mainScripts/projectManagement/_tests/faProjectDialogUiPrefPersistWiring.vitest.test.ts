import { expect, test, vi } from 'vitest'

import {
  readFaProjectDialogUiPref,
  upsertFaProjectDialogUiPref
} from '../faProjectDialogUiPrefPersistWiring'

const {
  readFaProjectDataKvMock,
  upsertFaProjectDataKvMock
} = vi.hoisted(() => {
  return {
    readFaProjectDataKvMock: vi.fn(),
    upsertFaProjectDataKvMock: vi.fn()
  }
})

vi.mock('../faProjectDataKvWiring', () => {
  return {
    readFaProjectDataKv: readFaProjectDataKvMock,
    upsertFaProjectDataKv: upsertFaProjectDataKvMock
  }
})

/**
 * readFaProjectDialogUiPref
 * Missing KV row → null value.
 */
test('Test that readFaProjectDialogUiPref returns null when the KV row is missing', () => {
  readFaProjectDataKvMock.mockReturnValueOnce(undefined)
  expect(readFaProjectDialogUiPref({} as never, 'last_selected_world_id')).toEqual({
    key: 'last_selected_world_id',
    value: null
  })
})

/**
 * readFaProjectDialogUiPref
 * Blank KV value → null.
 */
test('Test that readFaProjectDialogUiPref returns null for blank KV values', () => {
  readFaProjectDataKvMock.mockReturnValueOnce('   ')
  expect(readFaProjectDialogUiPref({} as never, 'last_selected_world_id')).toEqual({
    key: 'last_selected_world_id',
    value: null
  })
})

/**
 * readFaProjectDialogUiPref
 * Trimmed stored world id returned.
 */
test('Test that readFaProjectDialogUiPref returns the trimmed stored world id', () => {
  readFaProjectDataKvMock.mockReturnValueOnce('  world-a  ')
  expect(readFaProjectDialogUiPref({} as never, 'last_selected_world_id')).toEqual({
    key: 'last_selected_world_id',
    value: 'world-a'
  })
})

/**
 * upsertFaProjectDialogUiPref
 * Delegates to project_data upsert.
 */
test('Test that upsertFaProjectDialogUiPref writes through project_data KV', () => {
  upsertFaProjectDialogUiPref({} as never, 'last_selected_world_id', 'world-b')
  expect(upsertFaProjectDataKvMock).toHaveBeenCalledWith(
    expect.anything(),
    'last_selected_world_id',
    'world-b'
  )
})
