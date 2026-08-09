import type { T_faProjectOverviewEmptyCtaMode } from 'app/types/I_faProjectOverview'

/**
 * Empty-project CTA when document count is zero:
 * no templates → create template; templates but no world placements → assign;
 * templates with ≥1 placement → create document.
 */
export function resolveProjectOverviewEmptyCtaMode (input: {
  hasDocumentTemplates: boolean
  hasWorldTemplatePlacements: boolean
}): T_faProjectOverviewEmptyCtaMode {
  if (!input.hasDocumentTemplates) {
    return 'createTemplate'
  }
  if (!input.hasWorldTemplatePlacements) {
    return 'assignTemplate'
  }
  return 'createDocument'
}
