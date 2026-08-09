/**
 * Escapes text for Apex custom tooltip HTML (project names are user-controlled).
 */
export function escapeProjectOverviewApexTooltipText (value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Escapes a CSS color for inline style (world colors are user-controlled hex).
 */
export function escapeProjectOverviewApexTooltipCssColor (value: string): string {
  return value.replace(/[;"'<>\\]/g, '')
}

/**
 * Builds FA Project overview stacked-bar tooltip HTML:
 * world swatch + "WORLD, TEMPLATE - COUNT documents".
 */
export function buildProjectOverviewApexChartTooltipHtml (input: {
  categoryLabel: string
  documentCount: number
  documentCountSeparator: string
  documentsLabelSuffix: string
  worldColor: string
  worldLabel: string
}): string {
  const title = `${escapeProjectOverviewApexTooltipText(input.worldLabel)}, ${escapeProjectOverviewApexTooltipText(input.categoryLabel)}`
  const separator = escapeProjectOverviewApexTooltipText(input.documentCountSeparator.trim())
  const countValue = escapeProjectOverviewApexTooltipText(String(input.documentCount))
  const documentsSuffix = escapeProjectOverviewApexTooltipText(input.documentsLabelSuffix.trim())
  const worldColor = escapeProjectOverviewApexTooltipCssColor(input.worldColor)
  const swatchHtml = worldColor.length > 0
    ? `<span class="projectOverview__worldLegendSwatch" style="background-color: ${worldColor}" aria-hidden="true"></span>`
    : ''

  return [
    '<div class="projectOverview__graphTooltip">',
    '<div class="projectOverview__graphTooltipTitleRow">',
    swatchHtml,
    '<div class="projectOverview__graphTooltipTitle">',
    `<span class="projectOverview__graphTooltipLabel">${title}</span>`,
    `<span class="projectOverview__graphTooltipSeparator">${separator}</span>`,
    `<span class="projectOverview__graphTooltipCountValue">${countValue}</span>`,
    `<span class="projectOverview__graphTooltipDocumentsSuffix">${documentsSuffix}</span>`,
    '</div>',
    '</div>',
    '</div>'
  ].join('')
}
