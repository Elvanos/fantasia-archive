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
 */
test('Test that createBuildFaSelectInputOptionIconStyle returns null without color', () => {
  const build = createBuildFaSelectInputOptionIconStyle({
    buildFaColorGlyphCssCustomProperties: (resolvedColor) => ({
      '--fa-color-glyph-base': resolvedColor,
      '--fa-color-glyph-highlight-base': resolvedColor
    })
  })
  expect(build(undefined)).toBeNull()
  expect(build('#ad3131')).toEqual({
    '--fa-color-glyph-base': '#ad3131',
    '--fa-color-glyph-highlight-base': '#ad3131'
  })
})
