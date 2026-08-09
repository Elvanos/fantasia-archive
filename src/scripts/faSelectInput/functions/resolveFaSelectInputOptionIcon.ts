import type {
  T_faSelectInputMode,
  T_faSelectInputOption
} from 'app/types/I_faSelectInput'

/**
 * Resolves q-icon name for an option. Document mode always shows a glyph
 * (empty/missing template icon → emptyPlaceholderIcon). Other object modes show
 * a glyph only when icon is present (empty string still falls back).
 */
export function resolveFaSelectInputOptionIcon (
  opt: T_faSelectInputOption,
  mode: T_faSelectInputMode,
  emptyPlaceholderIcon: string
): string | null {
  if (typeof opt === 'string') {
    return null
  }
  if (mode === 'document') {
    const trimmed = (opt.icon ?? '').trim()
    if (trimmed.length > 0) {
      return trimmed
    }
    return emptyPlaceholderIcon
  }
  if (opt.icon === undefined) {
    return null
  }
  const trimmed = opt.icon.trim()
  if (trimmed.length > 0) {
    return trimmed
  }
  return emptyPlaceholderIcon
}
