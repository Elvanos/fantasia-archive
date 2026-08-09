import { expect, test } from 'vitest'

import {
  FA_PROJECT_OVERVIEW_CHART_COLUMN_MAX_WIDTH_PX,
  FA_PROJECT_OVERVIEW_CHART_COLUMN_WIDTH_PERCENT,
  resolveProjectOverviewApexColumnWidth
} from '../resolveProjectOverviewApexColumnWidth'

/**
 * resolveProjectOverviewApexColumnWidth
 * Caps wide slots to a px max; keeps percent when many categories shrink each slot.
 */
test('Test that resolveProjectOverviewApexColumnWidth caps few categories and percent for many', () => {
  expect(resolveProjectOverviewApexColumnWidth(2)).toBe(
    String(FA_PROJECT_OVERVIEW_CHART_COLUMN_MAX_WIDTH_PX)
  )
  expect(resolveProjectOverviewApexColumnWidth(4)).toBe(
    String(FA_PROJECT_OVERVIEW_CHART_COLUMN_MAX_WIDTH_PX)
  )
  expect(resolveProjectOverviewApexColumnWidth(30)).toBe(
    `${FA_PROJECT_OVERVIEW_CHART_COLUMN_WIDTH_PERCENT}%`
  )
})
