import type { I_dialogQuickAddDocumentTemplateSource } from 'app/types/I_dialogQuickAddDocument'
import type { I_dialogQuickAddDocumentWorldSource } from 'app/types/I_dialogQuickAddDocument'
import type { T_faUserSettingsLanguageCode } from 'app/types/faUserSettingsLanguageRegistry'
import { FA_ICON_PICKER_EMPTY_PLACEHOLDER_ICON } from 'app/types/I_faIconPickerInput'

import { resolveTrimmedIconOrDefault } from 'app/src/scripts/faIcons/faIconDisplay_manager'
import { S_FaUserSettings } from 'src/stores/S_FaUserSettings'

/**
 * Loads worlds + document templates for Quick-Add Document option lists.
 */
export async function loadDialogQuickAddDocumentSources (): Promise<{
  templates: I_dialogQuickAddDocumentTemplateSource[]
  worlds: I_dialogQuickAddDocumentWorldSource[]
}> {
  const api = window.faContentBridgeAPIs?.projectContent
  if (
    typeof api?.listWorldsForProjectSettings !== 'function' ||
    typeof api?.listDocumentTemplatesForProjectSettings !== 'function'
  ) {
    return {
      templates: [],
      worlds: []
    }
  }
  const [worldsResult, templatesResult] = await Promise.all([
    api.listWorldsForProjectSettings(),
    api.listDocumentTemplatesForProjectSettings()
  ])
  const worlds: I_dialogQuickAddDocumentWorldSource[] = worldsResult.items.map((world) => ({
    color: world.color,
    displayNameTranslations: world.displayNameTranslations,
    id: world.id,
    sortOrder: world.sortOrder,
    templateLayout: {
      groups: world.templateLayout.groups.map((group) => ({
        id: group.id,
        rootSortOrder: group.rootSortOrder
      })),
      placements: world.templateLayout.placements.map((placement) => ({
        documentTemplateId: placement.documentTemplateId,
        groupId: placement.groupId,
        groupSortOrder: placement.groupSortOrder,
        rootSortOrder: placement.rootSortOrder
      }))
    }
  }))
  const templates: I_dialogQuickAddDocumentTemplateSource[] = templatesResult.items.map((template) => ({
    icon: resolveTrimmedIconOrDefault(template.icon, FA_ICON_PICKER_EMPTY_PLACEHOLDER_ICON),
    id: template.id,
    titlePluralTranslations: template.titlePluralTranslations,
    titleSingularTranslations: template.titleSingularTranslations
  }))
  return {
    templates,
    worlds
  }
}

/**
 * Preferred UI language for Quick-Add option labels and new-document display names.
 */
export function resolveDialogQuickAddDocumentPreferredLanguageCode (): T_faUserSettingsLanguageCode {
  return S_FaUserSettings().settings?.languageCode ?? 'en-US'
}
