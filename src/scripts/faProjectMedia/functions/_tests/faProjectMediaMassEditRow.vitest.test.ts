import { expect, test } from 'vitest'

import type { I_faProjectMediaMassEditRow } from 'app/types/I_faProjectMediaDomain'

import {
  appendFaProjectMediaMassEditIntakeRows,
  applyFaProjectMediaMassEditExternalTypePatch,
  applyFaProjectMediaMassEditInternalTypePatch,
  applyFaProjectMediaMassEditTypePatch,
  createFaProjectMediaMassEditRowFromOnlineUrl,
  createFaProjectMediaMassEditRowsFromOnlineUrlsDraft,
  isFaProjectMediaExternalType,
  isFaProjectMediaInternalType,
  isFaProjectMediaType,
  readFaSelectInputObjectId,
  resolveFaProjectMediaDisplayNameFromUrl,
  resolveFaProjectMediaMassEditFieldEnablement,
  splitFaProjectMediaOnlineUrlDraftLines
} from '../faProjectMediaMassEditRow'

function createIdSequence (): () => string {
  let n = 0
  return () => {
    n += 1
    return `id-${n}`
  }
}

function sampleRow (
  overrides: Partial<I_faProjectMediaMassEditRow> = {}
): I_faProjectMediaMassEditRow {
  return {
    id: 'id-1',
    displayName: 'bar',
    type: 'external',
    internalType: 'linked_outside',
    externalType: 'linked',
    externalLink: 'https://cdn.example.com/foo/bar.png',
    internalLink: '',
    internalEmbed: null,
    createdAtMs: 0,
    updatedAtMs: 0,
    isNew: true,
    ...overrides
  }
}

test('Test that splitFaProjectMediaOnlineUrlDraftLines skips blank lines', () => {
  expect(splitFaProjectMediaOnlineUrlDraftLines('  \nhttps://a.test/x\n\nhttps://b.test/y\r\n  ')).toEqual([
    'https://a.test/x',
    'https://b.test/y'
  ])
})

test('Test that resolveFaProjectMediaDisplayNameFromUrl uses last path segment without suffix', () => {
  expect(resolveFaProjectMediaDisplayNameFromUrl('https://cdn.example.com/foo/bar.png?x=1#h')).toBe(
    'bar'
  )
  expect(resolveFaProjectMediaDisplayNameFromUrl('https://cdn.example.com/')).toBe('')
  expect(resolveFaProjectMediaDisplayNameFromUrl('https://cdn.example.com')).toBe('')
  expect(resolveFaProjectMediaDisplayNameFromUrl('https://cdn.example.com/foo/')).toBe('foo')
  expect(resolveFaProjectMediaDisplayNameFromUrl('https://cdn.example.com/a%20b.png')).toBe('a b')
  expect(resolveFaProjectMediaDisplayNameFromUrl('https://cdn.example.com/%E0%A4%A')).toBe('%E0%A4%A')
  expect(resolveFaProjectMediaDisplayNameFromUrl('https://cdn.example.com/readme')).toBe('readme')
})

test('Test that createFaProjectMediaMassEditRowFromOnlineUrl builds an external linked row', () => {
  const row = createFaProjectMediaMassEditRowFromOnlineUrl({
    createId: () => 'uuid-1',
    url: 'https://cdn.example.com/foo/bar.png'
  })
  expect(row.id).toBe('uuid-1')
  expect(row.displayName).toBe('bar')
  expect(row.type).toBe('external')
  expect(row.internalType).toBe('linked_outside')
  expect(row.externalType).toBe('linked')
  expect(row.externalLink).toBe('https://cdn.example.com/foo/bar.png')
  expect(row.internalLink).toBe('')
  expect(row.internalEmbed).toBeNull()
  expect(row.isNew).toBe(true)
})

