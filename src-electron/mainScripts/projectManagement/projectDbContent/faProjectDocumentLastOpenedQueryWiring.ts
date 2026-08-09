import type Database from 'better-sqlite3'

import {
  FA_PROJECT_DOCUMENT_BACKGROUND_COLOR_COLUMN,
  FA_PROJECT_DOCUMENT_IS_CATEGORY_COLUMN,
  FA_PROJECT_DOCUMENT_IS_DEAD_COLUMN,
  FA_PROJECT_DOCUMENT_LAST_OPENED_MAX,
  FA_PROJECT_DOCUMENT_TEXT_COLOR_COLUMN,
  FA_PROJECT_TABLE_DOCUMENTS,
  FA_PROJECT_TABLE_DOCUMENT_LAST_OPENED,
  FA_PROJECT_TABLE_DOCUMENT_TEMPLATES
} from '../functions/faProjectDbSchemaDdl'
import type {
  I_faProjectDocumentLastOpenedItem,
  I_faProjectDocumentLastOpenedListResult
} from 'app/types/I_faProjectDocumentLastOpenedDomain'

interface I_faSqlDocumentLastOpenedRow {
  document_id: string
  world_id: string
  template_id: string | null
  template_icon: string | null
  display_name: string
  document_text_color: string | null
  document_background_color: string | null
  is_category: number
  is_dead: number
  opened_at_ms: number
}

function mapFaProjectDocumentLastOpenedRow (
  row: I_faSqlDocumentLastOpenedRow
): I_faProjectDocumentLastOpenedItem {
  return {
    documentId: row.document_id,
    worldId: row.world_id,
    templateId: row.template_id,
    templateIcon: row.template_icon ?? '',
    displayName: row.display_name,
    documentTextColor: row.document_text_color,
    documentBackgroundColor: row.document_background_color,
    isCategory: row.is_category === 1,
    isDead: row.is_dead === 1,
    openedAtMs: row.opened_at_ms
  }
}

/**
 * Lists newest document_last_opened rows with document + template icon join.
 */
export function listFaProjectDocumentLastOpened (
  db: Database
): I_faProjectDocumentLastOpenedListResult {
  const rows = db
    .prepare(
      'SELECT dlo.document_id AS document_id, d.world_id AS world_id, ' +
        'd.template_id AS template_id, dt.icon AS template_icon, ' +
        'd.display_name AS display_name, ' +
        `d.${FA_PROJECT_DOCUMENT_TEXT_COLOR_COLUMN} AS document_text_color, ` +
        `d.${FA_PROJECT_DOCUMENT_BACKGROUND_COLOR_COLUMN} AS document_background_color, ` +
        `d.${FA_PROJECT_DOCUMENT_IS_CATEGORY_COLUMN} AS is_category, ` +
        `d.${FA_PROJECT_DOCUMENT_IS_DEAD_COLUMN} AS is_dead, ` +
        'dlo.opened_at_ms AS opened_at_ms ' +
        `FROM ${FA_PROJECT_TABLE_DOCUMENT_LAST_OPENED} dlo ` +
        `INNER JOIN ${FA_PROJECT_TABLE_DOCUMENTS} d ON d.id = dlo.document_id ` +
        `LEFT JOIN ${FA_PROJECT_TABLE_DOCUMENT_TEMPLATES} dt ON dt.id = d.template_id ` +
        'ORDER BY dlo.opened_at_ms DESC ' +
        `LIMIT ${FA_PROJECT_DOCUMENT_LAST_OPENED_MAX}`
    )
    .all() as I_faSqlDocumentLastOpenedRow[]
  return { items: rows.map(mapFaProjectDocumentLastOpenedRow) }
}
