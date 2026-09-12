/**
 * Delay after mount before a second native-audio controls relayout.
 * Matches the Project Media single-edit slide transform duration.
 */
export const FA_PROJECT_MEDIA_AUDIO_CONTROLS_RELAYOUT_MS = 300

/**
 * Chromium native audio controls skip a layout pass while an ancestor
 * is transforming. Toggle controls and read offsetWidth to force the
 * same reflow a DevTools CSS edit triggers.
 */
export function relayoutFaProjectMediaAudioControls (el: {
  controls: boolean
  offsetWidth: number
} | null): void {
  if (el === null) {
    return
  }
  const showControls = el.controls
  el.controls = false
  void el.offsetWidth
  el.controls = showControls
}
