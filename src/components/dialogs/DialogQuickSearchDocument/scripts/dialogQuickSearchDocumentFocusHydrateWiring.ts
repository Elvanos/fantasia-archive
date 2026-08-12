import type { I_createUseDialogQuickSearchDocumentDeps } from 'app/types/I_createUseDialogQuickSearchDocument'
import type { I_dialogQuickSearchDocumentFaSelectInputLike } from 'app/types/I_createUseDialogQuickSearchDocument'
import type { I_dialogQuickSearchDocumentSession } from 'app/types/I_createUseDialogQuickSearchDocument'
import type { I_dialogQuickSearchDocumentDocumentSource } from 'app/types/I_dialogQuickSearchDocument'
import type { I_dialogQuickSearchDocumentTemplateIconSource } from 'app/types/I_dialogQuickSearchDocument'
import type { I_dialogQuickSearchDocumentWorldSource } from 'app/types/I_dialogQuickSearchDocument'
import type { I_ref } from 'app/types/I_vueCompositionShims'

/**
 * True when the value exposes FaSelectInput openPopup (document auto-open).
 */
export function isDialogQuickSearchDocumentFaSelectInputLike (
  value: unknown
): value is I_dialogQuickSearchDocumentFaSelectInputLike {
  if (value === null || typeof value !== 'object') {
    return false
  }
  const candidate = value as {
    openPopup?: unknown
  }
  return typeof candidate.openPopup === 'function'
}

/**
 * Bumps focus generation so in-flight nextTick/sleep focus work is ignored.
 */
export function cancelDialogQuickSearchDocumentFocus (
  session: Pick<I_dialogQuickSearchDocumentSession, 'focusGeneration'>
): void {
  session.focusGeneration.value += 1
}

/**
 * FA 1.0 ExistingDocument timing (nextTick + sleep) + opt-in FaSelectInput openPopup.
 */
export async function focusDialogQuickSearchDocumentSelectAfterShow (
  deps: Pick<I_createUseDialogQuickSearchDocumentDeps, 'nextTick' | 'sleep' | 'documentFocusMs'>,
  session: Pick<
    I_dialogQuickSearchDocumentSession,
    'dialogModel' | 'focusGeneration' | 'documentSelectRef'
  >,
  focusGeneration: number
): Promise<void> {
  await deps.nextTick()
  await deps.sleep(deps.documentFocusMs)
  if (session.focusGeneration.value !== focusGeneration) {
    return
  }
  if (session.dialogModel.value !== true) {
    return
  }
  const select = session.documentSelectRef.value
  if (!isDialogQuickSearchDocumentFaSelectInputLike(select)) {
    return
  }
  select.openPopup()
}

/**
 * Starts a cancellable FA 1.0 ExistingDocument-timed open sequence; returns the generation used for this run.
 */
export function scheduleDialogQuickSearchDocumentFocus (
  deps: Pick<I_createUseDialogQuickSearchDocumentDeps, 'nextTick' | 'sleep' | 'documentFocusMs'>,
  session: Pick<
    I_dialogQuickSearchDocumentSession,
    'dialogModel' | 'focusGeneration' | 'documentSelectRef'
  >
): number {
  session.focusGeneration.value += 1
  const focusGeneration = session.focusGeneration.value
  void focusDialogQuickSearchDocumentSelectAfterShow(deps, session, focusGeneration)
  return focusGeneration
}

/**
 * Template `:ref` binder — keeps session.documentSelectRef on FaSelectInput expose.
 */
export function bindDialogQuickSearchDocumentSelectRef (
  documentSelectRef: I_ref<I_dialogQuickSearchDocumentFaSelectInputLike | null>,
  el: unknown
): void {
  if (!isDialogQuickSearchDocumentFaSelectInputLike(el)) {
    documentSelectRef.value = null
    return
  }
  documentSelectRef.value = el
}

/**
 * Loads worlds/templates and picks saved last world. Does not load documents
 * (document select hydrates after the dialog is open).
 */
export async function hydrateDialogQuickSearchDocumentWorlds (
  deps: I_createUseDialogQuickSearchDocumentDeps,
  session: {
    selectedDocumentId: I_ref<string | null>
    selectedWorldId: I_ref<string | null>
    templateIconsById: I_ref<Map<string, I_dialogQuickSearchDocumentTemplateIconSource>>
    worlds: I_ref<I_dialogQuickSearchDocumentWorldSource[]>
  }
): Promise<void> {
  const sources = await deps.loadQuickSearchDocumentSources()
  session.worlds.value = sources.worlds
  const nextMap = new Map<string, I_dialogQuickSearchDocumentTemplateIconSource>()
  for (const template of sources.templates) {
    nextMap.set(template.id, template)
  }
  session.templateIconsById.value = nextMap
  session.selectedDocumentId.value = null
  const savedWorldId = await deps.readLastSelectedWorldId()
  session.selectedWorldId.value = deps.pickWorldIdWithSavedPreference({
    worlds: sources.worlds,
    savedWorldId,
    pickFirstWorldId: deps.pickFirstWorldId
  })
}

/**
 * Loads documents for the session selected world (empty list when none selected).
 */
export async function hydrateDialogQuickSearchDocumentDocuments (
  deps: I_createUseDialogQuickSearchDocumentDeps,
  session: {
    documents: I_ref<I_dialogQuickSearchDocumentDocumentSource[]>
    selectedWorldId: I_ref<string | null>
  }
): Promise<void> {
  const worldId = session.selectedWorldId.value
  if (worldId === null || worldId.length === 0) {
    session.documents.value = []
    return
  }
  session.documents.value = await deps.loadDocumentsForWorld(worldId)
}

/**
 * Full hydrate: worlds first, then documents for the picked world.
 */
export async function hydrateDialogQuickSearchDocumentSources (
  deps: I_createUseDialogQuickSearchDocumentDeps,
  session: {
    documents: I_ref<I_dialogQuickSearchDocumentDocumentSource[]>
    selectedDocumentId: I_ref<string | null>
    selectedWorldId: I_ref<string | null>
    templateIconsById: I_ref<Map<string, I_dialogQuickSearchDocumentTemplateIconSource>>
    worlds: I_ref<I_dialogQuickSearchDocumentWorldSource[]>
  }
): Promise<void> {
  await hydrateDialogQuickSearchDocumentWorlds(deps, session)
  await hydrateDialogQuickSearchDocumentDocuments(deps, session)
}
