import { describe, expect, test, vi } from 'vitest'
import { computed, ref } from 'vue'

import {
  attachProjectOverviewInitialEmptyPromptChrome,
  setProjectOverviewInitialEmptyPromptActive,
  useProjectOverviewInitialEmptyPromptActive
} from '../projectOverviewInitialEmptyPromptChromeWiring'

describe('projectOverviewInitialEmptyPromptChromeWiring', () => {
  test('Test that setProjectOverviewInitialEmptyPromptActive updates shared readonly flag', () => {
    setProjectOverviewInitialEmptyPromptActive(false)
    expect(useProjectOverviewInitialEmptyPromptActive().value).toBe(false)
    setProjectOverviewInitialEmptyPromptActive(true)
    expect(useProjectOverviewInitialEmptyPromptActive().value).toBe(true)
    setProjectOverviewInitialEmptyPromptActive(false)
  })

  test('Test that attachProjectOverviewInitialEmptyPromptChrome syncs showEmptyCta and clears on unmount', () => {
    setProjectOverviewInitialEmptyPromptActive(false)
    const showEmptyCta = ref(true)
    const unmountHooks: Array<() => void> = []
    const setActive = vi.fn((active: boolean) => {
      setProjectOverviewInitialEmptyPromptActive(active)
    })

    attachProjectOverviewInitialEmptyPromptChrome({
      onUnmounted: (hook) => {
        unmountHooks.push(hook)
      },
      setActive,
      showEmptyCta: computed(() => showEmptyCta.value),
      watch: (source, effect, options) => {
        if (options?.immediate === true) {
          effect(source())
        }
        // Simple stub: re-run when test flips source via direct effect call below
        void source
      }
    })

    expect(setActive).toHaveBeenCalledWith(true)
    expect(useProjectOverviewInitialEmptyPromptActive().value).toBe(true)

    for (const hook of unmountHooks) {
      hook()
    }
    expect(setActive).toHaveBeenCalledWith(false)
    expect(useProjectOverviewInitialEmptyPromptActive().value).toBe(false)
  })
})
