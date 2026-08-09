import { expect, test } from 'vitest'

import { createProjectOverviewApexTooltipCustom } from '../createProjectOverviewApexTooltipCustom'

/**
 * createProjectOverviewApexTooltipCustom
 * Prefers config categories/colors and series values when present.
 */
test('Test that createProjectOverviewApexTooltipCustom uses config categories and colors', () => {
  const buildTooltipHtml = (input: {
    categoryLabel: string
    documentCount: number
    worldColor: string
    worldLabel: string
  }) => `${input.worldLabel}|${input.categoryLabel}|${input.documentCount}|${input.worldColor}`

  const tooltipCustom = createProjectOverviewApexTooltipCustom({
    buildTooltipHtml: (input) => buildTooltipHtml(input),
    documentCountSeparator: ' - ',
    documentsLabelSuffix: ' documents'
  })

  expect(tooltipCustom({
    dataPointIndex: 1,
    series: [[1, 4], [2, 5]],
    seriesIndex: 1,
    w: {
      config: {
        colors: ['#111', '#222'],
        xaxis: {
          categories: ['A', 'B']
        }
      },
      globals: {
        categoryLabels: ['ignored'],
        labels: ['ignored-label'],
        seriesNames: ['World A', 'World B']
      }
    }
  })).toBe('World B|B|5|#222')
})

/**
 * createProjectOverviewApexTooltipCustom
 * Falls back through categoryLabels, labels, seriesNames, colors, and count zeros.
 */
test('Test that createProjectOverviewApexTooltipCustom falls back when config fields missing', () => {
  const builds: Array<{
    categoryLabel: string
    documentCount: number
    worldColor: string
    worldLabel: string
  }> = []

  const tooltipCustom = createProjectOverviewApexTooltipCustom({
    buildTooltipHtml: (input) => {
      builds.push({
        categoryLabel: input.categoryLabel,
        documentCount: input.documentCount,
        worldColor: input.worldColor,
        worldLabel: input.worldLabel
      })
      return 'ok'
    },
    documentCountSeparator: ' - ',
    documentsLabelSuffix: ' documents'
  })

  expect(tooltipCustom({
    dataPointIndex: 0,
    series: [],
    seriesIndex: 0,
    w: {
      globals: {
        categoryLabels: ['FromCategoryLabels'],
        seriesNames: []
      }
    }
  })).toBe('ok')

  expect(tooltipCustom({
    dataPointIndex: 0,
    series: [[]],
    seriesIndex: 0,
    w: {
      globals: {
        labels: ['FromLabels'],
        seriesNames: ['Named']
      }
    }
  })).toBe('ok')

  expect(tooltipCustom({
    dataPointIndex: 99,
    series: [[7]],
    seriesIndex: 3,
    w: {
      globals: {
        seriesNames: ['Only']
      }
    }
  })).toBe('ok')

  expect(builds).toEqual([
    {
      categoryLabel: 'FromCategoryLabels',
      documentCount: 0,
      worldColor: '',
      worldLabel: ''
    },
    {
      categoryLabel: 'FromLabels',
      documentCount: 0,
      worldColor: '',
      worldLabel: 'Named'
    },
    {
      categoryLabel: '',
      documentCount: 0,
      worldColor: '',
      worldLabel: ''
    }
  ])
})
