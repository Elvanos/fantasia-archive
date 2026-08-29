import type { I_faProjectDbExec } from 'app/types/I_faProjectDbSchemaDdl'

/**
 * Creates tags tables and indexes for schema version 1.
 */
export function applyFaProjectContentSchemaV1TagsAndIndexes (
  db: I_faProjectDbExec,
  tables: {
    documents: string
    documentTags: string
    tags: string
    worlds: string
  }
): void {
  db.exec(`
CREATE TABLE IF NOT EXISTS ${tables.tags} (
  id TEXT NOT NULL PRIMARY KEY,
  world_id TEXT NOT NULL REFERENCES ${tables.worlds}(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (length(name) > 0),
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS ${tables.documentTags} (
  document_id TEXT NOT NULL REFERENCES ${tables.documents}(id) ON DELETE CASCADE,
  tag_id TEXT NOT NULL REFERENCES ${tables.tags}(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (document_id, tag_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_tags_world_id_name_nocase
  ON ${tables.tags}(world_id, name COLLATE NOCASE);
CREATE INDEX IF NOT EXISTS idx_tags_world_id ON ${tables.tags}(world_id);
CREATE INDEX IF NOT EXISTS idx_document_tags_tag_id_sort
  ON ${tables.documentTags}(tag_id, sort_order);
`)
}
