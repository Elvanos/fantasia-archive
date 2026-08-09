import type {
  I_faProjectOverviewStackedChartModel,
  T_faProjectOverviewApexTooltipCustom
} from 'app/types/I_faProjectOverviewChart'
import type { T_faAppThemeSkin } from 'app/types/faUserSettingsAppThemeRegistry'

export const FA_PROJECT_OVERVIEW_CHART_SETTLE_MS = 600

/**
 * FA 1.0 ProjectScreen used height 425 with CSS svg height 425px + content-box
 * padding-bottom so diagonal category labels have room under the plot.
 * +20 after title/pad tighten (keep in sync with $projectOverview-graph-apex-svg-height).
 */
export const FA_PROJECT_OVERVIEW_CHART_HEIGHT_PX = 445
/**
 * Same card delta as tips-hidden containers (808 - 587 = 221).
 * Keep in sync with $projectOverview-graph-apex-svg-height-tipsHidden (height + 2).
 */
export const FA_PROJECT_OVERVIEW_CHART_HEIGHT_TIPS_HIDDEN_PX = 666
/**
 * Flat theme subtitle margin is 23px taller than fantasy (-8 vs 15).
 * Keep in sync with FA_PROJECT_OVERVIEW_GRAPH_HEIGHT_FLAT_THEME_OFFSET_PX.
 */
export const FA_PROJECT_OVERVIEW_CHART_HEIGHT_FLAT_THEME_OFFSET_PX = 23
/** CSS svg height is Apex height + 2px (see $projectOverview-graph-apex-svg-height). */
export const FA_PROJECT_OVERVIEW_CHART_SVG_HEIGHT_EXTRA_PX = 2
/**
 * Apex default maxHeight is 120 — long rotated titles need a bit more before clip.
 * Keep in sync with bottom padding / svg overflow under the plot.
 */
export const FA_PROJECT_OVERVIEW_CHART_XAXIS_LABELS_MAX_HEIGHT_PX = 130
/** Extra top pad so stacked totals sit clear of the plot edge. */
export const FA_PROJECT_OVERVIEW_CHART_TOP_RESERVED_PX = 28

/**
 * Apex chart height from Hide tips + flat/fantasy skin.
 */
export function resolveProjectOverviewChartHeightPx (input: {
  hideTooltipsProject: boolean
  themeSkin: T_faAppThemeSkin
}): number {
  const baseHeight = input.hideTooltipsProject
    ? FA_PROJECT_OVERVIEW_CHART_HEIGHT_TIPS_HIDDEN_PX
    : FA_PROJECT_OVERVIEW_CHART_HEIGHT_PX
  if (input.themeSkin === 'flat') {
    return baseHeight - FA_PROJECT_OVERVIEW_CHART_HEIGHT_FLAT_THEME_OFFSET_PX
  }
  return baseHeight
}

/**
 * CSS svg height paired with Apex chart height.
 */
export function resolveProjectOverviewChartSvgHeightPx (chartHeightPx: number): number {
  return chartHeightPx + FA_PROJECT_OVERVIEW_CHART_SVG_HEIGHT_EXTRA_PX
}

/**
 * FA 1.0-style diagonal category labels for the overview stacked bar chart.
 */
function buildProjectOverviewApexXaxis (categories: string[]): Record<string, unknown> {
  return {
    axisBorder: {
      show: true
    },
    axisTicks: {
      show: false
    },
    categories,
    crosshairs: {
      fill: {
        gradient: {
          colorFrom: 'transparent',
          colorTo: 'transparent',
          opacityFrom: 0,
          opacityTo: 0,
          stops: [0, 100]
        },
        type: 'gradient'
      },
      show: false
    },
    labels: {
      hideOverlappingLabels: false,
      maxHeight: FA_PROJECT_OVERVIEW_CHART_XAXIS_LABELS_MAX_HEIGHT_PX,
      rotate: -45,
      rotateAlways: true,
      style: {
        colors: '#dcdcdc',
        cssClass: 'projectOverview__graphCategoryLabel',
        fontFamily: 'Roboto, -apple-system, Helvetica Neue, Helvetica, Arial, sans-serif;',
        fontSize: '15px',
        fontWeight: 500
      }
    },
    position: 'bottom',
    tooltip: {
      enabled: false
    }
  }
}

/**
 * Stacked column plot options: rounded tops only + category totals above bars.
 */
