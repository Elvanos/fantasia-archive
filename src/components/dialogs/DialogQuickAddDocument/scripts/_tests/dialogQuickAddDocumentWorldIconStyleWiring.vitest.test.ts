import { expect, test } from 'vitest'

import { PROJECT_HIERARCHY_TREE_WORLD_COLOR_PRIMARY_BRIGHT_FALLBACK } from 'app/src/components/projectUI/ProjectHierarchyTree/functions/resolveProjectHierarchyTreeWorldDisplayColor'

import { buildDialogQuickAddDocumentWorldOptionIconStyle } from '../dialogQuickAddDocumentWorldIconStyleWiring'

/**
 * buildDialogQuickAddDocumentWorldOptionIconStyle
 * Blank world color falls back to primary-bright glyph token.
 */
test('Test that buildDialogQuickAddDocumentWorldOptionIconStyle falls back for blank color', () => {
  const style = buildDialogQuickAddDocumentWorldOptionIconStyle('  ')
  expect(style['--fa-color-glyph-base']).toBe(
    PROJECT_HIERARCHY_TREE_WORLD_COLOR_PRIMARY_BRIGHT_FALLBACK
  )
})

/**
 * buildDialogQuickAddDocumentWorldOptionIconStyle
 * Trimmed hex becomes the glyph base color.
 */
test('Test that buildDialogQuickAddDocumentWorldOptionIconStyle keeps world hex', () => {
  const style = buildDialogQuickAddDocumentWorldOptionIconStyle('  #e91e63  ')
  expect(style['--fa-color-glyph-base']).toBe('#e91e63')
})
