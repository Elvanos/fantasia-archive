import type { I_faActionPayloadMap } from 'app/types/I_faActionManagerDomain'
import type { I_faProjectMediaUpsertItem } from 'app/types/I_faProjectMediaDomain'

type T_createFaActionDefinitionHandlersProjectMediaDeps = {
  i18n: { global: { t: (key: string) => string } }
  notifyCreate: (options: { group: boolean, message: string, type: string }) => void
  S_FaActiveProject: () => { hasActiveProject: boolean }
  upsertMedia: (items: I_faProjectMediaUpsertItem[]) => Promise<void>
}

async function handleSaveProjectMedia (
  deps: T_createFaActionDefinitionHandlersProjectMediaDeps,
  payload: I_faActionPayloadMap['saveProjectMedia']
): Promise<void> {
  if (!deps.S_FaActiveProject().hasActiveProject) {
    throw new Error(deps.i18n.global.t('dialogs.projectMedia.saveError'))
  }
  await deps.upsertMedia(payload.items)
  deps.notifyCreate({
    group: false,
    message: deps.i18n.global.t('dialogs.projectMedia.saveSuccess'),
    type: 'positive'
  })
}

export function createFaActionDefinitionHandlersProjectMedia (
  deps: T_createFaActionDefinitionHandlersProjectMediaDeps
): {
    handleSaveProjectMedia: (payload: I_faActionPayloadMap['saveProjectMedia']) => Promise<void>
  } {
  function boundHandleSaveProjectMedia (
    payload: I_faActionPayloadMap['saveProjectMedia']
  ): Promise<void> {
    return handleSaveProjectMedia(deps, payload)
  }
  return {
    handleSaveProjectMedia: boundHandleSaveProjectMedia
  }
}
