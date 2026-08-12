import { expect, test, vi } from 'vitest'
import { ref } from 'vue'

import { attachProjectOverviewSessionLifecycle } from '../projectOverviewSessionLifecycleWiring'

/**
 * attachProjectOverviewSessionLifecycle
 * Loads overview data on mount and again when project id or census generation changes.
 * MRU generation triggers Last opened refresh only.
 */
test('Test that attachProjectOverviewSessionLifecycle reloads on project and census changes', () => {
  const loadOverviewData = vi.fn(async () => undefined)
  const refreshLastOpenedAfterMru = vi.fn(async () => undefined)
  const clearChartSettleTimer = vi.fn()
  const randomTipCaption = ref('')
  const onMountedHooks: Array<() => void> = []
  const onUnmountedHooks: Array<() => void> = []
  let projectId: string | null = 'project-a'
  let censusGeneration = 0
  let lastOpenedGeneration = 0
  const watchEffects: Array<() => void> = []

  attachProjectOverviewSessionLifecycle({
    clearChartSettleTimer,
    getActiveProjectId: () => projectId,
    getDocumentCensusRefreshGeneration: () => censusGeneration,
    getDocumentLastOpenedRefreshGeneration: () => lastOpenedGeneration,
    loadOverviewData,
    onMounted: (hook) => {
      onMountedHooks.push(hook)
    },
    onUnmounted: (hook) => {
      onUnmountedHooks.push(hook)
    },
    pickRandomTipCaption: () => 'Tip',
    randomTipCaption,
    refreshLastOpenedAfterMru,
    watch: (_source, effect) => {
      watchEffects.push(effect as () => void)
    }
  })

  onMountedHooks.forEach((hook) => hook())
  expect(randomTipCaption.value).toBe('Tip')
  expect(loadOverviewData).toHaveBeenCalledTimes(1)

  const [censusWatchEffect, lastOpenedWatchEffect] = watchEffects
  projectId = 'project-b'
  censusWatchEffect?.()
  expect(loadOverviewData).toHaveBeenCalledTimes(2)

  censusGeneration = 1
  censusWatchEffect?.()
  expect(loadOverviewData).toHaveBeenCalledTimes(3)
  expect(refreshLastOpenedAfterMru).not.toHaveBeenCalled()

  lastOpenedGeneration = 1
  lastOpenedWatchEffect?.()
  expect(refreshLastOpenedAfterMru).toHaveBeenCalledTimes(1)
  expect(loadOverviewData).toHaveBeenCalledTimes(3)

  onUnmountedHooks.forEach((hook) => hook())
  expect(clearChartSettleTimer).toHaveBeenCalledTimes(1)
})
