import type { I_faProjectDbExec } from 'app/types/I_faProjectDbSchemaDdl'

import {
  FA_PROJECT_MEDIA_DEFAULT_TYPE,
  FA_PROJECT_MEDIA_EXTERNAL_EMBED_COLUMN,
  FA_PROJECT_MEDIA_EXTERNAL_LINK_COLUMN,
  FA_PROJECT_MEDIA_EXTERNAL_TYPE_CHECK_SQL,
  FA_PROJECT_MEDIA_EXTERNAL_TYPE_COLUMN,
  FA_PROJECT_MEDIA_INTERNAL_EMBED_COLUMN,
  FA_PROJECT_MEDIA_INTERNAL_LINK_COLUMN,
  FA_PROJECT_MEDIA_INTERNAL_TYPE_CHECK_SQL,
  FA_PROJECT_MEDIA_INTERNAL_TYPE_COLUMN,
  FA_PROJECT_MEDIA_TYPE_COLUMN,
  FA_PROJECT_TABLE_MEDIA
} from '../functions/faProjectDbSchemaDdl'

const MEDIA_REBUILD_TABLE_NAME = `${FA_PROJECT_TABLE_MEDIA}__fa_v11`

const FA_PROJECT_MEDIA_V11_EXTERNAL_TYPE_CHECK_PATTERN =
  /IN\s*\(\s*''\s*,\s*'linked'\s*,\s*'embed'\s*\)/

type T_tableInfoRow = {
  name: string
}

function readFaProjectTableColumnNames (
  db: I_faProjectDbExec,
  tableName: string
): Set<string> {
  const rows = (db.pragma(`table_info(${tableName})`) as T_tableInfoRow[] | undefined) ?? []
  return new Set(rows.map((row) => row.name))
}

function readFaProjectMediaTableSql (db: I_faProjectDbExec): string | null {
  if (typeof db.prepare !== 'function') {
    return null
  }
  const statement = db.prepare(
    'SELECT sql AS sql FROM sqlite_master WHERE type = ? AND name = ?'
  )
  if (statement == null || typeof statement.get !== 'function') {
    return null
  }
  const row = statement.get('table', FA_PROJECT_TABLE_MEDIA) as { sql?: string } | undefined
  const sql = row?.sql
  if (typeof sql !== 'string' || sql.trim().length === 0) {
    return null
  }
  return sql
}

function faProjectMediaTableSqlHasV11ExternalTypeCheck (tableSql: string): boolean {
  return FA_PROJECT_MEDIA_V11_EXTERNAL_TYPE_CHECK_PATTERN.test(tableSql)
}

/**
 * Rebuilds media to v11: external_embed TEXT; external_type allows embed.
 */
export function rebuildFaProjectMediaTableForV11 (db: I_faProjectDbExec): void {
  const columnNames = readFaProjectTableColumnNames(db, FA_PROJECT_TABLE_MEDIA)
  const embedSource = columnNames.has(FA_PROJECT_MEDIA_EXTERNAL_EMBED_COLUMN)
    ? FA_PROJECT_MEDIA_EXTERNAL_EMBED_COLUMN
    : "''"
  db.exec(`
PRAGMA foreign_keys=OFF;
DROP TABLE IF EXISTS ${MEDIA_REBUILD_TABLE_NAME};
CREATE TABLE ${MEDIA_REBUILD_TABLE_NAME} (
  id TEXT NOT NULL PRIMARY KEY,
  display_name TEXT NOT NULL CHECK (length(display_name) > 0),
  ${FA_PROJECT_MEDIA_TYPE_COLUMN} TEXT NOT NULL DEFAULT '${FA_PROJECT_MEDIA_DEFAULT_TYPE}'
  CHECK (${FA_PROJECT_MEDIA_TYPE_COLUMN} IN ('external', 'internal')),
  ${FA_PROJECT_MEDIA_INTERNAL_TYPE_COLUMN} TEXT NOT NULL DEFAULT ''
  CHECK ${FA_PROJECT_MEDIA_INTERNAL_TYPE_CHECK_SQL},
  ${FA_PROJECT_MEDIA_EXTERNAL_TYPE_COLUMN} TEXT NOT NULL DEFAULT ''
  CHECK ${FA_PROJECT_MEDIA_EXTERNAL_TYPE_CHECK_SQL},
  ${FA_PROJECT_MEDIA_EXTERNAL_LINK_COLUMN} TEXT NOT NULL DEFAULT '',
  ${FA_PROJECT_MEDIA_EXTERNAL_EMBED_COLUMN} TEXT NOT NULL DEFAULT '',
  ${FA_PROJECT_MEDIA_INTERNAL_LINK_COLUMN} TEXT NOT NULL DEFAULT '',
  ${FA_PROJECT_MEDIA_INTERNAL_EMBED_COLUMN} BLOB,
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL
);
INSERT INTO ${MEDIA_REBUILD_TABLE_NAME} (
  id,
  display_name,
  ${FA_PROJECT_MEDIA_TYPE_COLUMN},
  ${FA_PROJECT_MEDIA_INTERNAL_TYPE_COLUMN},
  ${FA_PROJECT_MEDIA_EXTERNAL_TYPE_COLUMN},
  ${FA_PROJECT_MEDIA_EXTERNAL_LINK_COLUMN},
  ${FA_PROJECT_MEDIA_EXTERNAL_EMBED_COLUMN},
  ${FA_PROJECT_MEDIA_INTERNAL_LINK_COLUMN},
  ${FA_PROJECT_MEDIA_INTERNAL_EMBED_COLUMN},
  created_at_ms,
  updated_at_ms
)
SELECT
  id,
  display_name,
  ${FA_PROJECT_MEDIA_TYPE_COLUMN},
  ${FA_PROJECT_MEDIA_INTERNAL_TYPE_COLUMN},
  ${FA_PROJECT_MEDIA_EXTERNAL_TYPE_COLUMN},
  ${FA_PROJECT_MEDIA_EXTERNAL_LINK_COLUMN},
  ${embedSource},
  ${FA_PROJECT_MEDIA_INTERNAL_LINK_COLUMN},
  ${FA_PROJECT_MEDIA_INTERNAL_EMBED_COLUMN},
  created_at_ms,
  updated_at_ms
FROM ${FA_PROJECT_TABLE_MEDIA};
DROP TABLE ${FA_PROJECT_TABLE_MEDIA};
ALTER TABLE ${MEDIA_REBUILD_TABLE_NAME} RENAME TO ${FA_PROJECT_TABLE_MEDIA};
PRAGMA foreign_keys=ON;
`)
}

function faProjectMediaTableNeedsV11Rebuild (
  columnNames: Set<string>,
  tableSql: string | null
): boolean {
  if (tableSql === null) {
    return false
  }
  const hasEmbedColumn = columnNames.has(FA_PROJECT_MEDIA_EXTERNAL_EMBED_COLUMN)
  const hasEmbedCheck = faProjectMediaTableSqlHasV11ExternalTypeCheck(tableSql)
  return !hasEmbedColumn || !hasEmbedCheck
}

/**
 * Idempotent v11 patch: rebuilds media when external_embed or embed CHECK is missing.
 */
export function applyFaProjectMediaExternalEmbedV11SchemaPatch (db: I_faProjectDbExec): void {
  const columnNames = readFaProjectTableColumnNames(db, FA_PROJECT_TABLE_MEDIA)
  const tableSql = readFaProjectMediaTableSql(db)
  if (!faProjectMediaTableNeedsV11Rebuild(columnNames, tableSql)) {
    return
  }
  rebuildFaProjectMediaTableForV11(db)
}