function buildProjectOverviewApexBarPlotOptions (input: {
  columnWidth: string
  totals: number[]
}): Record<string, unknown> {
  const totals = input.totals
  return {
    bar: {
      borderRadius: 4,
      borderRadiusApplication: 'end',
      borderRadiusWhenStacked: 'last',
      columnWidth: input.columnWidth,
      dataLabels: {
        total: {
          enabled: true,
          formatter: (_value: unknown, opts: { dataPointIndex: number }) => {
            const total = totals[opts.dataPointIndex] ?? 0
            return total > 0 ? String(total) : ''
          },
          offsetY: -4,
          style: {
            color: '#DCDCDC',
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: 'Roboto, -apple-system, Helvetica Neue, Helvetica, Arial, sans-serif;',
          },
          dropShadow: {
            enabled: true,
            top: 1,
            left: 1,
            blur: 1,
            color: '#000',
            opacity: 0.65
          },
        }
      },
      horizontal: false
    }
  }
}

/**
 * Hidden y-axis shell for the overview stacked bar chart.
 */
function buildProjectOverviewApexYaxis (): Record<string, unknown> {
  return {
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    },
    labels: {
      style: {
        colors: '#dcdcdc',
        fontFamily: 'Roboto, -apple-system, Helvetica Neue, Helvetica, Arial, sans-serif;',
        fontSize: '14px',
        fontWeight: 600
      }
    },
    show: false,
    tooltip: {
      enabled: false
    }
  }
}

/**
 * Shared Apex option chrome (chart type, grid, states, tooltip shell).
 */
function buildProjectOverviewApexChartChrome (input: {
  chartHeightPx: number
  colors: string[]
  plotOptions: Record<string, unknown>
  tooltipCustom: T_faProjectOverviewApexTooltipCustom
  xaxis: Record<string, unknown>
  yaxis: Record<string, unknown>
}): Record<string, unknown> {
  return {
    chart: {
      animations: {
        enabled: false
      },
      background: 'transparent',
      fontFamily: 'inherit',
      height: input.chartHeightPx,
      stacked: true,
      toolbar: {
        show: false
      },
      type: 'bar',
      zoom: {
        enabled: false
      }
    },
    colors: input.colors,
    dataLabels: {
      enabled: false
    },
    grid: {
      padding: {
        bottom: 0,
        left: 0,
        right: 0,
        top: FA_PROJECT_OVERVIEW_CHART_TOP_RESERVED_PX
      },
      show: false
    },
    legend: {
      show: false
    },
    plotOptions: input.plotOptions,
    states: {
      active: {
        filter: {
          type: 'none'
        }
      },
      hover: {
        filter: {
          // Apex only offers lighten/darken (white/black). Primary fill is CSS :hover.
          type: 'none'
        }
      }
    },
    stroke: {
      show: false,
      width: 0
    },
    tooltip: {
      arrow: false,
      cssClass: 'projectOverview__apexTooltip',
      custom: input.tooltipCustom,
      enabled: true,
      intersect: true,
      onDatasetHover: {
        highlightDataSeries: false
      },
      shared: false,
      theme: 'light'
    },
    xaxis: input.xaxis,
    yaxis: input.yaxis
  }
}

/**
 * Builds ApexCharts options for the Project overview stacked document-distribution chart.
 */
export function buildProjectOverviewApexChartOptions (input: {
  chartHeightPx?: number
  chartModel: I_faProjectOverviewStackedChartModel
  columnWidth: string
  tooltipCustom: T_faProjectOverviewApexTooltipCustom
}): Record<string, unknown> {
  const chartHeightPx = input.chartHeightPx ?? FA_PROJECT_OVERVIEW_CHART_HEIGHT_PX
  const colors = input.chartModel.series.map((series) => series.color)
  const totals = input.chartModel.categories.map((_, categoryIndex) => {
    let total = 0
    for (const series of input.chartModel.series) {
      total += series.data[categoryIndex] ?? 0
    }
    return total
  })

  const plotOptions = buildProjectOverviewApexBarPlotOptions({
    columnWidth: input.columnWidth,
    totals
  })
  const chartChrome = buildProjectOverviewApexChartChrome({
    chartHeightPx,
    colors,
    plotOptions,
    tooltipCustom: input.tooltipCustom,
    xaxis: buildProjectOverviewApexXaxis(input.chartModel.categories),
    yaxis: buildProjectOverviewApexYaxis()
  })
  return chartChrome
}
