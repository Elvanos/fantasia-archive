import { expect, test } from 'vitest'

import { buildDialogQuickSearchDocumentWorldOptionIconStyle } from '../dialogQuickSearchDocumentWorldIconStyleWiring'

/**
 * buildDialogQuickSearchDocumentWorldOptionIconStyle
 */
test('Test that buildDialogQuickSearchDocumentWorldOptionIconStyle returns fa-color-glyph props', () => {
  const style = buildDialogQuickSearchDocumentWorldOptionIconStyle('#4caf50')
  expect(style['--fa-color-glyph-base']).toBeTruthy()
})
