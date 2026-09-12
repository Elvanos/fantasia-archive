/** Settle URL typing before swapping the mass-edit thumbnail probe. */
export const FA_PROJECT_MEDIA_MASS_EDIT_PREVIEW_DEBOUNCE_MS = 300

/**
 * Point the thumbnail probe at nextUrl. Keep a prior fail until load succeeds.
 */
export function applyFaProjectMediaMassEditPreviewProbe (
  probeSrc: { value: string },
  previewLoaded: { value: boolean },
  previewFailed: { value: boolean },
  nextUrl: string
): void {
  probeSrc.value = nextUrl
  previewLoaded.value = false
  if (nextUrl.length === 0) {
    previewFailed.value = true
  }
}

/**
 * Preview loaded: show it and drop the warning.
 */
export function markFaProjectMediaMassEditPreviewLoaded (
  previewFailed: { value: boolean },
  previewLoaded: { value: boolean }
): void {
  previewFailed.value = false
  previewLoaded.value = true
}

/**
 * Preview error: keep the probe hidden and show the warning.
 */
export function markFaProjectMediaMassEditPreviewFailed (
  previewFailed: { value: boolean },
  previewLoaded: { value: boolean }
): void {
  previewFailed.value = true
  previewLoaded.value = false
}

/**
 * List thumb overlay text: trimmed title, else the preview URL.
 */
export function resolveFaProjectMediaThumbCaption (
  displayName: string,
  fallbackUrl: string
): string {
  const title = displayName.trim()
  if (title.length > 0) {
    return title
  }
  return fallbackUrl
}
