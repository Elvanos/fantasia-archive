import { expect, test } from 'vitest'

import { filterDialogQuickAddDocumentTemplateOptionsByNeedle } from '../functions/dialogQuickAddDocumentTemplateFilter'

/**
 * filterDialogQuickAddDocumentTemplateOptionsByNeedle
 * Empty needle returns all options; non-empty filters by label substring.
 */
test('Test that filterDialogQuickAddDocumentTemplateOptionsByNeedle filters by label', () => {
  const options = [
    {
      icon: 'mdi-a',
      label: 'Heroes',
      titlePluralTranslations: { 'en-US': 'Heroes' },
      titleSingularTranslations: { 'en-US': 'Hero' },
      value: 'tpl-hero'
    },
    {
      icon: 'mdi-b',
      label: 'Places',
      titlePluralTranslations: { 'en-US': 'Places' },
      titleSingularTranslations: { 'en-US': 'Place' },
      value: 'tpl-place'
    }
  ]

  expect(filterDialogQuickAddDocumentTemplateOptionsByNeedle(options, '').map((row) => row.value))
    .toEqual(['tpl-hero', 'tpl-place'])
  expect(filterDialogQuickAddDocumentTemplateOptionsByNeedle(options, 'HER').map((row) => row.value))
    .toEqual(['tpl-hero'])
  expect(filterDialogQuickAddDocumentTemplateOptionsByNeedle(options, 'zzz')).toEqual([])
})
