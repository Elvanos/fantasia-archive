import { expect, test } from 'vitest'

import {
  computeProjectOverviewApexTooltipAboveBarPosition,
  resolveProjectOverviewApexStackedColumnAnchorRect
} from '../computeProjectOverviewApexTooltipAboveBarPosition'

/**
 * computeProjectOverviewApexTooltipAboveBarPosition
 * Centers tip above the bar when vertical space allows.
 */
test('Test that computeProjectOverviewApexTooltipAboveBarPosition centers tip above bar', () => {
  const position = computeProjectOverviewApexTooltipAboveBarPosition({
    barLeft: 200,
    barTop: 120,
    barWidth: 20,
    gapPx: 8,
    tooltipHeight: 50,
    tooltipWidth: 100,
    wrapLeft: 0,
    wrapTop: 0,
    wrapWidth: 500
  })

  expect(position.placement).toBe('top')
  expect(position.leftPx).toBe(160)
  expect(position.topPx).toBe(62)
})

/**
 * computeProjectOverviewApexTooltipAboveBarPosition
 * Keeps tip above the column even when it extends past the canvas top.
 */
test('Test that computeProjectOverviewApexTooltipAboveBarPosition allows negative top', () => {
  const position = computeProjectOverviewApexTooltipAboveBarPosition({
    barLeft: 200,
    barTop: 10,
    barWidth: 20,
    gapPx: 8,
    tooltipHeight: 50,
    tooltipWidth: 100,
    wrapLeft: 0,
    wrapTop: 0,
    wrapWidth: 500
  })

  expect(position.placement).toBe('top')
  expect(position.topPx).toBe(-48)
})

/**
 * computeProjectOverviewApexTooltipAboveBarPosition
 * Clamps horizontal position inside the wrap width.
 */
test('Test that computeProjectOverviewApexTooltipAboveBarPosition clamps left edge', () => {
  const nearLeft = computeProjectOverviewApexTooltipAboveBarPosition({
    barLeft: 5,
    barTop: 100,
    barWidth: 10,
    gapPx: 4,
    tooltipHeight: 40,
    tooltipWidth: 120,
    wrapLeft: 0,
    wrapTop: 0,
    wrapWidth: 200
  })
  expect(nearLeft.leftPx).toBe(0)

  const nearRight = computeProjectOverviewApexTooltipAboveBarPosition({
    barLeft: 190,
    barTop: 100,
    barWidth: 10,
    gapPx: 4,
    tooltipHeight: 40,
    tooltipWidth: 120,
    wrapLeft: 0,
    wrapTop: 0,
    wrapWidth: 200
  })
  expect(nearRight.leftPx).toBe(80)
})

/**
 * resolveProjectOverviewApexStackedColumnAnchorRect
 * Uses the top of the whole stacked column, not a mid-stack segment.
 */
test('Test that resolveProjectOverviewApexStackedColumnAnchorRect uses column top', () => {
  const anchor = resolveProjectOverviewApexStackedColumnAnchorRect([
    {
      bottom: 200,
      left: 100,
      right: 120,
      top: 160
    },
    {
      bottom: 160,
      left: 100,
      right: 120,
      top: 40
    }
  ])

  expect(anchor).toEqual({
    left: 100,
    top: 40,
    width: 20
  })
})

/**
 * resolveProjectOverviewApexStackedColumnAnchorRect
 * Empty or non-finite segment lists yield null.
 */
test('Test that resolveProjectOverviewApexStackedColumnAnchorRect returns null for empty or infinite rects', () => {
  expect(resolveProjectOverviewApexStackedColumnAnchorRect([])).toBeNull()
  expect(resolveProjectOverviewApexStackedColumnAnchorRect([
    {
      bottom: 10,
      left: Number.POSITIVE_INFINITY,
      right: Number.POSITIVE_INFINITY,
      top: Number.POSITIVE_INFINITY
    }
  ])).toBeNull()
})
