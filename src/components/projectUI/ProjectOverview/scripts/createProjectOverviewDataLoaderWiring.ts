import type {
  I_faProjectDocumentDistributionResult,
  I_faProjectDocumentLastOpenedItem
} from 'app/types/I_faProjectDocumentLastOpenedDomain'
import type { I_ref } from 'app/types/I_vueCompositionShims'

import type { I_faProjectOverviewChartSeries } from 'app/types/I_faProjectOverviewChart'
import {
  FA_PROJECT_OVERVIEW_CHART_SETTLE_MS,
  buildProjectOverviewApexChartOptions
} from '../functions/buildProjectOverviewApexChartOptions'
import { buildProjectOverviewApexChartTooltipHtml } from '../functions/buildProjectOverviewApexChartTooltipHtml'
import { buildProjectOverviewStackedChartModel } from '../functions/buildProjectOverviewStackedChartModel'
import { createProjectOverviewApexTooltipCustom } from '../functions/createProjectOverviewApexTooltipCustom'
import { parseProjectOverviewTranslationsJson } from '../functions/parseProjectOverviewTranslationsJson'
import { resolveProjectOverviewApexColumnWidth } from '../functions/resolveProjectOverviewApexColumnWidth'
import {
  FA_PROJECT_OVERVIEW_GRAPH_CARD_WIDTH_FULLSIZE_PX,
  resolveProjectOverviewGraphCardWidthPx
} from '../functions/resolveProjectOverviewGraphCardWidth'
import { attachProjectOverviewApexTooltipAboveBarEvents } from './projectOverviewApexTooltipAboveBarWiring'

/**
 * Chart + last-opened fetch lifecycle for Project Overview mount.
 */
export function createProjectOverviewDataLoader (input: {
  chartLoading: I_ref<boolean>
  chartOptions: I_ref<Record<string, unknown>>
  chartSeries: I_ref<I_faProjectOverviewChartSeries[]>
  graphCardWidthPx: I_ref<number>
  hasDocumentTemplates: I_ref<boolean>
  lastOpenedItems: I_ref<I_faProjectDocumentLastOpenedItem[]>
  listDocumentDistribution: () => Promise<I_faProjectDocumentDistributionResult>
  listDocumentLastOpened: () => Promise<{ items: I_faProjectDocumentLastOpenedItem[] }>
  preferredLanguageCode: () => string
  resolveChartHeightPx: () => number
  resolveDocumentCountSeparator: () => string
  resolveDocumentsLabelSuffix: () => string
  totalDocumentCount: I_ref<number>
}): {
    clearChartSettleTimer: () => void
    loadOverviewData: () => Promise<void>
  } {
  let chartSettleTimerId: ReturnType<typeof setTimeout> | null = null

  function clearChartSettleTimer (): void {
    if (chartSettleTimerId !== null) {
      clearTimeout(chartSettleTimerId)
      chartSettleTimerId = null
    }
  }

  function applyChartModel (
    distribution: I_faProjectDocumentDistributionResult,
    lastOpenedItemCount: number
  ): void {
    const chartModel = buildProjectOverviewStackedChartModel({
      distribution,
      preferredLanguageCode: input.preferredLanguageCode(),
      parseTranslationsJson: parseProjectOverviewTranslationsJson
    })
    const fullsize = chartModel.totalDocumentCount === 0 || lastOpenedItemCount === 0
    const graphCardWidthPx = resolveProjectOverviewGraphCardWidthPx({
      categoryCount: chartModel.categories.length,
      fullsize
    })
    input.graphCardWidthPx.value = graphCardWidthPx
    input.chartSeries.value = chartModel.series
    input.chartOptions.value = attachProjectOverviewApexTooltipAboveBarEvents(
      buildProjectOverviewApexChartOptions({
        chartHeightPx: input.resolveChartHeightPx(),
        chartModel,
        columnWidth: resolveProjectOverviewApexColumnWidth(
          chartModel.categories.length,
          graphCardWidthPx
        ),
        tooltipCustom: createProjectOverviewApexTooltipCustom({
          buildTooltipHtml: buildProjectOverviewApexChartTooltipHtml,
          documentCountSeparator: input.resolveDocumentCountSeparator(),
          documentsLabelSuffix: input.resolveDocumentsLabelSuffix()
        })
      })
    )
    input.totalDocumentCount.value = chartModel.totalDocumentCount
    input.hasDocumentTemplates.value = distribution.documentTemplateTotalCount > 0
  }

  async function loadOverviewData (): Promise<void> {
    input.chartLoading.value = true
    clearChartSettleTimer()
    try {
      const [distribution, lastOpened] = await Promise.all([
        input.listDocumentDistribution(),
        input.listDocumentLastOpened()
      ])
      applyChartModel(distribution, lastOpened.items.length)
      input.lastOpenedItems.value = lastOpened.items
    } catch (error) {
      console.warn('[ProjectOverview] failed to load overview data', error)
      input.totalDocumentCount.value = 0
      input.hasDocumentTemplates.value = false
      input.lastOpenedItems.value = []
      input.chartSeries.value = []
      input.chartOptions.value = {}
      input.graphCardWidthPx.value = FA_PROJECT_OVERVIEW_GRAPH_CARD_WIDTH_FULLSIZE_PX
    }
    chartSettleTimerId = setTimeout(() => {
      input.chartLoading.value = false
      chartSettleTimerId = null
    }, FA_PROJECT_OVERVIEW_CHART_SETTLE_MS)
  }

  return {
    clearChartSettleTimer,
    loadOverviewData
  }
}
