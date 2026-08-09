import type Database from 'better-sqlite3'

import {
  FA_PROJECT_DOCUMENT_LAST_OPENED_MAX,
  FA_PROJECT_TABLE_DOCUMENTS,
  FA_PROJECT_TABLE_DOCUMENT_LAST_OPENED
} from '../functions/faProjectDbSchemaDdl'
import { FaProjectContentNotFoundError } from './faProjectContentNotFoundError'

/**
 * Upserts document_last_opened and trims oldest rows beyond the MRU max.
 */
export function recordFaProjectDocumentLastOpened (
  db: Database,
  documentId: string
): void {
  const existing = db
    .prepare(`SELECT id FROM ${FA_PROJECT_TABLE_DOCUMENTS} WHERE id = ?`)
    .get(documentId) as { id: string } | undefined
  if (existing === undefined) {
    throw new FaProjectContentNotFoundError('Document', documentId)
  }
  const openedAtMs = Date.now()
  db.prepare(
    `INSERT INTO ${FA_PROJECT_TABLE_DOCUMENT_LAST_OPENED} (document_id, opened_at_ms) ` +
      'VALUES (?, ?) ' +
      'ON CONFLICT(document_id) DO UPDATE SET opened_at_ms = excluded.opened_at_ms'
  ).run(documentId, openedAtMs)
  db.prepare(
    `DELETE FROM ${FA_PROJECT_TABLE_DOCUMENT_LAST_OPENED} ` +
      'WHERE rowid NOT IN (' +
      `SELECT rowid FROM ${FA_PROJECT_TABLE_DOCUMENT_LAST_OPENED} ` +
      'ORDER BY opened_at_ms DESC, rowid DESC ' +
      `LIMIT ${FA_PROJECT_DOCUMENT_LAST_OPENED_MAX}` +
      ')'
  ).run()
}
