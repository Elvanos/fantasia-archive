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
 * fa-color-glyph on object options so fantasy shading applies (custom color or SCSS default base).
 */
export function resolveFaSelectInputOptionIconClass (
  opt: T_faSelectInputOption
): string | undefined {
  if (typeof opt === 'string') {
    return undefined
  }
  return 'fa-color-glyph'
}

/**
 * Glyph CSS custom properties via injected builder (custom color or workspace-row default).
 */
export function resolveFaSelectInputOptionIconStyle (
  opt: T_faSelectInputOption,
  buildStyle: (color: string | undefined) => I_faColorGlyphCssCustomProperties
): I_faColorGlyphCssCustomProperties | null {
  if (typeof opt === 'string') {
    return null
  }
  return buildStyle(opt.color)
}
