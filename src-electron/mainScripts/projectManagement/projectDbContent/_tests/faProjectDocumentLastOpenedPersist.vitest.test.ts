import Database from 'better-sqlite3'
import { afterEach, expect, test } from 'vitest'

import { applyFaProjectContentSchemaV1 } from '../../faProjectDbContentSchemaV1Wiring'
import {
  FA_PROJECT_DOCUMENT_LAST_OPENED_MAX
} from '../../functions/faProjectDbSchemaDdl'
import { createFaProjectDocument } from '../faProjectDocumentsPersistWiring'
import { createFaProjectDocumentTemplate } from '../faProjectDocumentTemplatesPersistWiring'
import { createFaProjectWorld } from '../faProjectWorldsPersistWiring'
import { replaceFaProjectWorldTemplateLayoutSnapshot } from '../faProjectWorldTemplateLayoutSnapshotWiring'
import { FaProjectContentNotFoundError } from '../faProjectContentNotFoundError'
import { recordFaProjectDocumentLastOpened } from '../faProjectDocumentLastOpenedPersistWiring'
import { listFaProjectDocumentLastOpened } from '../faProjectDocumentLastOpenedQueryWiring'

let db: Database | null = null

afterEach(() => {
  db?.close()
  db = null
})

function openLastOpenedTestDb (): Database {
  const connection = new Database(':memory:')
  applyFaProjectContentSchemaV1(connection)
  return connection
}

function seedWorldAndDocuments (
  connection: Database,
  count: number
): string[] {
  const world = createFaProjectWorld(connection, { displayName: 'Realm' })
  const template = createFaProjectDocumentTemplate(connection, { displayName: 'Character' })
  const placementId = 'placement-last-opened-1'
  replaceFaProjectWorldTemplateLayoutSnapshot(connection, world.id, {
    groups: [],
    placements: [{
      id: placementId,
      documentTemplateId: template.id,
      groupId: null,
      rootSortOrder: 0,
      groupSortOrder: null,
      nickname: '',
      nicknamePluralTranslations: {},
      nicknameSingularTranslations: {}
    }]
  })
  const ids: string[] = []
  for (let i = 0; i < count; i += 1) {
    const document = createFaProjectDocument(connection, {
      worldId: world.id,
      templateId: template.id,
      placementId,
      displayName: `Doc ${i}`,
      sortOrder: i
    })
    ids.push(document.id)
  }
  return ids
}

/**
 * recordFaProjectDocumentLastOpened
 * Trims oldest MRU rows so the table never exceeds FA_PROJECT_DOCUMENT_LAST_OPENED_MAX.
 */
test('Test that recordFaProjectDocumentLastOpened keeps only the newest max rows', () => {
  db = openLastOpenedTestDb()
  const ids = seedWorldAndDocuments(db, FA_PROJECT_DOCUMENT_LAST_OPENED_MAX + 5)
  for (const id of ids) {
    recordFaProjectDocumentLastOpened(db, id)
  }
  const listed = listFaProjectDocumentLastOpened(db)
  expect(listed.items).toHaveLength(FA_PROJECT_DOCUMENT_LAST_OPENED_MAX)
  const listedIds = new Set(listed.items.map((item) => item.documentId))
  for (const droppedId of ids.slice(0, 5)) {
    expect(listedIds.has(droppedId)).toBe(false)
  }
  for (const keptId of ids.slice(5)) {
    expect(listedIds.has(keptId)).toBe(true)
  }
})

/**
 * recordFaProjectDocumentLastOpened
 * Throws when the document id is not in documents.
 */
test('Test that recordFaProjectDocumentLastOpened throws when document is missing', () => {
  db = openLastOpenedTestDb()
  expect(() => {
    recordFaProjectDocumentLastOpened(db!, '550e8400-e29b-41d4-a716-446655440000')
  }).toThrow(FaProjectContentNotFoundError)
})
