import { expect, test } from 'vitest'

import {
  FA_PROJECT_OVERVIEW_GRAPH_CARD_HEIGHT_PX,
  FA_PROJECT_OVERVIEW_GRAPH_CARD_HEIGHT_TIPS_HIDDEN_PX,
  FA_PROJECT_OVERVIEW_GRAPH_CARD_WIDTH_FULLSIZE_PX,
  FA_PROJECT_OVERVIEW_GRAPH_CARD_WIDTH_WITH_LAST_OPENED_PX,
  FA_PROJECT_OVERVIEW_GRAPH_HEIGHT_FLAT_THEME_OFFSET_PX,
  resolveProjectOverviewGraphCardHeightPx,
  resolveProjectOverviewGraphCardWidthPx
} from '../resolveProjectOverviewGraphCardWidth'

/**
 * resolveProjectOverviewGraphCardWidthPx
 * Base width by fullsize vs last-opened; +50px per template column above 20.
 */
test('Test that resolveProjectOverviewGraphCardWidthPx uses bases and extras past 20 columns', () => {
  expect(resolveProjectOverviewGraphCardWidthPx({
    categoryCount: 20,
    fullsize: true
  })).toBe(FA_PROJECT_OVERVIEW_GRAPH_CARD_WIDTH_FULLSIZE_PX)
  expect(resolveProjectOverviewGraphCardWidthPx({
    categoryCount: 20,
    fullsize: false
  })).toBe(FA_PROJECT_OVERVIEW_GRAPH_CARD_WIDTH_WITH_LAST_OPENED_PX)
  expect(resolveProjectOverviewGraphCardWidthPx({
    categoryCount: 22,
    fullsize: true
  })).toBe(1486)
  expect(resolveProjectOverviewGraphCardWidthPx({
    categoryCount: 22,
    fullsize: false
  })).toBe(1122)
  expect(resolveProjectOverviewGraphCardWidthPx({
    categoryCount: 0,
    fullsize: true
  })).toBe(FA_PROJECT_OVERVIEW_GRAPH_CARD_WIDTH_FULLSIZE_PX)
})

/**
 * resolveProjectOverviewGraphCardHeightPx
 * Fantasy keeps base heights; flat subtracts the subtitle margin offset.
 */
test('Test that resolveProjectOverviewGraphCardHeightPx switches on tips and theme skin', () => {
  expect(resolveProjectOverviewGraphCardHeightPx({
    hideTooltipsProject: false,
    themeSkin: 'fantasy'
  })).toBe(FA_PROJECT_OVERVIEW_GRAPH_CARD_HEIGHT_PX)
  expect(resolveProjectOverviewGraphCardHeightPx({
    hideTooltipsProject: true,
    themeSkin: 'fantasy'
  })).toBe(FA_PROJECT_OVERVIEW_GRAPH_CARD_HEIGHT_TIPS_HIDDEN_PX)
  expect(resolveProjectOverviewGraphCardHeightPx({
    hideTooltipsProject: false,
    themeSkin: 'flat'
  })).toBe(
    FA_PROJECT_OVERVIEW_GRAPH_CARD_HEIGHT_PX -
    FA_PROJECT_OVERVIEW_GRAPH_HEIGHT_FLAT_THEME_OFFSET_PX
  )
  expect(resolveProjectOverviewGraphCardHeightPx({
    hideTooltipsProject: true,
    themeSkin: 'flat'
  })).toBe(
    FA_PROJECT_OVERVIEW_GRAPH_CARD_HEIGHT_TIPS_HIDDEN_PX -
    FA_PROJECT_OVERVIEW_GRAPH_HEIGHT_FLAT_THEME_OFFSET_PX
  )
})
