import { expect, test } from 'vitest'

import { didProjectOverviewLastOpenedEmptyBoundaryCross } from '../didProjectOverviewLastOpenedEmptyBoundaryCross'

/**
 * didProjectOverviewLastOpenedEmptyBoundaryCross
 * Detects Last opened panel visibility toggles only.
 */
test('Test that didProjectOverviewLastOpenedEmptyBoundaryCross detects empty toggles only', () => {
  expect(didProjectOverviewLastOpenedEmptyBoundaryCross(0, 1)).toBe(true)
  expect(didProjectOverviewLastOpenedEmptyBoundaryCross(2, 0)).toBe(true)
  expect(didProjectOverviewLastOpenedEmptyBoundaryCross(0, 0)).toBe(false)
  expect(didProjectOverviewLastOpenedEmptyBoundaryCross(1, 2)).toBe(false)
  expect(didProjectOverviewLastOpenedEmptyBoundaryCross(3, 1)).toBe(false)
})
