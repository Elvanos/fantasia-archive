import { expect, test } from 'vitest'

import {
  applyFaProjectMediaMassEditPreviewProbe,
  markFaProjectMediaMassEditPreviewFailed,
  markFaProjectMediaMassEditPreviewLoaded,
  resolveFaProjectMediaThumbCaption
} from '../faProjectMediaMassEditPreview'

function box<T> (value: T): { value: T } {
  return { value }
}

/**
 * faProjectMediaMassEditPreview
 * Empty probe URL forces the failed preview state.
 */
test('Test that applyFaProjectMediaMassEditPreviewProbe marks empty URLs failed', () => {
  const probeSrc = box('https://cdn.example.com/a.png')
  const previewLoaded = box(true)
  const previewFailed = box(false)

  applyFaProjectMediaMassEditPreviewProbe(probeSrc, previewLoaded, previewFailed, '')

  expect(probeSrc.value).toBe('')
  expect(previewLoaded.value).toBe(false)
  expect(previewFailed.value).toBe(true)
})

/**
 * faProjectMediaMassEditPreview
 * A nonempty probe URL keeps a prior fail until load.
 */
test('Test that applyFaProjectMediaMassEditPreviewProbe keeps a prior fail on a new URL', () => {
  const probeSrc = box('')
  const previewLoaded = box(false)
  const previewFailed = box(true)

  applyFaProjectMediaMassEditPreviewProbe(
    probeSrc,
    previewLoaded,
    previewFailed,
    'https://cdn.example.com/b.png'
  )

  expect(probeSrc.value).toBe('https://cdn.example.com/b.png')
  expect(previewLoaded.value).toBe(false)
  expect(previewFailed.value).toBe(true)
})

/**
 * faProjectMediaMassEditPreview
 * Load and error markers flip failed / loaded flags.
 */
test('Test that mass-edit preview load and error markers update flags', () => {
  const previewFailed = box(true)
  const previewLoaded = box(false)

  markFaProjectMediaMassEditPreviewLoaded(previewFailed, previewLoaded)
  expect(previewFailed.value).toBe(false)
  expect(previewLoaded.value).toBe(true)

  markFaProjectMediaMassEditPreviewFailed(previewFailed, previewLoaded)
  expect(previewFailed.value).toBe(true)
  expect(previewLoaded.value).toBe(false)
})

/**
 * resolveFaProjectMediaThumbCaption
 * Trimmed title wins; blank name uses the preview URL.
 */
test('Test that resolveFaProjectMediaThumbCaption prefers title then URL', () => {
  expect(resolveFaProjectMediaThumbCaption('  bar  ', 'https://cdn.example.com/foo.png')).toBe(
    'bar'
  )
  expect(resolveFaProjectMediaThumbCaption('   ', 'https://cdn.example.com/foo.png')).toBe(
    'https://cdn.example.com/foo.png'
  )
  expect(resolveFaProjectMediaThumbCaption('', '')).toBe('')
})
