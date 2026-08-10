import type { I_faColorGlyphCssCustomProperties } from 'app/types/I_faColorContrast'
import type { T_faSelectInputOption } from 'app/types/I_faSelectInput'

/**
 * Closed-field / chip label text for FaSelectInput options.
 */
export function resolveFaSelectInputObjectOptionLabel (
  opt: T_faSelectInputOption
): string {
  if (typeof opt === 'string') {
    return opt
  }
  return opt.name
}

/**
 * Inline selection row visibility (non-empty string or object id).
 */
export function shouldShowFaSelectInputInlineSelection (
  opt: T_faSelectInputOption
): boolean {
  if (typeof opt === 'string') {
    return opt.length > 0
  }
  return opt !== null && opt.id.length > 0
}

/**
 * fa-color-glyph class when option carries a color token.
 */
export function resolveFaSelectInputOptionIconClass (
  opt: T_faSelectInputOption
): string | undefined {
  if (typeof opt === 'string' || opt.color === undefined) {
    return undefined
  }
  return 'fa-color-glyph'
}

/**
 * Glyph CSS custom properties via injected builder.
 */
export function resolveFaSelectInputOptionIconStyle (
  opt: T_faSelectInputOption,
  buildStyle: (color: string | undefined) => I_faColorGlyphCssCustomProperties | null
): I_faColorGlyphCssCustomProperties | null {
  if (typeof opt === 'string') {
    return null
  }
  return buildStyle(opt.color)
}
