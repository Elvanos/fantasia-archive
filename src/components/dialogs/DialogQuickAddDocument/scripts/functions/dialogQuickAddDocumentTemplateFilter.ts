import type { I_dialogQuickAddDocumentTemplateOption } from 'app/types/I_dialogQuickAddDocument'

/**
 * Filters template options by label substring (case-insensitive), FA 1.0 NewDocument parity.
 * Empty needle returns a shallow copy of all options.
 */
export function filterDialogQuickAddDocumentTemplateOptionsByNeedle (
  options: readonly I_dialogQuickAddDocumentTemplateOption[],
  needle: string
): I_dialogQuickAddDocumentTemplateOption[] {
  if (needle === '') {
    return [...options]
  }
  const lowerNeedle = needle.toLowerCase()
  return options.filter((row) => row.label.toLowerCase().indexOf(lowerNeedle) > -1)
}
