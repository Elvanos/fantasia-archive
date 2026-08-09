import { expect, test } from 'vitest'

import { parseProjectOverviewTranslationsJson } from '../parseProjectOverviewTranslationsJson'

/**
 * parseProjectOverviewTranslationsJson
 * Keeps string entries from valid objects and drops non-string values.
 */
test('Test that parseProjectOverviewTranslationsJson keeps string map entries', () => {
  expect(parseProjectOverviewTranslationsJson('{"en-US":"Heroes","nb":1,"fr":"Heros"}')).toEqual({
    'en-US': 'Heroes',
    fr: 'Heros'
  })
})

/**
 * parseProjectOverviewTranslationsJson
 * Returns empty maps for invalid JSON, arrays, and null.
 */
test('Test that parseProjectOverviewTranslationsJson returns empty for invalid payloads', () => {
  expect(parseProjectOverviewTranslationsJson('{')).toEqual({})
  expect(parseProjectOverviewTranslationsJson('null')).toEqual({})
  expect(parseProjectOverviewTranslationsJson('[]')).toEqual({})
  expect(parseProjectOverviewTranslationsJson('"x"')).toEqual({})
})
