import { expect, test } from 'vitest'

import { parseFaProjectRecordDocumentLastOpenedPayload } from '../faProjectDocumentLastOpenedContentSchema'

const SAMPLE_UUID = '550e8400-e29b-41d4-a716-446655440000'

/**
 * parseFaProjectRecordDocumentLastOpenedPayload
 * Accepts a plain record with a document id.
 */
test('Test that parseFaProjectRecordDocumentLastOpenedPayload accepts documentId', () => {
  expect(parseFaProjectRecordDocumentLastOpenedPayload({
    documentId: SAMPLE_UUID
  })).toEqual({
    documentId: SAMPLE_UUID
  })
})

/**
 * parseFaProjectRecordDocumentLastOpenedPayload
 * Rejects non-plain payloads and strict-object extras.
 */
test('Test that parseFaProjectRecordDocumentLastOpenedPayload rejects invalid payloads', () => {
  expect(() => parseFaProjectRecordDocumentLastOpenedPayload(null)).toThrow(TypeError)
  expect(() => parseFaProjectRecordDocumentLastOpenedPayload([])).toThrow(TypeError)
  expect(() => parseFaProjectRecordDocumentLastOpenedPayload({
    documentId: SAMPLE_UUID,
    extra: true
  })).toThrow(/Unrecognized key/u)
})
