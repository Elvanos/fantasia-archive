import type { I_createUseDialogQuickAddDocumentDeps } from 'app/types/I_createUseDialogQuickAddDocument'
import type { I_dialogQuickAddDocumentQSelectLike } from 'app/types/I_createUseDialogQuickAddDocument'
import type { I_dialogQuickAddDocumentSession } from 'app/types/I_createUseDialogQuickAddDocument'
import type { T_dialogQuickAddDocumentSelectFilterUpdate } from 'app/types/I_createUseDialogQuickAddDocument'
import type { I_dialogQuickAddDocumentTemplateSource } from 'app/types/I_dialogQuickAddDocument'
import type { I_dialogQuickAddDocumentWorldSource } from 'app/types/I_dialogQuickAddDocument'
import type { I_ref } from 'app/types/I_vueCompositionShims'

import { filterDialogQuickAddDocumentTemplateOptionsByNeedle } from './functions/dialogQuickAddDocumentTemplateFilter'

/**
 * True when the value looks like a Quasar q-select that can open its popup
 * and highlight options (FA 1.0 refocusSelect APIs).
 */
export function isDialogQuickAddDocumentQSelectLike (
  value: unknown
): value is I_dialogQuickAddDocumentQSelectLike {
  if (value === null || typeof value !== 'object') {
    return false
  }
  const candidate = value as {
    moveOptionSelection?: unknown
    setOptionIndex?: unknown
    showPopup?: unknown
  }
  return (
    typeof candidate.showPopup === 'function' &&
    typeof candidate.setOptionIndex === 'function' &&
    typeof candidate.moveOptionSelection === 'function'
  )
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
 * FA 1.0 refocusSelect — highlight first menu option for keyboard Enter.
 */
export function highlightDialogQuickAddDocumentFirstTemplateOption (
  select: I_dialogQuickAddDocumentQSelectLike
): void {
  select.setOptionIndex(-1)
  select.moveOptionSelection(1, true)
}

/**
 * FA 1.0 NewDocument timing (nextTick + sleep) + Quasar 2 showPopup, then first-item highlight.
 */
export async function focusDialogQuickAddDocumentTemplateSelectAfterShow (
  deps: Pick<I_createUseDialogQuickAddDocumentDeps, 'nextTick' | 'sleep' | 'templateFocusMs'>,
  session: Pick<
    I_dialogQuickAddDocumentSession,
    'dialogModel' | 'filteredTemplateOptions' | 'focusGeneration' | 'templateOptions' | 'templateSelectRef'
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
  if (!isDialogQuickAddDocumentQSelectLike(select)) {
    return
  }
  // Seed options before open so the menu is not empty if @filter lags.
  session.filteredTemplateOptions.value = [...session.templateOptions.value]
  select.showPopup()
  await deps.nextTick()
  if (session.focusGeneration.value !== focusGeneration) {
    return
  }
  if (session.filteredTemplateOptions.value.length > 0) {
    highlightDialogQuickAddDocumentFirstTemplateOption(select)
  }
}

/**
 * Starts a cancellable FA 1.0-timed open sequence; returns the generation used for this run.
 */
export function scheduleDialogQuickAddDocumentTemplateFocus (
  deps: Pick<I_createUseDialogQuickAddDocumentDeps, 'nextTick' | 'sleep' | 'templateFocusMs'>,
  session: Pick<
    I_dialogQuickAddDocumentSession,
    'dialogModel' | 'filteredTemplateOptions' | 'focusGeneration' | 'templateOptions' | 'templateSelectRef'
  >
): number {
  session.focusGeneration.value += 1
  const focusGeneration = session.focusGeneration.value
  void focusDialogQuickAddDocumentTemplateSelectAfterShow(deps, session, focusGeneration)
  return focusGeneration
}

/**
 * After filter update, highlight the first option (FA 1.0 refocusSelect via nextTick).
 */
export async function refocusDialogQuickAddDocumentTemplateSelect (
  deps: Pick<I_createUseDialogQuickAddDocumentDeps, 'nextTick'>,
  templateSelectRef: I_ref<I_dialogQuickAddDocumentQSelectLike | null>
): Promise<void> {
  await deps.nextTick()
  const select = templateSelectRef.value
  if (!isDialogQuickAddDocumentQSelectLike(select)) {
    return
  }
  highlightDialogQuickAddDocumentFirstTemplateOption(select)
}

/**
 * Template `:ref` binder — keeps session.templateSelectRef on the Quasar q-select instance.
 */
export function bindDialogQuickAddDocumentTemplateSelectRef (
  templateSelectRef: I_ref<I_dialogQuickAddDocumentQSelectLike | null>,
  el: unknown
): void {
  if (!isDialogQuickAddDocumentQSelectLike(el)) {
    templateSelectRef.value = null
    return
  }
  templateSelectRef.value = el
}

/**
 * Quasar q-select @filter handler — FA 1.0 filterNewSelect + first-option highlight.
 * Quasar 2 invokes update's afterFn with the select instance after options apply.
 */
export function filterDialogQuickAddDocumentTemplateSelect (
  session: Pick<
    I_dialogQuickAddDocumentSession,
    'filteredTemplateOptions' | 'templateOptions'
  >,
  val: string,
  update: T_dialogQuickAddDocumentSelectFilterUpdate
): void {
  const nextOptions = filterDialogQuickAddDocumentTemplateOptionsByNeedle(
    session.templateOptions.value,
    val
  )
  update(
    () => {
      session.filteredTemplateOptions.value = nextOptions
    },
    (select) => {
      if (nextOptions.length > 0) {
        highlightDialogQuickAddDocumentFirstTemplateOption(select)
      }
    }
  )
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
