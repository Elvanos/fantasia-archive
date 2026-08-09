/**
 * Preferred column thickness as % of each x-slot (Apex default is 70%).
 * When that would exceed FA_PROJECT_OVERVIEW_CHART_COLUMN_MAX_WIDTH_PX, Apex gets a px cap.
 */
export const FA_PROJECT_OVERVIEW_CHART_COLUMN_WIDTH_PERCENT = 60
/** Hard cap so few categories on a wide card do not become slab-wide bars. */
export const FA_PROJECT_OVERVIEW_CHART_COLUMN_MAX_WIDTH_PX = 55
/**
 * Default plot card width when last-opened is visible.
 * Keep in sync with FA_PROJECT_OVERVIEW_GRAPH_CARD_WIDTH_WITH_LAST_OPENED_PX.
 */
export const FA_PROJECT_OVERVIEW_CHART_CARD_WIDTH_PX = 1022
/** Keep in sync with $projectOverview-graph-apex-paddingInline */
export const FA_PROJECT_OVERVIEW_CHART_PADDING_INLINE_PX = 40

/**
 * Apex columnWidth: percent of slot, or px string when the percent would exceed the max.
 */
export function resolveProjectOverviewApexColumnWidth (
  categoryCount: number,
  cardWidthPx: number = FA_PROJECT_OVERVIEW_CHART_CARD_WIDTH_PX
): string {
  const count = Math.max(1, categoryCount)
  const plotWidthPx = cardWidthPx - (2 * FA_PROJECT_OVERVIEW_CHART_PADDING_INLINE_PX)
  const preferredPx = (plotWidthPx / count) * (FA_PROJECT_OVERVIEW_CHART_COLUMN_WIDTH_PERCENT / 100)
  if (preferredPx > FA_PROJECT_OVERVIEW_CHART_COLUMN_MAX_WIDTH_PX) {
    return String(FA_PROJECT_OVERVIEW_CHART_COLUMN_MAX_WIDTH_PX)
  }
  return `${FA_PROJECT_OVERVIEW_CHART_COLUMN_WIDTH_PERCENT}%`
}