test('Test that createFaProjectMediaMassEditRowsFromOnlineUrlsDraft maps non-blank lines', () => {
  const rows = createFaProjectMediaMassEditRowsFromOnlineUrlsDraft({
    createId: createIdSequence(),
    draft: 'https://a.test/one.png\n\nhttps://b.test/two.jpg'
  })
  expect(rows).toHaveLength(2)
  expect(rows[0]?.id).toBe('id-1')
  expect(rows[0]?.displayName).toBe('one')
  expect(rows[1]?.id).toBe('id-2')
  expect(rows[1]?.displayName).toBe('two')
})

test('Test that appendFaProjectMediaMassEditIntakeRows concatenates rows', () => {
  const first = sampleRow({ id: 'a' })
  const second = sampleRow({ id: 'b' })
  expect(appendFaProjectMediaMassEditIntakeRows([first], [second]).map((row) => row.id)).toEqual([
    'a',
    'b'
  ])
})

test('Test that resolveFaProjectMediaMassEditFieldEnablement follows type and subtype', () => {
  expect(resolveFaProjectMediaMassEditFieldEnablement(sampleRow())).toEqual({
    externalLink: true,
    externalType: true,
    internalLink: false,
    internalType: false
  })
  expect(resolveFaProjectMediaMassEditFieldEnablement(sampleRow({
    type: 'internal',
    internalType: 'embedded',
    externalType: ''
  }))).toEqual({
    externalLink: false,
    externalType: false,
    internalLink: false,
    internalType: true
  })
  expect(resolveFaProjectMediaMassEditFieldEnablement(sampleRow({
    type: 'internal',
    internalType: 'linked_outside'
  })).internalLink).toBe(true)
  expect(resolveFaProjectMediaMassEditFieldEnablement(sampleRow({
    type: 'internal',
    internalType: 'linked_in_project'
  })).internalLink).toBe(true)
  expect(resolveFaProjectMediaMassEditFieldEnablement(sampleRow({
    externalType: ''
  })).externalLink).toBe(false)
})

test('Test that media type guards and select object id reader accept known values', () => {
  expect(isFaProjectMediaType('internal')).toBe(true)
  expect(isFaProjectMediaType('nope')).toBe(false)
  expect(isFaProjectMediaInternalType('')).toBe(true)
  expect(isFaProjectMediaInternalType('embedded')).toBe(true)
  expect(isFaProjectMediaInternalType('linked')).toBe(false)
  expect(isFaProjectMediaExternalType('')).toBe(true)
  expect(isFaProjectMediaExternalType('linked')).toBe(true)
  expect(isFaProjectMediaExternalType('nope')).toBe(false)
  expect(readFaSelectInputObjectId('internal')).toBe('internal')
  expect(readFaSelectInputObjectId({
    id: 'external',
    name: 'External'
  })).toBe('external')
  expect(readFaSelectInputObjectId('')).toBeNull()
  expect(readFaSelectInputObjectId(null)).toBeNull()
  expect(readFaSelectInputObjectId([])).toBeNull()
  expect(readFaSelectInputObjectId({ name: 'x' })).toBeNull()
  expect(readFaSelectInputObjectId({ id: '' })).toBeNull()
})

test('Test that mass-edit type patches apply known ids and ignore garbage', () => {
  const row = sampleRow()
  applyFaProjectMediaMassEditTypePatch(row, null)
  expect(row.type).toBe('external')
  applyFaProjectMediaMassEditTypePatch(row, 'nope')
  expect(row.type).toBe('external')
  applyFaProjectMediaMassEditTypePatch(row, {
    id: 'internal',
    name: 'Internal'
  })
  expect(row.type).toBe('internal')
  applyFaProjectMediaMassEditInternalTypePatch(row, '')
  expect(row.internalType).toBe('linked_outside')
  applyFaProjectMediaMassEditInternalTypePatch(row, 'linked_in_project')
  expect(row.internalType).toBe('linked_in_project')
  applyFaProjectMediaMassEditExternalTypePatch(row, 'nope')
  expect(row.externalType).toBe('linked')
  applyFaProjectMediaMassEditExternalTypePatch(row, {
    id: ''
  })
  expect(row.externalType).toBe('linked')
})
