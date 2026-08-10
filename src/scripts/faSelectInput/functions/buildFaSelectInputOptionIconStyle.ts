import type { I_faColorGlyphCssCustomProperties } from 'app/types/I_faColorContrast'

/** Theme token when option color is empty/whitespace (matches hierarchy world fallback). */
export const FA_SELECT_INPUT_OPTION_ICON_COLOR_PRIMARY_BRIGHT_FALLBACK =
  'var(--fa-color-primary-bright)'

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
 * Factory: bind fa-color-glyph CSS builder for FaSelectInput colored icons.
 */
export function createBuildFaSelectInputOptionIconStyle (deps: {
  buildFaColorGlyphCssCustomProperties: (
    resolvedColor: string
  ) => I_faColorGlyphCssCustomProperties
}): (color: string | undefined) => I_faColorGlyphCssCustomProperties | null {
  function buildFaSelectInputOptionIconStyle (
    color: string | undefined
  ): I_faColorGlyphCssCustomProperties | null {
    if (color === undefined) {
      return null
    }
    return deps.buildFaColorGlyphCssCustomProperties(
      resolveFaSelectInputOptionIconColor(color)
    )
  }

  return buildFaSelectInputOptionIconStyle
}
