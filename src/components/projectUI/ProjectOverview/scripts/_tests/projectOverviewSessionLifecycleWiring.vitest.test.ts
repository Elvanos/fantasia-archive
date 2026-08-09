import { expect, test, vi } from 'vitest'
import { ref } from 'vue'

import { attachProjectOverviewSessionLifecycle } from '../projectOverviewSessionLifecycleWiring'

/**
 * attachProjectOverviewSessionLifecycle
 * Loads overview data on mount and again when project id or census generation changes.
 */
test('Test that attachProjectOverviewSessionLifecycle reloads on project and census changes', () => {
  const loadOverviewData = vi.fn(async () => undefined)
  const clearChartSettleTimer = vi.fn()
  const randomTipCaption = ref('')
  const onMountedHooks: Array<() => void> = []
  const onUnmountedHooks: Array<() => void> = []
  let projectId: string | null = 'project-a'
  let censusGeneration = 0
  let watchEffect: (() => void) | undefined

  attachProjectOverviewSessionLifecycle({
    clearChartSettleTimer,
    getActiveProjectId: () => projectId,
    getDocumentCensusRefreshGeneration: () => censusGeneration,
    loadOverviewData,
    onMounted: (hook) => {
      onMountedHooks.push(hook)
    },
    onUnmounted: (hook) => {
      onUnmountedHooks.push(hook)
    },
    pickRandomTipCaption: () => 'Tip',
    randomTipCaption,
    watch: (_source, effect) => {
      watchEffect = effect
    }
  })

  onMountedHooks.forEach((hook) => hook())
  expect(randomTipCaption.value).toBe('Tip')
  expect(loadOverviewData).toHaveBeenCalledTimes(1)

  projectId = 'project-b'
  watchEffect?.()
  expect(loadOverviewData).toHaveBeenCalledTimes(2)

  censusGeneration = 1
  watchEffect?.()
  expect(loadOverviewData).toHaveBeenCalledTimes(3)

  onUnmountedHooks.forEach((hook) => hook())
  expect(clearChartSettleTimer).toHaveBeenCalledTimes(1)
})
