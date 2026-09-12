import { expect, test } from 'vitest'

import {
  FA_PROJECT_MEDIA_AUDIO_CONTROLS_RELAYOUT_MS,
  relayoutFaProjectMediaAudioControls
} from '../faProjectMediaAudioControlsRelayout'

/**
 * faProjectMediaAudioControlsRelayout
 * Null element is a no-op.
 */
test('Test that relayoutFaProjectMediaAudioControls ignores null', () => {
  expect(() => {
    relayoutFaProjectMediaAudioControls(null)
  }).not.toThrow()
})

/**
 * faProjectMediaAudioControlsRelayout
 * Reads layout then restores the controls flag.
 */
test('Test that relayoutFaProjectMediaAudioControls toggles controls and reads width', () => {
  let widthReads = 0
  const el = {
    controls: true,
    get offsetWidth () {
      widthReads += 1
      return 320
    }
  }

  relayoutFaProjectMediaAudioControls(el)

  expect(widthReads).toBe(1)
  expect(el.controls).toBe(true)
  expect(FA_PROJECT_MEDIA_AUDIO_CONTROLS_RELAYOUT_MS).toBe(300)
})
