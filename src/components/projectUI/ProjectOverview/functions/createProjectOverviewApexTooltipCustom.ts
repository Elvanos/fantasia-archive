import type {
  I_faProjectOverviewApexTooltipCustomInput,
  T_faProjectOverviewApexTooltipCustom
} from 'app/types/I_faProjectOverviewChart'

/**
 * Apex custom tooltip callback factory (segment = template category + world series).
 */
export function createProjectOverviewApexTooltipCustom (input: {
  buildTooltipHtml: (tooltipInput: {
    categoryLabel: string
    documentCount: number
    documentCountSeparator: string
    documentsLabelSuffix: string
    worldColor: string
    worldLabel: string
  }) => string
  documentCountSeparator: string
  documentsLabelSuffix: string
}): T_faProjectOverviewApexTooltipCustom {
  return (tooltipInput: I_faProjectOverviewApexTooltipCustomInput) => {
    const categoryFromConfig = tooltipInput.w.config?.xaxis?.categories?.[tooltipInput.dataPointIndex]
    const categoryLabels = tooltipInput.w.globals.categoryLabels ?? tooltipInput.w.globals.labels ?? []
    const categoryLabel = categoryFromConfig ?? categoryLabels[tooltipInput.dataPointIndex] ?? ''
    const worldLabel = tooltipInput.w.globals.seriesNames[tooltipInput.seriesIndex] ?? ''
    const worldColor = tooltipInput.w.config?.colors?.[tooltipInput.seriesIndex] ?? ''
    const documentCount = tooltipInput.series[tooltipInput.seriesIndex]?.[tooltipInput.dataPointIndex] ?? 0

    return input.buildTooltipHtml({
      categoryLabel,
      documentCount,
      documentCountSeparator: input.documentCountSeparator,
      documentsLabelSuffix: input.documentsLabelSuffix,
      worldColor,
      worldLabel
    })
  }
}
