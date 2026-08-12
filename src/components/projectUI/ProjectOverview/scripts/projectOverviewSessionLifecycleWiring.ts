import type { I_createUseProjectOverviewDeps } from 'app/types/I_faProjectOverview'
import type { I_ref } from 'app/types/I_vueCompositionShims'

/**
 * Registers Project overview tip pick + data load on mount, clears chart timer on
 * unmount, reloads on project/census change, and refreshes Last opened on MRU bump.
 */
export function attachProjectOverviewSessionLifecycle (input: {
  clearChartSettleTimer: () => void
  getActiveProjectId: () => string | null
  getDocumentCensusRefreshGeneration: () => number
  getDocumentLastOpenedRefreshGeneration: () => number
  loadOverviewData: () => Promise<void>
  onMounted: (hook: () => void) => void
  onUnmounted: (hook: () => void) => void
  pickRandomTipCaption: () => string
  randomTipCaption: I_ref<string>
  refreshLastOpenedAfterMru: () => Promise<void>
  watch: I_createUseProjectOverviewDeps['watch']
}): void {
  input.onMounted(() => {
    input.randomTipCaption.value = input.pickRandomTipCaption()
    void input.loadOverviewData()
  })
  input.onUnmounted(() => {
    input.clearChartSettleTimer()
  })
  input.watch(
    () => [
      input.getActiveProjectId(),
      input.getDocumentCensusRefreshGeneration()
    ] as const,
    () => {
      void input.loadOverviewData()
    }
  )
  input.watch(
    () => input.getDocumentLastOpenedRefreshGeneration(),
    () => {
      void input.refreshLastOpenedAfterMru()
    }
  )
}
