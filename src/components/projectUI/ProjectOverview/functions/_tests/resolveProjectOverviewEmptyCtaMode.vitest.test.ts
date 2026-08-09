import { expect, test } from 'vitest'

import { resolveProjectOverviewEmptyCtaMode } from '../resolveProjectOverviewEmptyCtaMode'

/**
 * resolveProjectOverviewEmptyCtaMode
 * No templates → createTemplate.
 */
test('Test that resolveProjectOverviewEmptyCtaMode returns createTemplate without templates', () => {
  expect(resolveProjectOverviewEmptyCtaMode({
    hasDocumentTemplates: false,
    hasWorldTemplatePlacements: false
  })).toBe('createTemplate')
  expect(resolveProjectOverviewEmptyCtaMode({
    hasDocumentTemplates: false,
    hasWorldTemplatePlacements: true
  })).toBe('createTemplate')
})

/**
 * resolveProjectOverviewEmptyCtaMode
 * Templates without placements → assignTemplate.
 */
test('Test that resolveProjectOverviewEmptyCtaMode returns assignTemplate without placements', () => {
  expect(resolveProjectOverviewEmptyCtaMode({
    hasDocumentTemplates: true,
    hasWorldTemplatePlacements: false
  })).toBe('assignTemplate')
})

/**
 * resolveProjectOverviewEmptyCtaMode
 * Templates with placements → createDocument.
 */
test('Test that resolveProjectOverviewEmptyCtaMode returns createDocument with placements', () => {
  expect(resolveProjectOverviewEmptyCtaMode({
    hasDocumentTemplates: true,
    hasWorldTemplatePlacements: true
  })).toBe('createDocument')
})
