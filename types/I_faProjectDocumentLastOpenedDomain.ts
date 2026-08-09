/**
 * IPC payload to record a document open in document_last_opened MRU.
 */
export interface I_faProjectRecordDocumentLastOpenedInput {
  documentId: string
}

/**
 * One last-opened document row for Project overview (saved documents only).
 */
export interface I_faProjectDocumentLastOpenedItem {
  documentId: string
  worldId: string
  templateId: string | null
  templateIcon: string
  displayName: string
  documentTextColor: string | null
  documentBackgroundColor: string | null
  isCategory: boolean
  isDead: boolean
  openedAtMs: number
}

export interface I_faProjectDocumentLastOpenedListResult {
  items: I_faProjectDocumentLastOpenedItem[]
}

/**
 * Stacked chart cell: document count for one template in one world.
 */
export interface I_faProjectDocumentDistributionCountCell {
  templateId: string
  worldId: string
  documentCount: number
}

/**
 * Template category for overview distribution chart (plural title for axis).
 */
export interface I_faProjectDocumentDistributionTemplateCategory {
  templateId: string
  titlePluralTranslationsJson: string
  icon: string
  sortOrder: number
}

/**
 * World series metadata for overview distribution chart.
 */
export interface I_faProjectDocumentDistributionWorldSeries {
  worldId: string
  displayNameTranslationsJson: string
  color: string
  sortOrder: number
}

/**
 * Aggregate payload for Project overview stacked document-distribution chart.
 * Chart `templates` = placed templates only (INNER JOIN placements).
 * `documentTemplateTotalCount` = all document_templates rows (incl. unassigned).
 */
export interface I_faProjectDocumentDistributionResult {
  counts: I_faProjectDocumentDistributionCountCell[]
  documentTemplateTotalCount: number
  templates: I_faProjectDocumentDistributionTemplateCategory[]
  totalDocumentCount: number
  worlds: I_faProjectDocumentDistributionWorldSeries[]
}
