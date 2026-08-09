import type { I_faProjectDocumentTemplateTitleSingularTranslations } from 'app/types/I_faProjectDocumentTemplateTitleSingularTranslations'
import type { I_faProjectDocumentTemplateTitleTranslations } from 'app/types/I_faProjectDocumentTemplateTitleTranslations'
import type { I_faProjectWorldDisplayNameTranslations } from 'app/types/I_faProjectWorldDisplayNameTranslations'

/** One layout group used when sorting Quick-Add templates like the hierarchy tree. */
export interface I_dialogQuickAddDocumentWorldLayoutGroup {
  id: string
  rootSortOrder: number
}

/** One layout placement used when sorting Quick-Add templates like the hierarchy tree. */
export interface I_dialogQuickAddDocumentWorldLayoutPlacement {
  documentTemplateId: string
  groupId: string | null
  groupSortOrder: number | null
  rootSortOrder: number | null
}

/** World row used to build Quick-Add world options and template filters. */
export interface I_dialogQuickAddDocumentWorldSource {
  id: string
  /** Raw worlds.color (#RRGGBB or empty). */
  color: string
  displayNameTranslations: I_faProjectWorldDisplayNameTranslations
  sortOrder: number
  templateLayout: {
    groups: ReadonlyArray<I_dialogQuickAddDocumentWorldLayoutGroup>
    placements: ReadonlyArray<I_dialogQuickAddDocumentWorldLayoutPlacement>
  }
}

/** Template meta used to build Quick-Add template options and new-document display names. */
export interface I_dialogQuickAddDocumentTemplateSource {
  id: string
  icon: string
  titlePluralTranslations: I_faProjectDocumentTemplateTitleTranslations
  titleSingularTranslations: I_faProjectDocumentTemplateTitleSingularTranslations
}

/** q-select option for the world field. */
export interface I_dialogQuickAddDocumentWorldOption {
  /** Raw worlds.color for fa-color-glyph styling. */
  color: string
  /** World glyph (mdi-earth), colored via option color. */
  icon: string
  label: string
  value: string
}

/** q-select option for the template field. */
export interface I_dialogQuickAddDocumentTemplateOption {
  icon: string
  label: string
  titlePluralTranslations: I_faProjectDocumentTemplateTitleTranslations
  titleSingularTranslations: I_faProjectDocumentTemplateTitleSingularTranslations
  value: string
}
