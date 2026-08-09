import { expect, test, vi } from 'vitest'
import { ref } from 'vue'

import type { I_faProjectDocumentDistributionResult } from 'app/types/I_faProjectDocumentLastOpenedDomain'
import type { I_faProjectDocumentLastOpenedItem } from 'app/types/I_faProjectDocumentLastOpenedDomain'
import type { I_faProjectOverviewChartSeries } from 'app/types/I_faProjectOverviewChart'

import { FA_PROJECT_OVERVIEW_CHART_SETTLE_MS } from '../../functions/buildProjectOverviewApexChartOptions'
import { createProjectOverviewDataLoader } from '../createProjectOverviewDataLoaderWiring'

function makeEmptyDistribution (): I_faProjectDocumentDistributionResult {
  return {
    counts: [],
    templates: [],
    documentTemplateTotalCount: 0,
    totalDocumentCount: 0,
    worlds: []
  }
}

/**
 * createProjectOverviewDataLoader
 * Applies chart model, last-opened rows, and settles loading after the chart delay.
 */
test('Test that createProjectOverviewDataLoader loads chart and last-opened data', async () => {
  vi.useFakeTimers()
  const chartLoading = ref(false)
  const chartOptions = ref<Record<string, unknown>>({})
  const chartSeries = ref<I_faProjectOverviewChartSeries[]>([])
  const graphCardWidthPx = ref(1386)
  const hasDocumentTemplates = ref(false)
  const lastOpenedItems = ref<I_faProjectDocumentLastOpenedItem[]>([])
  const totalDocumentCount = ref(0)

  const { clearChartSettleTimer, loadOverviewData } = createProjectOverviewDataLoader({
    chartLoading,
    chartOptions,
    chartSeries,
    graphCardWidthPx,
    hasDocumentTemplates,
    lastOpenedItems,
    listDocumentDistribution: async () => ({
      counts: [{
        documentCount: 1,
        templateId: 't1',
        worldId: 'w1'
      }],
      templates: [{
        icon: 'mdi-file',
        templateId: 't1',
        titlePluralTranslationsJson: '{"en-US":"Characters"}',
        sortOrder: 0
      }],
      documentTemplateTotalCount: 1,
      totalDocumentCount: 1,
      worlds: [{
        color: '#ff0000',
        displayNameTranslationsJson: '{"en-US":"World"}',
        sortOrder: 0,
        worldId: 'w1'
      }]
    }),
    listDocumentLastOpened: async () => ({
      items: [{
        displayName: 'Hero',
        documentBackgroundColor: null,
        documentId: 'doc-1',
        documentTextColor: null,
        isCategory: false,
        isDead: false,
        openedAtMs: 1,
        templateIcon: 'mdi-account',
        templateId: 't1',
        worldId: 'w1'
      }]
    }),
    preferredLanguageCode: () => 'en-US',
    resolveChartHeightPx: () => 666,
    resolveDocumentCountSeparator: () => ' - ',
    resolveDocumentsLabelSuffix: () => ' documents',
    totalDocumentCount
  })

  const loadPromise = loadOverviewData()
  expect(chartLoading.value).toBe(true)
  await loadPromise

  expect(totalDocumentCount.value).toBe(1)
  expect(hasDocumentTemplates.value).toBe(true)
  expect(chartSeries.value).toHaveLength(1)
  expect(lastOpenedItems.value).toHaveLength(1)
  expect(graphCardWidthPx.value).toBe(1022)
  expect((chartOptions.value.chart as { height: number }).height).toBe(666)

  await vi.advanceTimersByTimeAsync(FA_PROJECT_OVERVIEW_CHART_SETTLE_MS)
  expect(chartLoading.value).toBe(false)

  clearChartSettleTimer()
  vi.useRealTimers()
})

/**
 * createProjectOverviewDataLoader
 * Marks templates present from documentTemplateTotalCount even when none are placed.
 */
test('Test that createProjectOverviewDataLoader sets hasDocumentTemplates from total template count', async () => {
  const chartLoading = ref(false)
  const chartOptions = ref<Record<string, unknown>>({})
  const chartSeries = ref<I_faProjectOverviewChartSeries[]>([])
  const graphCardWidthPx = ref(1386)
  const hasDocumentTemplates = ref(false)
  const lastOpenedItems = ref<I_faProjectDocumentLastOpenedItem[]>([])
  const totalDocumentCount = ref(0)

  const { loadOverviewData } = createProjectOverviewDataLoader({
    chartLoading,
    chartOptions,
    chartSeries,
    graphCardWidthPx,
    hasDocumentTemplates,
    lastOpenedItems,
    listDocumentDistribution: async () => ({
      counts: [],
      documentTemplateTotalCount: 2,
      templates: [],
      totalDocumentCount: 0,
      worlds: []
    }),
    listDocumentLastOpened: async () => ({ items: [] }),
    preferredLanguageCode: () => 'en-US',
    resolveChartHeightPx: () => 445,
    resolveDocumentCountSeparator: () => ' - ',
    resolveDocumentsLabelSuffix: () => ' documents',
    totalDocumentCount
  })

  await loadOverviewData()
  expect(hasDocumentTemplates.value).toBe(true)
  expect(totalDocumentCount.value).toBe(0)
})

/**
 * createProjectOverviewDataLoader
 * Clears a pending settle timer on reload and resets state when fetch throws.
 */
test('Test that createProjectOverviewDataLoader clears settle timer and handles load errors', async () => {
  vi.useFakeTimers()
  const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
  const chartLoading = ref(false)
  const chartOptions = ref<Record<string, unknown>>({ keep: true })
  const chartSeries = ref<I_faProjectOverviewChartSeries[]>([{
    color: '#111',
    data: [1],
    name: 'Old'
  }])
  const graphCardWidthPx = ref(1022)
  const hasDocumentTemplates = ref(true)
  const lastOpenedItems = ref<I_faProjectDocumentLastOpenedItem[]>([{
    displayName: 'Old',
    documentBackgroundColor: null,
    documentId: 'old',
    documentTextColor: null,
    isCategory: false,
    isDead: false,
    openedAtMs: 1,
    templateIcon: '',
    templateId: 't1',
    worldId: 'w1'
  }])
  const totalDocumentCount = ref(9)

  let failNext = false
  const { clearChartSettleTimer, loadOverviewData } = createProjectOverviewDataLoader({
    chartLoading,
    chartOptions,
    chartSeries,
    graphCardWidthPx,
    hasDocumentTemplates,
    lastOpenedItems,
    listDocumentDistribution: async () => {
      if (failNext) {
        throw new Error('boom')
      }
      return makeEmptyDistribution()
    },
    listDocumentLastOpened: async () => ({ items: [] }),
    preferredLanguageCode: () => 'en-US',
    resolveChartHeightPx: () => 445,
    resolveDocumentCountSeparator: () => ' - ',
    resolveDocumentsLabelSuffix: () => ' documents',
    totalDocumentCount
  })

  await loadOverviewData()
  expect(chartLoading.value).toBe(true)

  failNext = true
  await loadOverviewData()
  expect(totalDocumentCount.value).toBe(0)
  expect(hasDocumentTemplates.value).toBe(false)
  expect(lastOpenedItems.value).toEqual([])
  expect(chartSeries.value).toEqual([])
  expect(chartOptions.value).toEqual({})
  expect(graphCardWidthPx.value).toBe(1386)
  expect(warnSpy).toHaveBeenCalled()

  clearChartSettleTimer()
  warnSpy.mockRestore()
  vi.useRealTimers()
})
