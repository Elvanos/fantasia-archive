import { expect, test } from 'vitest'

import type {
  I_faProjectMedia,
  I_faProjectMediaMassEditRow
} from 'app/types/I_faProjectMediaDomain'

import {
  isFaProjectMediaMassEditRowDirty,
  mapFaProjectMediaToMassEditRow
} from '../faProjectMediaMassEditDraft'

const sampleMedia: I_faProjectMedia = {
  createdAtMs: 11,
  displayName: 'bar',
  externalEmbed: '',
  externalLink: 'https://cdn.example.com/foo/bar.png',
  externalType: 'linked',
  id: 'row-1',
  internalEmbed: null,
  internalLink: '',
  internalType: 'linked_outside',
  type: 'external',
  updatedAtMs: 22
}

function sampleRow (
  overrides: Partial<I_faProjectMediaMassEditRow> = {}
): I_faProjectMediaMassEditRow {
  return {
    ...mapFaProjectMediaToMassEditRow(sampleMedia),
    ...overrides
  }
}

/**
 * mapFaProjectMediaToMassEditRow
 * Saved media become session rows with isNew false.
 */
test('Test that mapFaProjectMediaToMassEditRow copies persist fields with isNew false', () => {
  const row = mapFaProjectMediaToMassEditRow(sampleMedia)
  expect(row.isNew).toBe(false)
  expect(row.id).toBe('row-1')
  expect(row.displayName).toBe('bar')
  expect(row.type).toBe('external')
  expect(row.internalType).toBe('linked_outside')
  expect(row.externalType).toBe('linked')
  expect(row.externalLink).toBe('https://cdn.example.com/foo/bar.png')
  expect(row.externalEmbed).toBe('')
  expect(row.internalLink).toBe('')
  expect(row.internalEmbed).toBeNull()
  expect(row.createdAtMs).toBe(11)
  expect(row.updatedAtMs).toBe(22)
})

/**
 * mapFaProjectMediaToMassEditRow
 * Two maps do not share the same object.
 */
test('Test that mapFaProjectMediaToMassEditRow returns a distinct row object', () => {
  const first = mapFaProjectMediaToMassEditRow(sampleMedia)
  const second = mapFaProjectMediaToMassEditRow(sampleMedia)
  expect(first).not.toBe(second)
  first.displayName = 'changed'
  expect(second.displayName).toBe('bar')
})

/**
 * isFaProjectMediaMassEditRowDirty
 * Null draft or baseline is clean. Matching persist fields are clean.
 */
test('Test that isFaProjectMediaMassEditRowDirty is false for nulls and matching rows', () => {
  const row = sampleRow()
  expect(isFaProjectMediaMassEditRowDirty(null, row)).toBe(false)
  expect(isFaProjectMediaMassEditRowDirty(row, null)).toBe(false)
  expect(isFaProjectMediaMassEditRowDirty(null, null)).toBe(false)
  expect(isFaProjectMediaMassEditRowDirty(row, sampleRow())).toBe(false)
})

/**
 * isFaProjectMediaMassEditRowDirty
 * Each persist field change is dirty. Timestamps, isNew, and blob are ignored.
 */
test('Test that isFaProjectMediaMassEditRowDirty follows persist fields only', () => {
  const baseline = sampleRow()
  expect(isFaProjectMediaMassEditRowDirty(sampleRow({ displayName: 'x' }), baseline)).toBe(true)
  expect(isFaProjectMediaMassEditRowDirty(sampleRow({ type: 'internal' }), baseline)).toBe(true)
  expect(isFaProjectMediaMassEditRowDirty(
    sampleRow({ internalType: 'embedded' }),
    baseline
  )).toBe(true)
  expect(isFaProjectMediaMassEditRowDirty(sampleRow({ externalType: 'embed' }), baseline)).toBe(true)
  expect(isFaProjectMediaMassEditRowDirty(
    sampleRow({ externalLink: 'https://other.test' }),
    baseline
  )).toBe(true)
  expect(isFaProjectMediaMassEditRowDirty(
    sampleRow({ externalEmbed: '<iframe></iframe>' }),
    baseline
  )).toBe(true)
  expect(isFaProjectMediaMassEditRowDirty(sampleRow({ internalLink: 'doc-1' }), baseline)).toBe(true)
  expect(isFaProjectMediaMassEditRowDirty(sampleRow({ createdAtMs: 99 }), baseline)).toBe(false)
  expect(isFaProjectMediaMassEditRowDirty(sampleRow({ updatedAtMs: 99 }), baseline)).toBe(false)
  expect(isFaProjectMediaMassEditRowDirty(sampleRow({ isNew: true }), baseline)).toBe(false)
  expect(isFaProjectMediaMassEditRowDirty(
    sampleRow({ internalEmbed: new Uint8Array([1]) }),
    baseline
  )).toBe(false)
})
