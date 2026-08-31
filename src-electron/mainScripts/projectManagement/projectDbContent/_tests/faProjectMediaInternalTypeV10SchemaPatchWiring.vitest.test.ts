import { expect, test } from 'vitest'

import { applyFaProjectMediaInternalTypeV10SchemaPatch } from '../faProjectMediaInternalTypeV10SchemaPatchWiring'

const v9MediaTableSql =
  "CREATE TABLE media (internal_type TEXT CHECK (internal_type IN ('', 'embedded', 'linked')))"

test('Test that applyFaProjectMediaInternalTypeV10SchemaPatch rebuilds when include column exists', () => {
  const execCalls: string[] = []
  const db = {
    exec: (sql: string) => {
      execCalls.push(sql)
    },
    pragma: () => {
      return [{ name: 'internal_is_project_included' }]
    },
    prepare: () => {
      return {
        get: () => {
          return { sql: v9MediaTableSql }
        }
      }
    }
  }

  applyFaProjectMediaInternalTypeV10SchemaPatch(db)
  expect(execCalls).toHaveLength(1)
  expect(execCalls[0]).toContain('linked_outside')
  expect(execCalls[0]).toContain('linked_in_project')
  expect(execCalls[0]).not.toContain('internal_is_project_included')
})

test('Test that applyFaProjectMediaInternalTypeV10SchemaPatch rebuilds when v9 internal_type CHECK remains', () => {
  const execCalls: string[] = []
  const db = {
    exec: (sql: string) => {
      execCalls.push(sql)
    },
    pragma: () => {
      return [{ name: 'internal_type' }]
    },
    prepare: () => {
      return {
        get: () => {
          return { sql: v9MediaTableSql }
        }
      }
    }
  }

  applyFaProjectMediaInternalTypeV10SchemaPatch(db)
  expect(execCalls).toHaveLength(1)
  expect(execCalls[0]).toContain('linked_outside')
})

test('Test that applyFaProjectMediaInternalTypeV10SchemaPatch skips v10 media tables', () => {
  const execCalls: string[] = []
  const db = {
    exec: (sql: string) => {
      execCalls.push(sql)
    },
    pragma: () => {
      return [{ name: 'internal_type' }]
    },
    prepare: () => {
      return {
        get: () => {
          return {
            sql:
              "CREATE TABLE media (internal_type TEXT CHECK (internal_type IN ('', 'embedded', " +
              "'linked_outside', 'linked_in_project')))"
          }
        }
      }
    }
  }

  applyFaProjectMediaInternalTypeV10SchemaPatch(db)
  expect(execCalls).toHaveLength(0)
})

test('Test that applyFaProjectMediaInternalTypeV10SchemaPatch skips when media table sql is missing', () => {
  const execCalls: string[] = []
  const db = {
    exec: (sql: string) => {
      execCalls.push(sql)
    },
    pragma: () => {
      return []
    }
  }

  applyFaProjectMediaInternalTypeV10SchemaPatch(db)
  expect(execCalls).toHaveLength(0)
})
