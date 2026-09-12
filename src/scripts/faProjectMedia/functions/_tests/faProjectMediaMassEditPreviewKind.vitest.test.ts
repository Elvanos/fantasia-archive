import { expect, test } from 'vitest'

import {
  FA_PROJECT_MEDIA_PREVIEW_ICON_AUDIO,
  FA_PROJECT_MEDIA_PREVIEW_ICON_EMBED,
  FA_PROJECT_MEDIA_PREVIEW_ICON_VIDEO,
  readFaProjectMediaUrlPathExtension,
  resolveFaProjectMediaMassEditPreviewKind,
  resolveFaProjectMediaMassEditPreviewTypeIconName
} from '../faProjectMediaMassEditPreviewKind'

/**
 * readFaProjectMediaUrlPathExtension
 * Query and hash are ignored; the path extension is lowercased.
 */
test('Test that readFaProjectMediaUrlPathExtension uses the path extension', () => {
  expect(readFaProjectMediaUrlPathExtension('')).toBe('')
  expect(
    readFaProjectMediaUrlPathExtension('https://cdn.example.com/clip.MP4?token=1#t=2')
  ).toBe('mp4')
  expect(readFaProjectMediaUrlPathExtension('not a url/file.OGG?x=1')).toBe('ogg')
  expect(readFaProjectMediaUrlPathExtension('https://cdn.example.com/noext')).toBe('')
  expect(readFaProjectMediaUrlPathExtension('https://cdn.example.com/.hidden')).toBe('')
  expect(readFaProjectMediaUrlPathExtension('https://cdn.example.com/file.')).toBe('')
})

/**
 * resolveFaProjectMediaMassEditPreviewKind
 * Known media extensions win; unknown and missing extensions try as image.
 */
test('Test that resolveFaProjectMediaMassEditPreviewKind maps extensions', () => {
  expect(resolveFaProjectMediaMassEditPreviewKind('https://cdn.example.com/a.png')).toBe('image')
  expect(resolveFaProjectMediaMassEditPreviewKind('https://cdn.example.com/a.webp')).toBe('image')
  expect(resolveFaProjectMediaMassEditPreviewKind('https://cdn.example.com/noext')).toBe('image')
  expect(resolveFaProjectMediaMassEditPreviewKind('https://cdn.example.com/clip.mp4')).toBe('video')
  expect(resolveFaProjectMediaMassEditPreviewKind('https://cdn.example.com/clip.ogv')).toBe('video')
  expect(resolveFaProjectMediaMassEditPreviewKind('https://cdn.example.com/track.ogg')).toBe('audio')
  expect(resolveFaProjectMediaMassEditPreviewKind('https://cdn.example.com/track.mp3')).toBe('audio')
  expect(resolveFaProjectMediaMassEditPreviewKind('https://cdn.example.com/note.md')).toBe('image')
  expect(resolveFaProjectMediaMassEditPreviewKind('https://cdn.example.com/note.json')).toBe('image')
})

/**
 * resolveFaProjectMediaMassEditPreviewTypeIconName
 * Non-image kinds map to the matching q-icon name.
 */
test('Test that resolveFaProjectMediaMassEditPreviewTypeIconName maps kinds', () => {
  expect(resolveFaProjectMediaMassEditPreviewTypeIconName('video')).toBe(
    FA_PROJECT_MEDIA_PREVIEW_ICON_VIDEO
  )
  expect(resolveFaProjectMediaMassEditPreviewTypeIconName('audio')).toBe(
    FA_PROJECT_MEDIA_PREVIEW_ICON_AUDIO
  )
  expect(resolveFaProjectMediaMassEditPreviewTypeIconName('embed')).toBe(
    FA_PROJECT_MEDIA_PREVIEW_ICON_EMBED
  )
  expect(resolveFaProjectMediaMassEditPreviewTypeIconName('image')).toBe('')
})
