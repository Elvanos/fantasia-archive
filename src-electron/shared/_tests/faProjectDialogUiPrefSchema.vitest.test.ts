import { expect, test } from 'vitest'

import {
  parseFaProjectDialogUiPrefGetInput,
  parseFaProjectDialogUiPrefSetInput
} from '../faProjectDialogUiPrefSchema'

/**
 * parseFaProjectDialogUiPrefGetInput
 * Accepts allowlisted key on a plain object.
 */
test('Test that parseFaProjectDialogUiPrefGetInput accepts last_selected_world_id', () => {
  expect(parseFaProjectDialogUiPrefGetInput({
    key: 'last_selected_world_id'
  })).toEqual({
    key: 'last_selected_world_id'
  })
})

/**
 * parseFaProjectDialogUiPrefGetInput
 * Rejects non-plain payloads with TypeError.
 */
test('Test that parseFaProjectDialogUiPrefGetInput rejects non-plain payloads', () => {
  expect(() => parseFaProjectDialogUiPrefGetInput(null)).toThrow(TypeError)
  expect(() => parseFaProjectDialogUiPrefGetInput([])).toThrow(TypeError)
  expect(() => parseFaProjectDialogUiPrefGetInput('x')).toThrow(TypeError)
  expect(() => parseFaProjectDialogUiPrefGetInput(Object.create(null))).toThrow(TypeError)
})

/**
 * parseFaProjectDialogUiPrefGetInput
 * Rejects unknown keys via Zod.
 */
test('Test that parseFaProjectDialogUiPrefGetInput rejects unknown keys', () => {
  expect(() => parseFaProjectDialogUiPrefGetInput({
    key: 'not_a_real_pref'
  })).toThrow()
})

/**
 * parseFaProjectDialogUiPrefSetInput
 * Accepts allowlisted key and string value.
 */
test('Test that parseFaProjectDialogUiPrefSetInput accepts key and value', () => {
  expect(parseFaProjectDialogUiPrefSetInput({
    key: 'last_selected_world_id',
    value: 'world-1'
  })).toEqual({
    key: 'last_selected_world_id',
    value: 'world-1'
  })
})

/**
 * parseFaProjectDialogUiPrefSetInput
 * Rejects non-plain payloads with TypeError.
 */
test('Test that parseFaProjectDialogUiPrefSetInput rejects non-plain payloads', () => {
  expect(() => parseFaProjectDialogUiPrefSetInput(null)).toThrow(TypeError)
  expect(() => parseFaProjectDialogUiPrefSetInput([])).toThrow(TypeError)
})

/**
 * parseFaProjectDialogUiPrefSetInput
 * Rejects values longer than 255 characters.
 */
test('Test that parseFaProjectDialogUiPrefSetInput rejects oversized values', () => {
  expect(() => parseFaProjectDialogUiPrefSetInput({
    key: 'last_selected_world_id',
    value: 'x'.repeat(256)
  })).toThrow()
})
