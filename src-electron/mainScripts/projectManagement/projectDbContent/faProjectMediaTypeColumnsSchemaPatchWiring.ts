import type { I_faProjectDbExec } from 'app/types/I_faProjectDbSchemaDdl'

import {
  FA_PROJECT_MEDIA_DEFAULT_TYPE,
  FA_PROJECT_MEDIA_EXTERNAL_LINK_COLUMN,
  FA_PROJECT_MEDIA_EXTERNAL_TYPE_COLUMN,
  FA_PROJECT_MEDIA_INTERNAL_EMBED_COLUMN,
  FA_PROJECT_MEDIA_INTERNAL_LINK_COLUMN,
  FA_PROJECT_MEDIA_INTERNAL_TYPE_COLUMN,
  FA_PROJECT_MEDIA_TYPE_COLUMN,
  FA_PROJECT_TABLE_MEDIA
} from '../functions/faProjectDbSchemaDdl'

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

function addFaProjectMediaColumnIfMissing (
  db: I_faProjectDbExec,
  columnNames: Set<string>,
  columnName: string,
  ddlFragment: string
): void {
  if (columnNames.has(columnName)) {
    return
  }
  db.exec(`ALTER TABLE ${FA_PROJECT_TABLE_MEDIA} ADD COLUMN ${ddlFragment}`)
  columnNames.add(columnName)
}

/**
 * Idempotent v9 patch: adds media type, link, and embed columns when missing.
 */
export function applyFaProjectMediaTypeColumnsSchemaPatch (db: I_faProjectDbExec): void {
  const columnNames = readFaProjectTableColumnNames(db, FA_PROJECT_TABLE_MEDIA)
  addFaProjectMediaColumnIfMissing(
    db,
    columnNames,
    FA_PROJECT_MEDIA_TYPE_COLUMN,
    `${FA_PROJECT_MEDIA_TYPE_COLUMN} TEXT NOT NULL DEFAULT '${FA_PROJECT_MEDIA_DEFAULT_TYPE}' ` +
    `CHECK (${FA_PROJECT_MEDIA_TYPE_COLUMN} IN ('external', 'internal'))`
  )
  addFaProjectMediaColumnIfMissing(
    db,
    columnNames,
    FA_PROJECT_MEDIA_INTERNAL_TYPE_COLUMN,
    `${FA_PROJECT_MEDIA_INTERNAL_TYPE_COLUMN} TEXT NOT NULL DEFAULT '' ` +
    `CHECK (${FA_PROJECT_MEDIA_INTERNAL_TYPE_COLUMN} IN ('', 'embedded', 'linked'))`
  )
  addFaProjectMediaColumnIfMissing(
    db,
    columnNames,
    FA_PROJECT_MEDIA_EXTERNAL_TYPE_COLUMN,
    `${FA_PROJECT_MEDIA_EXTERNAL_TYPE_COLUMN} TEXT NOT NULL DEFAULT '' ` +
    `CHECK (${FA_PROJECT_MEDIA_EXTERNAL_TYPE_COLUMN} IN ('', 'linked'))`
  )
  addFaProjectMediaColumnIfMissing(
    db,
    columnNames,
    FA_PROJECT_MEDIA_EXTERNAL_LINK_COLUMN,
    `${FA_PROJECT_MEDIA_EXTERNAL_LINK_COLUMN} TEXT NOT NULL DEFAULT ''`
  )
  addFaProjectMediaColumnIfMissing(
    db,
    columnNames,
    FA_PROJECT_MEDIA_INTERNAL_LINK_COLUMN,
    `${FA_PROJECT_MEDIA_INTERNAL_LINK_COLUMN} TEXT NOT NULL DEFAULT ''`
  )
  addFaProjectMediaColumnIfMissing(
    db,
    columnNames,
    FA_PROJECT_MEDIA_INTERNAL_EMBED_COLUMN,
    `${FA_PROJECT_MEDIA_INTERNAL_EMBED_COLUMN} BLOB`
  )
}
