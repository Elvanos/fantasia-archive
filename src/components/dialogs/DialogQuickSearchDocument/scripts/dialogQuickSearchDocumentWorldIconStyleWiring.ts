import type { I_faColorGlyphCssCustomProperties } from 'app/types/I_faColorContrast'

import { resolveProjectHierarchyTreeWorldDisplayColor } from 'app/src/components/projectUI/ProjectHierarchyTree/functions/resolveProjectHierarchyTreeWorldDisplayColor'
import { buildFaColorGlyphCssCustomProperties } from 'app/src/scripts/faColorContrast/faColorContrast_manager'

/**
 * World option mdi-earth glyph style (same fa-color-glyph path as hierarchy / Quick-add).
 */
export function buildDialogQuickSearchDocumentWorldOptionIconStyle (
  worldColor: string
): I_faColorGlyphCssCustomProperties {
  return buildFaColorGlyphCssCustomProperties(
    resolveProjectHierarchyTreeWorldDisplayColor(worldColor)
  )
}
