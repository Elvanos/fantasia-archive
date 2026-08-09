import type {
  I_createUseDialogQuickAddDocumentDeps,
  I_dialogQuickAddDocumentSession
} from 'app/types/I_createUseDialogQuickAddDocument'
import type { T_dialogName } from 'app/types/T_appDialogsAndDocuments'

import {
  cancelDialogQuickAddDocumentTemplateFocus,
  focusDialogQuickAddDocumentTemplateSelectAfterShow,
  hydrateDialogQuickAddDocumentSources,
  scheduleDialogQuickAddDocumentTemplateFocus
} from './dialogQuickAddDocumentFocusHydrateWiring'

/**
 * Opens/closes dialog, hydrates sources on show, and wires store/directInput watchers.
 */
export function wireDialogQuickAddDocumentOpenClose (
  deps: I_createUseDialogQuickAddDocumentDeps,
  session: I_dialogQuickAddDocumentSession,
  props: { directInput?: T_dialogName | undefined }
): {
    closeDialog: () => void
    onDialogHide: () => void
    onDialogShow: () => void
  } {
  const openDialog = (input: T_dialogName): void => {
    session.documentName.value = input
    session.dialogModel.value = true
  }

  const closeDialog = (): void => {
    session.dialogModel.value = false
  }

  const onDialogShow = (): void => {
    session.skipNextWorldChangeReopen.value = true
    const focusGeneration = session.focusGeneration.value + 1
    session.focusGeneration.value = focusGeneration
    void (async () => {
      try {
        await hydrateDialogQuickAddDocumentSources(deps, session)
      } finally {
        session.skipNextWorldChangeReopen.value = false
      }
      await focusDialogQuickAddDocumentTemplateSelectAfterShow(deps, session, focusGeneration)
    })()
  }

  const onDialogHide = (): void => {
    cancelDialogQuickAddDocumentTemplateFocus(session)
    session.selectedTemplateId.value = null
    session.selectedWorldId.value = null
    session.filteredTemplateOptions.value = []
    session.worlds.value = []
    session.templatesById.value = new Map()
  }

  deps.watch(session.dialogModel, (isOpen) => {
    if (isOpen !== true) {
      cancelDialogQuickAddDocumentTemplateFocus(session)
    }
  })

  deps.watch(() => deps.resolveDialogComponentStoreOrNull()?.dialogUUID, () => {
    const dialogComponentStore = deps.resolveDialogComponentStoreOrNull()
    if (
      dialogComponentStore !== null &&
      deps.isDialogQuickAddDocumentStoreTarget(dialogComponentStore.dialogToOpen)
    ) {
      openDialog(dialogComponentStore.dialogToOpen as T_dialogName)
    }
  })

  deps.watch(() => props.directInput, () => {
    if (deps.isDialogQuickAddDocumentDirectInput(props.directInput)) {
      openDialog(props.directInput as T_dialogName)
    }
  })

  deps.onMounted(() => {
    if (deps.isDialogQuickAddDocumentDirectInput(props.directInput)) {
      openDialog(props.directInput as T_dialogName)
    }
  })

  deps.onBeforeUnmount(() => {
    cancelDialogQuickAddDocumentTemplateFocus(session)
  })

  return {
    closeDialog,
    onDialogHide,
    onDialogShow
  }
}

/**
 * World change reopens template menu; template select creates a temporary document.
 */
export function wireDialogQuickAddDocumentSelectHandlers (
  deps: I_createUseDialogQuickAddDocumentDeps,
  session: I_dialogQuickAddDocumentSession,
  closeDialog: () => void
): {
    onTemplateSelect: (templateId: string | null | undefined) => Promise<void>
    onWorldSelect: (worldId: string | null | undefined) => void
  } {
  const onWorldSelect = (worldId: string | null | undefined): void => {
    const nextWorldId = typeof worldId === 'string' && worldId.length > 0 ? worldId : null
    session.selectedWorldId.value = nextWorldId
    session.selectedTemplateId.value = null
    session.filteredTemplateOptions.value = []
    if (session.skipNextWorldChangeReopen.value) {
      return
    }
    scheduleDialogQuickAddDocumentTemplateFocus(deps, session)
  }

  const onTemplateSelect = async (templateId: string | null | undefined): Promise<void> => {
    if (typeof templateId !== 'string' || templateId.length === 0) {
      session.selectedTemplateId.value = null
      return
    }
    const worldId = session.selectedWorldId.value
    if (worldId === null || worldId.length === 0) {
      return
    }
    const option = session.templateOptions.value.find((row) => row.value === templateId)
    if (option === undefined) {
      return
    }
    session.selectedTemplateId.value = templateId
    const displayName = deps.resolveNewDocumentDisplayName({
      preferredLanguageCode: deps.resolvePreferredLanguageCode(),
      titlePluralTranslations: option.titlePluralTranslations,
      titleSingularTranslations: option.titleSingularTranslations
    })
    // FA 1.0 closes first, then creates — keeps dismiss snappy while create runs.
    closeDialog()
    await deps.createTemporaryDocument({
      displayName,
      templateId,
      worldId
    })
  }

  return {
    onTemplateSelect,
    onWorldSelect
  }
}
