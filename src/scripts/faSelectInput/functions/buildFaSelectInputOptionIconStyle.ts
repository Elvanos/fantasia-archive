import type { I_faColorGlyphCssCustomProperties } from 'app/types/I_faColorContrast'

/** Theme token when option color is empty/whitespace (matches hierarchy world fallback). */
export const FA_SELECT_INPUT_OPTION_ICON_COLOR_PRIMARY_BRIGHT_FALLBACK =
  'var(--fa-color-primary-bright)'

/**
 * Default icon base when option has no color — same workspace-row token as hierarchy documents.
 * Flat: solid fill via color: var(--fa-color-glyph-base). Fantasy: fa-color-glyph shading.
 */
export const FA_SELECT_INPUT_OPTION_ICON_COLOR_WORKSPACE_ROW_DEFAULT =
  'var(--fa-color-text-workspace-row)'

/**
 * Resolve option icon color; empty/whitespace uses primary-bright theme token.
 */
export function resolveFaSelectInputOptionIconColor (color: string): string {
  const trimmedColor = color.trim()
  if (trimmedColor.length === 0) {
    return FA_SELECT_INPUT_OPTION_ICON_COLOR_PRIMARY_BRIGHT_FALLBACK
  }
  return trimmedColor
}

/**
 * Factory: bind fa-color-glyph CSS builder for FaSelectInput icons (always returns props).
 */
export function createBuildFaSelectInputOptionIconStyle (deps: {
  buildFaColorGlyphCssCustomProperties: (
    resolvedColor: string
  ) => I_faColorGlyphCssCustomProperties
}): (color: string | undefined) => I_faColorGlyphCssCustomProperties {
  function buildFaSelectInputOptionIconStyle (
    color: string | undefined
  ): I_faColorGlyphCssCustomProperties {
    if (color === undefined) {
      return deps.buildFaColorGlyphCssCustomProperties(
        FA_SELECT_INPUT_OPTION_ICON_COLOR_WORKSPACE_ROW_DEFAULT
      )
    }
    return deps.buildFaColorGlyphCssCustomProperties(
      resolveFaSelectInputOptionIconColor(color)
    )
  }

  return buildFaSelectInputOptionIconStyle
}
