import type { I_faProjectDocumentLastOpenedItem } from 'app/types/I_faProjectDocumentLastOpenedDomain'

/**
 * Matches FA_ICON_PICKER_EMPTY_PLACEHOLDER_ICON / hierarchy template default.
 */
export const PROJECT_OVERVIEW_LAST_OPENED_EMPTY_TEMPLATE_ICON = 'mdi-file-outline'

/**
 * Resolves the list-row icon name (open folder for categories; template icon otherwise).
 */
export function resolveProjectOverviewLastOpenedIconName (
  item: Pick<I_faProjectDocumentLastOpenedItem, 'isCategory' | 'templateIcon'>
): string {
  if (item.isCategory) {
    return 'mdi-folder-open'
  }
  const templateIcon = item.templateIcon.trim()
  if (templateIcon.length > 0) {
    return templateIcon
  }
  return PROJECT_OVERVIEW_LAST_OPENED_EMPTY_TEMPLATE_ICON
}
