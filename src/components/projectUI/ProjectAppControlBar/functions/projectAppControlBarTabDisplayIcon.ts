import type { I_faOpenedDocumentTab } from 'app/types/I_faOpenedDocumentsDomain'

/**
 * Hierarchy tree category rows use the same MDI folder glyph.
 */
export const PROJECT_APP_CONTROL_BAR_CATEGORY_TAB_ICON = 'mdi-folder-open'

/**
 * Matches FA_ICON_PICKER_EMPTY_PLACEHOLDER_ICON / hierarchy template default.
 */
export const PROJECT_APP_CONTROL_BAR_EMPTY_TEMPLATE_ICON = 'mdi-file-outline'

/**
 * Tab / browse-row icon from the opened document's current category draft.
 */
export function resolveProjectAppControlBarTabDisplayIcon (
  tab: Pick<I_faOpenedDocumentTab, 'isCategoryDraft' | 'templateIcon'>
): string {
  if (tab.isCategoryDraft === true) {
    return PROJECT_APP_CONTROL_BAR_CATEGORY_TAB_ICON
  }
  const trimmed = tab.templateIcon.trim()
  if (trimmed.length > 0) {
    return trimmed
  }
  return PROJECT_APP_CONTROL_BAR_EMPTY_TEMPLATE_ICON
}
