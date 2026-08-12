import { expect, test, vi } from 'vitest'

import type { I_faColorGlyphCssCustomProperties } from 'app/types/I_faColorContrast'

import {
  resolveFaSelectInputObjectOptionLabel,
  resolveFaSelectInputOptionIconClass,
  resolveFaSelectInputOptionIconStyle,
  shouldShowFaSelectInputInlineSelection
} from '../functions/faSelectInputPresentation'

/**
 * resolveFaSelectInputObjectOptionLabel
 * Strings return as-is; objects use name.
 */
test('Test that resolveFaSelectInputObjectOptionLabel returns string or object name', () => {
  expect(resolveFaSelectInputObjectOptionLabel('Venus')).toBe('Venus')
  expect(resolveFaSelectInputObjectOptionLabel({
    id: '1',
    name: 'Earth'
  })).toBe('Earth')
})

/**
 * shouldShowFaSelectInputInlineSelection
 * Empty string hidden; nonempty string and object with id shown.
 */
test('Test that shouldShowFaSelectInputInlineSelection gates empty string and object id', () => {
  expect(shouldShowFaSelectInputInlineSelection('')).toBe(false)
  expect(shouldShowFaSelectInputInlineSelection('Venus')).toBe(true)
  expect(shouldShowFaSelectInputInlineSelection({
    id: '',
    name: 'Ghost'
  })).toBe(false)
  expect(shouldShowFaSelectInputInlineSelection({
    id: 'world-1',
    name: 'Venus'
  })).toBe(true)
})

/**
 * resolveFaSelectInputOptionIconClass
 * Object options always get fa-color-glyph (fantasy shading + optional custom color).
 */
test('Test that resolveFaSelectInputOptionIconClass returns fa-color-glyph for object options', () => {
  expect(resolveFaSelectInputOptionIconClass('plain')).toBeUndefined()
  expect(resolveFaSelectInputOptionIconClass({
    id: '1',
    name: 'No color'
  })).toBe('fa-color-glyph')
  expect(resolveFaSelectInputOptionIconClass({
    color: '#ad3131',
    id: '1',
    name: 'Tinted'
  })).toBe('fa-color-glyph')
})

/**
 * resolveFaSelectInputOptionIconStyle
 * Strings skip builder; objects always get glyph props (custom color or default).
 */
test('Test that resolveFaSelectInputOptionIconStyle delegates object color to buildStyle', () => {
  const glyphStyle: I_faColorGlyphCssCustomProperties = {
    '--fa-color-glyph-base': '#ad3131',
    '--fa-color-glyph-highlight-base': '#ad3131'
  }
  const defaultStyle: I_faColorGlyphCssCustomProperties = {
    '--fa-color-glyph-base': 'var(--fa-color-text-workspace-row)',
    '--fa-color-glyph-highlight-base': '58%'
  }
  const buildStyle = vi.fn((color: string | undefined) => {
    if (color === undefined) {
      return defaultStyle
    }
    return glyphStyle
  })

  expect(resolveFaSelectInputOptionIconStyle('plain', buildStyle)).toBeNull()
  expect(buildStyle).not.toHaveBeenCalled()

  expect(resolveFaSelectInputOptionIconStyle({
    id: '1',
    name: 'No color'
  }, buildStyle)).toEqual(defaultStyle)
  expect(buildStyle).toHaveBeenCalledWith(undefined)

  expect(resolveFaSelectInputOptionIconStyle({
    color: '#ad3131',
    id: '1',
    name: 'Tinted'
  }, buildStyle)).toEqual(glyphStyle)
  expect(buildStyle).toHaveBeenCalledWith('#ad3131')
})
