import { expect, test } from 'vitest'

import { applyFaProjectMediaTypeColumnsSchemaPatch } from '../faProjectMediaTypeColumnsSchemaPatchWiring'

const FA_PROJECT_MEDIA_TYPE_COLUMN_NAMES = [
  'type',
  'internal_type',
  'external_type',
  'external_link',
  'internal_link',
  'internal_embed'
] as const

test('Test that applyFaProjectMediaTypeColumnsSchemaPatch adds media type columns idempotently', () => {
  const execCalls: string[] = []
  const db = {
    exec: (sql: string) => {
      execCalls.push(sql)
    },
    pragma: () => {
      return []
    }
  }

  applyFaProjectMediaTypeColumnsSchemaPatch(db)
  expect(execCalls).toHaveLength(FA_PROJECT_MEDIA_TYPE_COLUMN_NAMES.length)
  expect(execCalls[0]).toContain('type')
  expect(execCalls[5]).toContain('internal_embed')
  expect(execCalls.some((sql) => sql.includes('internal_is_project_included'))).toBe(false)

  const secondDb = {
    exec: (sql: string) => {
      execCalls.push(sql)
    },
    pragma: () => {
      return FA_PROJECT_MEDIA_TYPE_COLUMN_NAMES.map((name) => {
        return { name }
      })
    }
  }
  applyFaProjectMediaTypeColumnsSchemaPatch(secondDb)
  expect(execCalls).toHaveLength(FA_PROJECT_MEDIA_TYPE_COLUMN_NAMES.length)
})
