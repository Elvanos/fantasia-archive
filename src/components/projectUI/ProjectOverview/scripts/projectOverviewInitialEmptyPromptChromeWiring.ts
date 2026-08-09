import { readonly, ref } from 'vue'
import type { DeepReadonly, Ref } from 'vue'

import type { I_computedRef } from 'app/types/I_vueCompositionShims'

const projectOverviewInitialEmptyPromptActive = ref(false)

/**
 * Shared session flag: Project Overview empty CTA (first template or first document).
 * MainLayout reads this for appShellLayout__pageTransitionLayer
 * --initialEmptyPrompt (flex center) + --emptyCta (950px card + IndexPage side pads).
 */
export function setProjectOverviewInitialEmptyPromptActive (active: boolean): void {
  projectOverviewInitialEmptyPromptActive.value = active
}

export function useProjectOverviewInitialEmptyPromptActive (): DeepReadonly<Ref<boolean>> {
  return readonly(projectOverviewInitialEmptyPromptActive)
}

/**
 * Keeps the shared empty-prompt chrome flag in sync with overview showEmptyCta.
 */
export function attachProjectOverviewInitialEmptyPromptChrome (input: {
  onUnmounted: (hook: () => void) => void
  setActive: (active: boolean) => void
  showEmptyCta: I_computedRef<boolean>
  watch: (
    source: () => boolean,
    effect: (active: boolean) => void,
    options?: { immediate?: boolean }
  ) => void
}): void {
  input.watch(
    () => input.showEmptyCta.value,
    (active) => {
      input.setActive(active)
    },
    { immediate: true }
  )
  input.onUnmounted(() => {
    input.setActive(false)
  })
}
