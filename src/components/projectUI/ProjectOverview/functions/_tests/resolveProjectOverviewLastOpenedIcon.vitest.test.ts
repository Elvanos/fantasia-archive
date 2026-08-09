/** @vitest-environment jsdom */
import { expect, test } from 'vitest'

import { resolveProjectOverviewLastOpenedIconName } from '../resolveProjectOverviewLastOpenedIcon'

/**
 * resolveProjectOverviewLastOpenedIconName
 * Category rows use open-folder; empty template icon falls back to file-outline.
 */
test('Test that resolveProjectOverviewLastOpenedIconName covers category and fallback', () => {
  expect(resolveProjectOverviewLastOpenedIconName({
    isCategory: true,
    templateIcon: 'mdi-account'
  })).toBe('mdi-folder-open')

  expect(resolveProjectOverviewLastOpenedIconName({
    isCategory: false,
    templateIcon: '  '
  })).toBe('mdi-file-outline')

  expect(resolveProjectOverviewLastOpenedIconName({
    isCategory: false,
    templateIcon: 'mdi-sword'
  })).toBe('mdi-sword')
})
