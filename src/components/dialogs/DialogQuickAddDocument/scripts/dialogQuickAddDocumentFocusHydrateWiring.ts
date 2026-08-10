import type { I_createUseDialogQuickAddDocumentDeps } from 'app/types/I_createUseDialogQuickAddDocument'
import type { I_dialogQuickAddDocumentFaSelectInputLike } from 'app/types/I_createUseDialogQuickAddDocument'
import type { I_dialogQuickAddDocumentSession } from 'app/types/I_createUseDialogQuickAddDocument'
import type { I_dialogQuickAddDocumentTemplateSource } from 'app/types/I_dialogQuickAddDocument'
import type { I_dialogQuickAddDocumentWorldSource } from 'app/types/I_dialogQuickAddDocument'
import type { I_ref } from 'app/types/I_vueCompositionShims'

/**
 * True when the value exposes FaSelectInput openPopup (template auto-open).
 */
export function isDialogQuickAddDocumentFaSelectInputLike (
  value: unknown
): value is I_dialogQuickAddDocumentFaSelectInputLike {
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
export function cancelDialogQuickAddDocumentTemplateFocus (
  session: Pick<I_dialogQuickAddDocumentSession, 'focusGeneration'>
): void {
  session.focusGeneration.value += 1
}

/**
 * FA 1.0 NewDocument timing (nextTick + sleep) + opt-in FaSelectInput openPopup.
 * First-option keyboard highlight is owned by FaSelectInput on popup-show.
 */
export async function focusDialogQuickAddDocumentTemplateSelectAfterShow (
  deps: Pick<I_createUseDialogQuickAddDocumentDeps, 'nextTick' | 'sleep' | 'templateFocusMs'>,
  session: Pick<
    I_dialogQuickAddDocumentSession,
    'dialogModel' | 'focusGeneration' | 'templateSelectRef'
  >,
  focusGeneration: number
): Promise<void> {
  await deps.nextTick()
  await deps.sleep(deps.templateFocusMs)
  if (session.focusGeneration.value !== focusGeneration) {
    return
  }
  if (session.dialogModel.value !== true) {
    return
  }
  const select = session.templateSelectRef.value
  if (!isDialogQuickAddDocumentFaSelectInputLike(select)) {
    return
  }
  select.openPopup()
}

/**
 * Starts a cancellable FA 1.0-timed open sequence; returns the generation used for this run.
 */
export function scheduleDialogQuickAddDocumentTemplateFocus (
  deps: Pick<I_createUseDialogQuickAddDocumentDeps, 'nextTick' | 'sleep' | 'templateFocusMs'>,
  session: Pick<
    I_dialogQuickAddDocumentSession,
    'dialogModel' | 'focusGeneration' | 'templateSelectRef'
  >
): number {
  session.focusGeneration.value += 1
  const focusGeneration = session.focusGeneration.value
  void focusDialogQuickAddDocumentTemplateSelectAfterShow(deps, session, focusGeneration)
  return focusGeneration
}

/**
 * Template `:ref` binder — keeps session.templateSelectRef on FaSelectInput expose.
 */
export function bindDialogQuickAddDocumentTemplateSelectRef (
  templateSelectRef: I_ref<I_dialogQuickAddDocumentFaSelectInputLike | null>,
  el: unknown
): void {
  if (!isDialogQuickAddDocumentFaSelectInputLike(el)) {
    templateSelectRef.value = null
    return
  }
  templateSelectRef.value = el
}

/**
 * Loads worlds/templates and preselects the first world by sortOrder.
 */
export async function hydrateDialogQuickAddDocumentSources (
  deps: I_createUseDialogQuickAddDocumentDeps,
  session: {
    selectedTemplateId: I_ref<string | null>
    selectedWorldId: I_ref<string | null>
    templatesById: I_ref<Map<string, I_dialogQuickAddDocumentTemplateSource>>
    worlds: I_ref<I_dialogQuickAddDocumentWorldSource[]>
  }
): Promise<void> {
  const sources = await deps.loadQuickAddDocumentSources()
  session.worlds.value = sources.worlds
  const nextMap = new Map<string, I_dialogQuickAddDocumentTemplateSource>()
  for (const template of sources.templates) {
    nextMap.set(template.id, template)
  }
  session.templatesById.value = nextMap
  session.selectedTemplateId.value = null
  session.selectedWorldId.value = deps.pickFirstWorldId(sources.worlds)
}
