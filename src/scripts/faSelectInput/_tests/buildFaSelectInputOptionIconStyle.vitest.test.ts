import { expect, test } from 'vitest'

import {
  createBuildFaSelectInputOptionIconStyle,
  resolveFaSelectInputOptionIconColor
} from '../functions/buildFaSelectInputOptionIconStyle'

/**
 * resolveFaSelectInputOptionIconColor
 */
test('Test that resolveFaSelectInputOptionIconColor trims and falls back', () => {
  expect(resolveFaSelectInputOptionIconColor('  #e91e63  ')).toBe('#e91e63')
  expect(resolveFaSelectInputOptionIconColor('   ')).toBe('var(--fa-color-primary-bright)')
})

/**
 * createBuildFaSelectInputOptionIconStyle
 * Always returns glyph props; missing color uses workspace-row default.
 */
test('Test that createBuildFaSelectInputOptionIconStyle always returns glyph props', () => {
  const build = createBuildFaSelectInputOptionIconStyle({
    buildFaColorGlyphCssCustomProperties: (resolvedColor) => ({
      '--fa-color-glyph-base': resolvedColor,
      '--fa-color-glyph-highlight-base': resolvedColor
    })
  })
  expect(build(undefined)).toEqual({
    '--fa-color-glyph-base': 'var(--fa-color-text-workspace-row)',
    '--fa-color-glyph-highlight-base': 'var(--fa-color-text-workspace-row)'
  })
  expect(build('#ad3131')).toEqual({
    '--fa-color-glyph-base': '#ad3131',
    '--fa-color-glyph-highlight-base': '#ad3131'
  })
  expect(build('   ')).toEqual({
    '--fa-color-glyph-base': 'var(--fa-color-primary-bright)',
    '--fa-color-glyph-highlight-base': 'var(--fa-color-primary-bright)'
  })
})
