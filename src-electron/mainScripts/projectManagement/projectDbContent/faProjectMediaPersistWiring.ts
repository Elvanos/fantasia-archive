import type Database from 'better-sqlite3'

import {
  FA_PROJECT_MEDIA_SELECT_SQL,
  FA_PROJECT_TABLE_MEDIA
} from '../functions/faProjectDbSchemaDdl'
import { mapFaProjectMediaRow } from '../functions/faProjectContentRowMap'
import {
  createFaProjectNamedEntity,
  deleteFaProjectNamedEntity,
  updateFaProjectNamedEntity
} from './faProjectContentNamedEntitySqlWiring'
import { FaProjectContentNotFoundError } from './faProjectContentNotFoundError'
import type { I_faSqlMediaRow } from 'app/types/I_faProjectContentRowMap'
import type {
  I_faProjectMedia,
  I_faProjectMediaCreateInput,
  I_faProjectMediaListResult,
  I_faProjectMediaPatch
} from 'app/types/I_faProjectMediaDomain'

const MEDIA_SPEC = {
  entityLabel: 'Media',
  tableName: FA_PROJECT_TABLE_MEDIA
}

const MEDIA_SELECT_BY_ID_SQL =
  `SELECT ${FA_PROJECT_MEDIA_SELECT_SQL} FROM ${FA_PROJECT_TABLE_MEDIA} WHERE id = ?`

const MEDIA_LIST_SQL =
  `SELECT ${FA_PROJECT_MEDIA_SELECT_SQL} FROM ${FA_PROJECT_TABLE_MEDIA} ` +
  'ORDER BY display_name COLLATE NOCASE ASC, created_at_ms ASC'

function assertMediaRowExists (
  row: I_faSqlMediaRow | undefined,
  id: string
): I_faSqlMediaRow {
  if (row === undefined) {
    throw new FaProjectContentNotFoundError(MEDIA_SPEC.entityLabel, id)
  }
  return row
}

function getFaProjectMediaSqlRowById (db: Database, id: string): I_faSqlMediaRow {
  const row = db.prepare(MEDIA_SELECT_BY_ID_SQL).get(id) as I_faSqlMediaRow | undefined
  return assertMediaRowExists(row, id)
}

export function createFaProjectMedia (
  db: Database,
  input: I_faProjectMediaCreateInput
): I_faProjectMedia {
  const created = createFaProjectNamedEntity(db, MEDIA_SPEC, input.displayName)
  return mapFaProjectMediaRow(getFaProjectMediaSqlRowById(db, created.id))
}

export function updateFaProjectMedia (
  db: Database,
  id: string,
  patch: I_faProjectMediaPatch
): I_faProjectMedia {
  updateFaProjectNamedEntity(db, MEDIA_SPEC, id, patch.displayName)
  return mapFaProjectMediaRow(getFaProjectMediaSqlRowById(db, id))
}

export function deleteFaProjectMedia (db: Database, id: string): void {
  deleteFaProjectNamedEntity(db, MEDIA_SPEC, id)
}

export function getFaProjectMediaById (db: Database, id: string): I_faProjectMedia {
  return mapFaProjectMediaRow(getFaProjectMediaSqlRowById(db, id))
}

export function listFaProjectMedia (db: Database): I_faProjectMediaListResult {
  const rows = db.prepare(MEDIA_LIST_SQL).all() as I_faSqlMediaRow[]
  const items = rows.map(mapFaProjectMediaRow)
  return { items }
}
