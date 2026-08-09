import type {
  I_createUseDialogQuickAddDocumentDeps,
  I_dialogQuickAddDocumentApi,
  I_dialogQuickAddDocumentQSelectLike,
  I_dialogQuickAddDocumentSession
} from 'app/types/I_createUseDialogQuickAddDocument'
import type {
  I_dialogQuickAddDocumentTemplateOption,
  I_dialogQuickAddDocumentTemplateSource,
  I_dialogQuickAddDocumentWorldSource
} from 'app/types/I_dialogQuickAddDocument'
import type { T_dialogName } from 'app/types/T_appDialogsAndDocuments'

import {
  bindDialogQuickAddDocumentTemplateSelectRef,
  filterDialogQuickAddDocumentTemplateSelect
} from './dialogQuickAddDocumentFocusHydrateWiring'
import {
  wireDialogQuickAddDocumentOpenClose,
  wireDialogQuickAddDocumentSelectHandlers
} from './dialogQuickAddDocumentInteractionWiring'

function createDialogQuickAddDocumentSession (
  deps: I_createUseDialogQuickAddDocumentDeps
): I_dialogQuickAddDocumentSession {
  const dialogModel = deps.ref(false)
  const documentName = deps.ref('')
  const worlds = deps.ref<I_dialogQuickAddDocumentWorldSource[]>([])
  const templatesById = deps.ref(new Map<string, I_dialogQuickAddDocumentTemplateSource>())
  const selectedWorldId = deps.ref<string | null>(null)
  const selectedTemplateId = deps.ref<string | null>(null)
  const templateSelectRef = deps.ref<I_dialogQuickAddDocumentQSelectLike | null>(null)
  const filteredTemplateOptions = deps.ref<I_dialogQuickAddDocumentTemplateOption[]>([])
  const focusGeneration = deps.ref(0)
  const skipNextWorldChangeReopen = deps.ref(false)
  deps.registerComponentDialogStackGuard(dialogModel)

  const worldOptions = deps.computed(() => {
    return deps.buildWorldOptions({
      preferredLanguageCode: deps.resolvePreferredLanguageCode(),
      resolveWorldLabel: deps.resolveWorldOptionLabel,
      worlds: worlds.value
    })
  })

  const showWorldSelect = deps.computed(() => worldOptions.value.length > 1)

  const templateOptions = deps.computed(() => {
    const world = deps.findWorldById(worlds.value, selectedWorldId.value)
    return deps.buildTemplateOptions({
      preferredLanguageCode: deps.resolvePreferredLanguageCode(),
      resolveTemplateLabel: deps.resolveTemplateOptionLabel,
      templatesById: templatesById.value,
      world
    })
  })

  return {
    dialogModel,
    documentName,
    filteredTemplateOptions,
    focusGeneration,
    selectedTemplateId,
    selectedWorldId,
    showWorldSelect,
    skipNextWorldChangeReopen,
    templateOptions,
    templateSelectRef,
    templatesById,
    worldOptions,
    worlds
  }
}

/**
 * Composable body for Quick-Add Document (wired from dialogQuickAddDocument_manager).
 */
export function runDialogQuickAddDocumentSession (
  deps: I_createUseDialogQuickAddDocumentDeps,
  props: { directInput?: T_dialogName | undefined }
): I_dialogQuickAddDocumentApi {
  const session = createDialogQuickAddDocumentSession(deps)
  const openClose = wireDialogQuickAddDocumentOpenClose(deps, session, props)
  const selectHandlers = wireDialogQuickAddDocumentSelectHandlers(
    deps,
    session,
    openClose.closeDialog
  )

  const onTemplateFilter = (
    val: string,
    update: (fn: () => void, afterFn?: (select: I_dialogQuickAddDocumentQSelectLike) => void) => void
  ): void => {
    filterDialogQuickAddDocumentTemplateSelect(session, val, update)
  }

  const bindTemplateSelectRef = (el: unknown): void => {
    bindDialogQuickAddDocumentTemplateSelectRef(session.templateSelectRef, el)
  }

  return {
    bindTemplateSelectRef,
    dialogModel: session.dialogModel,
    documentName: session.documentName,
    filteredTemplateOptions: session.filteredTemplateOptions,
    onDialogHide: openClose.onDialogHide,
    onDialogShow: openClose.onDialogShow,
    onTemplateFilter,
    onTemplateSelect: selectHandlers.onTemplateSelect,
    onWorldSelect: selectHandlers.onWorldSelect,
    selectedTemplateId: session.selectedTemplateId,
    selectedWorldId: session.selectedWorldId,
    showWorldSelect: session.showWorldSelect,
    templateSelectRef: session.templateSelectRef,
    worldOptions: session.worldOptions
  }
}
