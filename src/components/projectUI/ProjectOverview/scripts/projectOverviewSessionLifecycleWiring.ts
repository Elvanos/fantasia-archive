import type { I_ref } from 'app/types/I_vueCompositionShims'

/**
 * Registers Project overview tip pick + data load on mount, clears chart timer on
 * unmount, and reloads when the active project or document census generation changes.
 */
export function attachProjectOverviewSessionLifecycle (input: {
  clearChartSettleTimer: () => void
  getActiveProjectId: () => string | null
  getDocumentCensusRefreshGeneration: () => number
  loadOverviewData: () => Promise<void>
  onMounted: (hook: () => void) => void
  onUnmounted: (hook: () => void) => void
  pickRandomTipCaption: () => string
  randomTipCaption: I_ref<string>
  watch: (
    source: () => readonly [string | null, number],
    effect: () => void
  ) => void
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
}
