/**
 * One Apex series for the Project overview stacked distribution chart.
 */
export interface I_faProjectOverviewChartSeries {
  name: string
  color: string
  data: number[]
}

/**
 * Categories + series model for the Project overview stacked Apex chart.
 */
export interface I_faProjectOverviewStackedChartModel {
  categories: string[]
  series: I_faProjectOverviewChartSeries[]
  totalDocumentCount: number
}

/**
 * Apex custom tooltip callback args for Project overview stacked bars.
 */
export interface I_faProjectOverviewApexTooltipCustomInput {
  dataPointIndex: number
  series: number[][]
  seriesIndex: number
  w: {
    config?: {
      colors?: string[]
      xaxis?: {
        categories?: string[]
      }
    }
    globals: {
      categoryLabels?: string[]
      labels?: string[]
      seriesNames: string[]
    }
  }
}

/**
 * Apex custom tooltip callback for Project overview stacked bars.
 */
export type T_faProjectOverviewApexTooltipCustom = (
  tooltipInput: I_faProjectOverviewApexTooltipCustomInput
) => string
