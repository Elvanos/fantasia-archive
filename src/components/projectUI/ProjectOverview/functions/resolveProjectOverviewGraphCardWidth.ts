import type { T_faAppThemeSkin } from 'app/types/faUserSettingsAppThemeRegistry'

/**
 * Compact graph card when Last opened list is shown beside the chart.
 * Keep in sync with $projectOverview-graph-card-width.
 */
export const FA_PROJECT_OVERVIEW_GRAPH_CARD_WIDTH_WITH_LAST_OPENED_PX = 1022
/**
 * Full-width graph card when Last opened is hidden (no last-opened rows / empty project).
 * Keep in sync with $projectOverview-graph-card-width-fullsize.
 */
export const FA_PROJECT_OVERVIEW_GRAPH_CARD_WIDTH_FULLSIZE_PX = 1386
/** Template columns at or below this count use the base card width only. */
export const FA_PROJECT_OVERVIEW_GRAPH_CARD_EXTRA_COLUMN_THRESHOLD = 20
/** Extra horizontal space per document-template column above the threshold. */
export const FA_PROJECT_OVERVIEW_GRAPH_CARD_EXTRA_COLUMN_WIDTH_PX = 50
/**
 * Default graph + last-opened card height (tips visible / setting off).
 * Keep in sync with $projectOverview-graph-card-height.
 */
export const FA_PROJECT_OVERVIEW_GRAPH_CARD_HEIGHT_PX = 587
/**
 * Taller cards when Hide tips on project overview is on.
 * Keep in sync with $projectOverview-graph-card-height-tipsHidden.
 */
export const FA_PROJECT_OVERVIEW_GRAPH_CARD_HEIGHT_TIPS_HIDDEN_PX = 808
/**
 * Flat theme subtitle margin is 23px taller than fantasy (-8 vs 15).
 * Keep in sync with FA_PROJECT_OVERVIEW_CHART_HEIGHT_FLAT_THEME_OFFSET_PX.
 */
export const FA_PROJECT_OVERVIEW_GRAPH_HEIGHT_FLAT_THEME_OFFSET_PX = 23

/**
 * Graph card pixel width: base (fullsize vs last-opened) + 50px per template above 20.
 */
export function resolveProjectOverviewGraphCardWidthPx (input: {
  categoryCount: number
  fullsize: boolean
}): number {
  const baseWidth = input.fullsize
    ? FA_PROJECT_OVERVIEW_GRAPH_CARD_WIDTH_FULLSIZE_PX
    : FA_PROJECT_OVERVIEW_GRAPH_CARD_WIDTH_WITH_LAST_OPENED_PX
  const extraColumns = Math.max(
    0,
    input.categoryCount - FA_PROJECT_OVERVIEW_GRAPH_CARD_EXTRA_COLUMN_THRESHOLD
  )
  const extraWidth = extraColumns * FA_PROJECT_OVERVIEW_GRAPH_CARD_EXTRA_COLUMN_WIDTH_PX
  return baseWidth + extraWidth
}

/**
 * Graph + last-opened card height from Hide tips + flat/fantasy skin.
 */
export function resolveProjectOverviewGraphCardHeightPx (input: {
  hideTooltipsProject: boolean
  themeSkin: T_faAppThemeSkin
}): number {
  const baseHeight = input.hideTooltipsProject
    ? FA_PROJECT_OVERVIEW_GRAPH_CARD_HEIGHT_TIPS_HIDDEN_PX
    : FA_PROJECT_OVERVIEW_GRAPH_CARD_HEIGHT_PX
  if (input.themeSkin === 'flat') {
    return baseHeight - FA_PROJECT_OVERVIEW_GRAPH_HEIGHT_FLAT_THEME_OFFSET_PX
  }
  return baseHeight
}
