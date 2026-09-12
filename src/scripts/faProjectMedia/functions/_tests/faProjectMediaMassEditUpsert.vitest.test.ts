import { expect, test } from 'vitest'

import type { I_faProjectMediaMassEditRow } from 'app/types/I_faProjectMediaDomain'

import {
  mapFaProjectMediaMassEditRowToUpsertItem,
  mapFaProjectMediaMassEditRowsToUpsertItems
} from '../faProjectMediaMassEditUpsert'

function sampleRow (
  overrides: Partial<I_faProjectMediaMassEditRow> = {}
): I_faProjectMediaMassEditRow {
  return {
    createdAtMs: 0,
    displayName: 'bar',
    externalEmbed: '',
    externalLink: 'https://cdn.example.com/foo/bar.png',
    externalType: 'linked',
    id: 'id-1',
    internalEmbed: null,
    internalLink: '',
    internalType: 'linked_outside',
    isNew: true,
    type: 'external',
    updatedAtMs: 0,
    ...overrides
  }
}

/**
 * mapFaProjectMediaMassEditRowToUpsertItem
 * Copies persist fields and drops blob / timestamps / isNew.
 */
test('Test that mapFaProjectMediaMassEditRowToUpsertItem copies persist fields', () => {
  const mapped = mapFaProjectMediaMassEditRowToUpsertItem(sampleRow(), 'Untitled')
  expect(mapped).toEqual({
    displayName: 'bar',
    externalEmbed: '',
    externalLink: 'https://cdn.example.com/foo/bar.png',
    externalType: 'linked',
    id: 'id-1',
    internalLink: '',
    internalType: 'linked_outside',
    type: 'external'
  })
})

/**
 * mapFaProjectMediaMassEditRowToUpsertItem
 * Blank titles become the untitled fallback.
 */
test('Test that mapFaProjectMediaMassEditRowToUpsertItem uses untitled when title is blank', () => {
  const mapped = mapFaProjectMediaMassEditRowToUpsertItem(
    sampleRow({ displayName: '   ' }),
    'Untitled'
  )
  expect(mapped.displayName).toBe('Untitled')
})

/**
 * mapFaProjectMediaMassEditRowsToUpsertItems
 * Maps every session row.
 */
test('Test that mapFaProjectMediaMassEditRowsToUpsertItems maps each row', () => {
  const mapped = mapFaProjectMediaMassEditRowsToUpsertItems(
    [sampleRow(), sampleRow({
      displayName: '',
      id: 'id-2'
    })],
    'Untitled'
  )
  expect(mapped).toHaveLength(2)
  expect(mapped[0]?.displayName).toBe('bar')
  expect(mapped[1]?.displayName).toBe('Untitled')
  expect(mapped[1]?.id).toBe('id-2')
})
