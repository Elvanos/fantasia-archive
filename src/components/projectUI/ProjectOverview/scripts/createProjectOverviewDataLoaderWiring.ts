import type {
  I_faProjectDocumentDistributionResult,
  I_faProjectDocumentLastOpenedItem
} from 'app/types/I_faProjectDocumentLastOpenedDomain'
import type { I_ref } from 'app/types/I_vueCompositionShims'

import type { I_faProjectOverviewChartSeries } from 'app/types/I_faProjectOverviewChart'
import { FA_PROJECT_OVERVIEW_CHART_SETTLE_MS } from '../functions/buildProjectOverviewApexChartOptions'
import { FA_PROJECT_OVERVIEW_GRAPH_CARD_WIDTH_FULLSIZE_PX } from '../functions/resolveProjectOverviewGraphCardWidth'
import { didProjectOverviewLastOpenedEmptyBoundaryCross } from '../functions/didProjectOverviewLastOpenedEmptyBoundaryCross'
import { applyProjectOverviewChartModel } from './applyProjectOverviewChartModelWiring'

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
    refreshLastOpenedAfterMru: () => Promise<void>
  } {
  let chartSettleTimerId: ReturnType<typeof setTimeout> | null = null

  function clearChartSettleTimer (): void {
    if (chartSettleTimerId !== null) {
      clearTimeout(chartSettleTimerId)
      chartSettleTimerId = null
    }
  }

  function scheduleChartSettle (): void {
    chartSettleTimerId = setTimeout(() => {
      input.chartLoading.value = false
      chartSettleTimerId = null
    }, FA_PROJECT_OVERVIEW_CHART_SETTLE_MS)
  }

  async function loadOverviewData (): Promise<void> {
    input.chartLoading.value = true
    clearChartSettleTimer()
    try {
      const [distribution, lastOpened] = await Promise.all([
        input.listDocumentDistribution(),
        input.listDocumentLastOpened()
      ])
      applyProjectOverviewChartModel({
        chartOptions: input.chartOptions,
        chartSeries: input.chartSeries,
        distribution,
        graphCardWidthPx: input.graphCardWidthPx,
        hasDocumentTemplates: input.hasDocumentTemplates,
        lastOpenedItemCount: lastOpened.items.length,
        preferredLanguageCode: input.preferredLanguageCode,
        resolveChartHeightPx: input.resolveChartHeightPx,
        resolveDocumentCountSeparator: input.resolveDocumentCountSeparator,
        resolveDocumentsLabelSuffix: input.resolveDocumentsLabelSuffix,
        totalDocumentCount: input.totalDocumentCount
      })
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
    scheduleChartSettle()
  }

  async function refreshLastOpenedAfterMru (): Promise<void> {
    const previousCount = input.lastOpenedItems.value.length
    try {
      const lastOpened = await input.listDocumentLastOpened()
      const nextCount = lastOpened.items.length
      if (didProjectOverviewLastOpenedEmptyBoundaryCross(previousCount, nextCount)) {
        await loadOverviewData()
        return
      }
      input.lastOpenedItems.value = lastOpened.items
    } catch (error) {
      console.warn('[ProjectOverview] failed to refresh last opened', error)
    }
  }

  return {
    clearChartSettleTimer,
    loadOverviewData,
    refreshLastOpenedAfterMru
  }
}
