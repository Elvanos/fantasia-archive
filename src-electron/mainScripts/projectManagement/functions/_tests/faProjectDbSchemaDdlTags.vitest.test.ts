import { expect, test, vi } from 'vitest'

import { applyFaProjectContentSchemaV1TagsAndIndexes } from '../faProjectDbSchemaDdlTags'

/**
 * applyFaProjectContentSchemaV1TagsAndIndexes
 * Executes tags and document_tags DDL for schema version 1.
 */
test('Test that applyFaProjectContentSchemaV1TagsAndIndexes runs exec with tags tables', () => {
  const exec = vi.fn()
  applyFaProjectContentSchemaV1TagsAndIndexes(
    {
      exec,
      pragma: vi.fn()
    },
    {
      documents: 'documents',
      documentTags: 'document_tags',
      tags: 'tags',
      worlds: 'worlds'
    }
  )
  expect(exec).toHaveBeenCalledOnce()
  const sql = exec.mock.calls[0]![0]! as string
  expect(sql).toContain('tags')
  expect(sql).toContain('document_tags')
  expect(sql).toContain('idx_tags_world_id_name_nocase')
})
