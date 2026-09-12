import { expect, test } from 'vitest'

import { applyFaProjectMediaExternalEmbedV11SchemaPatch } from '../faProjectMediaExternalEmbedV11SchemaPatchWiring'

const v10MediaTableSql =
  "CREATE TABLE media (external_type TEXT CHECK (external_type IN ('', 'linked')))"

test('Test that applyFaProjectMediaExternalEmbedV11SchemaPatch rebuilds when embed column is missing', () => {
  const execCalls: string[] = []
  const db = {
    exec: (sql: string) => {
      execCalls.push(sql)
    },
    pragma: () => {
      return [{ name: 'external_type' }]
    },
    prepare: () => {
      return {
        get: () => {
          return { sql: v10MediaTableSql }
        }
      }
    }
  }

  applyFaProjectMediaExternalEmbedV11SchemaPatch(db)
  expect(execCalls).toHaveLength(1)
  expect(execCalls[0]).toContain('external_embed')
  expect(execCalls[0]).toContain("'embed'")
  expect(execCalls[0]).toMatch(/external_link,\s*'',\s*internal_link/)
})

test('Test that applyFaProjectMediaExternalEmbedV11SchemaPatch rebuilds when v10 external_type CHECK remains', () => {
  const execCalls: string[] = []
  const db = {
    exec: (sql: string) => {
      execCalls.push(sql)
    },
    pragma: () => {
      return [{ name: 'external_embed' }]
    },
    prepare: () => {
      return {
        get: () => {
          return { sql: v10MediaTableSql }
        }
      }
    }
  }

  applyFaProjectMediaExternalEmbedV11SchemaPatch(db)
  expect(execCalls).toHaveLength(1)
  expect(execCalls[0]).toMatch(/external_link,\s*external_embed,\s*internal_link/)
})

test('Test that applyFaProjectMediaExternalEmbedV11SchemaPatch skips v11 media tables', () => {
  const execCalls: string[] = []
  const db = {
    exec: (sql: string) => {
      execCalls.push(sql)
    },
    pragma: () => {
      return [{ name: 'external_embed' }]
    },
    prepare: () => {
      return {
        get: () => {
          return {
            sql:
              "CREATE TABLE media (external_type TEXT CHECK (external_type IN ('', 'linked', " +
              "'embed')))"
          }
        }
      }
    }
  }

  applyFaProjectMediaExternalEmbedV11SchemaPatch(db)
  expect(execCalls).toHaveLength(0)
})

test('Test that applyFaProjectMediaExternalEmbedV11SchemaPatch skips when media table sql is missing', () => {
  const execCalls: string[] = []
  const db = {
    exec: (sql: string) => {
      execCalls.push(sql)
    },
    pragma: () => {
      return []
    }
  }

  applyFaProjectMediaExternalEmbedV11SchemaPatch(db)
  expect(execCalls).toHaveLength(0)
})
