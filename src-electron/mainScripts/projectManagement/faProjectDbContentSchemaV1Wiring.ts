import type { I_faProjectDbExec } from 'app/types/I_faProjectDbSchemaDdl'

import {
  applyFaProjectContentSchemaV1CoreTables,
  applyFaProjectContentSchemaV1DocumentsAndIndexes,
  applyFaProjectDocumentLastOpenedSchemaV1,
  applyFaProjectOpenedDocumentsSchemaV1,
  FA_PROJECT_TABLE_DOCUMENTS,
  FA_PROJECT_TABLE_DOCUMENT_TAGS,
  FA_PROJECT_TABLE_TAGS,
  FA_PROJECT_TABLE_WORLDS
} from './functions/faProjectDbSchemaDdl'
import { applyFaProjectContentSchemaV1TagsAndIndexes } from './functions/faProjectDbSchemaDdlTags'

/**
 * Creates worldbuilding content tables and indexes for schema version 1.
 * Idempotent when tables already exist.
 */
export function applyFaProjectContentSchemaV1 (db: I_faProjectDbExec): void {
  applyFaProjectContentSchemaV1CoreTables(db)
  applyFaProjectContentSchemaV1DocumentsAndIndexes(db)
  applyFaProjectContentSchemaV1TagsAndIndexes(db, {
    documents: FA_PROJECT_TABLE_DOCUMENTS,
    documentTags: FA_PROJECT_TABLE_DOCUMENT_TAGS,
    tags: FA_PROJECT_TABLE_TAGS,
    worlds: FA_PROJECT_TABLE_WORLDS
  })
  applyFaProjectOpenedDocumentsSchemaV1(db)
  applyFaProjectDocumentLastOpenedSchemaV1(db)
}
