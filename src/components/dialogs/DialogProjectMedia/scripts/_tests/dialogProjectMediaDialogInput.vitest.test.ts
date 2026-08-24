import { expect, test } from 'vitest'

import {
  isDialogProjectMediaDirectInput,
  isDialogProjectMediaStoreTarget
} from '../functions/dialogProjectMediaDialogInput'

/**
 * isDialogProjectMediaDirectInput / isDialogProjectMediaStoreTarget
 * Match only the ProjectMedia dialog name.
 */
test('Test that Project Media dialog input helpers match ProjectMedia only', () => {
  expect(isDialogProjectMediaDirectInput('ProjectMedia')).toBe(true)
  expect(isDialogProjectMediaDirectInput('NewProject')).toBe(false)
  expect(isDialogProjectMediaDirectInput(undefined)).toBe(false)
  expect(isDialogProjectMediaStoreTarget('ProjectMedia')).toBe(true)
  expect(isDialogProjectMediaStoreTarget('AboutFantasiaArchive')).toBe(false)
})
