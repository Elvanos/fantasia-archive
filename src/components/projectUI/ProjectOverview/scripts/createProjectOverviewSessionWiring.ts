import type {
  I_createUseProjectOverviewDeps,
  I_useProjectOverviewApi
} from 'app/types/I_faProjectOverview'

import { createProjectOverviewSessionRefs } from './createProjectOverviewSessionRefsWiring'
import { attachProjectOverviewSessionLifecycle } from './projectOverviewSessionLifecycleWiring'
import {
  attachProjectOverviewInitialEmptyPromptChrome,
  setProjectOverviewInitialEmptyPromptActive
} from './projectOverviewInitialEmptyPromptChromeWiring'
import { wireProjectOverviewSessionBehaviors } from './wireProjectOverviewSessionBehaviorsWiring'

/**
 * One Project overview composable session (refs, loaders, handlers).
 */
export function createProjectOverviewSession (
  deps: I_createUseProjectOverviewDeps
): I_useProjectOverviewApi {
  const sessionRefs = createProjectOverviewSessionRefs(deps.ref)
  const chartLoading = sessionRefs.chartLoading
  const chartOptions = sessionRefs.chartOptions
  const chartSeries = sessionRefs.chartSeries
  const graphCardWidthPx = sessionRefs.graphCardWidthPx
  const hasDocumentTemplates = sessionRefs.hasDocumentTemplates
  const lastOpenedItems = sessionRefs.lastOpenedItems
  const randomTipCaption = sessionRefs.randomTipCaption
  const totalDocumentCount = sessionRefs.totalDocumentCount

  const { activeProject } = deps.storeToRefs(deps.S_FaActiveProject())!
  const { appSettingsDialogPreview, settings } = deps.storeToRefs(deps.S_FaUserSettings())!
  const { worlds } = deps.storeToRefs(deps.S_FaProjectHierarchyTree())!

  const projectDisplayName = deps.computed(() => {
    const name = activeProject!.value?.name?.trim()
    if (name) {
      return name
    }
    return deps.t('projectUI.projectOverview.noActiveProjectName')
  })

  const behaviors = wireProjectOverviewSessionBehaviors({
    appSettingsDialogPreview: appSettingsDialogPreview!,
    chartLoading,
    chartOptions,
    chartSeries,
    deps,
    graphCardWidthPx,
    hasDocumentTemplates,
    lastOpenedItems,
    settings: settings!,
    totalDocumentCount,
    worlds: worlds!
  })

  const {
    clearChartSettleTimer,
    loadOverviewData,
    refreshLastOpenedAfterMru,
    ...publicBehaviors
  } = behaviors

  attachProjectOverviewSessionLifecycle({
    clearChartSettleTimer,
    getActiveProjectId: () => {
      const project = activeProject!.value as { id?: string } | null | undefined
      return project?.id ?? null
    },
    getDocumentCensusRefreshGeneration: () => {
      const hierarchyStore = deps.S_FaProjectHierarchyTree() as {
        documentCensusRefreshGeneration?: number
      }
      return hierarchyStore.documentCensusRefreshGeneration ?? 0
    },
    getDocumentLastOpenedRefreshGeneration: () => {
      const hierarchyStore = deps.S_FaProjectHierarchyTree() as {
        documentLastOpenedRefreshGeneration?: number
      }
      return hierarchyStore.documentLastOpenedRefreshGeneration ?? 0
    },
    loadOverviewData,
    onMounted: deps.onMounted,
    onUnmounted: deps.onUnmounted,
    pickRandomTipCaption: deps.pickRandomTipCaption,
    randomTipCaption,
    refreshLastOpenedAfterMru,
    watch: deps.watch
  })

  attachProjectOverviewInitialEmptyPromptChrome({
    onUnmounted: deps.onUnmounted,
    setActive: setProjectOverviewInitialEmptyPromptActive,
    showEmptyCta: publicBehaviors.showEmptyCta,
    watch: deps.watch
  })

  return {
    ...publicBehaviors,
    chartLoading,
    chartOptions,
    chartSeries,
    graphCardWidthPx,
    hasDocumentTemplates,
    lastOpenedItems,
    projectDisplayName,
    randomTipCaption,
    totalDocumentCount
  }
}
