import type Database from 'better-sqlite3'

import { applyFaProjectDocumentLastOpenedSchemaV1 } from '../functions/faProjectDbSchemaDdl'

/**
 * Creates document_last_opened when missing (bootstrap + v8 migrate).
 */
export function applyFaProjectDocumentLastOpenedSchemaPatch (db: Database): void {
  applyFaProjectDocumentLastOpenedSchemaV1(db)
}
