import type { I_faProjectDocumentLastOpenedItem } from 'app/types/I_faProjectDocumentLastOpenedDomain'
import type { I_faProjectOverviewChartSeries } from 'app/types/I_faProjectOverviewChart'
import type { I_ref } from 'app/types/I_vueCompositionShims'

import { FA_PROJECT_OVERVIEW_GRAPH_CARD_WIDTH_FULLSIZE_PX } from '../functions/resolveProjectOverviewGraphCardWidth'

/**
 * Session refs owned by Project overview composable.
 */
export function createProjectOverviewSessionRefs (ref: <T>(value: T) => I_ref<T>): {
  chartLoading: I_ref<boolean>
  chartOptions: I_ref<Record<string, unknown>>
  chartSeries: I_ref<I_faProjectOverviewChartSeries[]>
  graphCardWidthPx: I_ref<number>
  hasDocumentTemplates: I_ref<boolean>
  lastOpenedItems: I_ref<I_faProjectDocumentLastOpenedItem[]>
  randomTipCaption: I_ref<string>
  totalDocumentCount: I_ref<number>
} {
  const randomTipCaption = ref('')
  const totalDocumentCount = ref(0)
  const hasDocumentTemplates = ref(false)
  const lastOpenedItems = ref<I_faProjectDocumentLastOpenedItem[]>([])
  const chartSeries = ref<I_faProjectOverviewChartSeries[]>([])
  const chartOptions = ref<Record<string, unknown>>({})
  const chartLoading = ref(true)
  const graphCardWidthPx = ref(FA_PROJECT_OVERVIEW_GRAPH_CARD_WIDTH_FULLSIZE_PX)

  return {
    chartLoading,
    chartOptions,
    chartSeries,
    graphCardWidthPx,
    hasDocumentTemplates,
    lastOpenedItems,
    randomTipCaption,
    totalDocumentCount
  }
}
