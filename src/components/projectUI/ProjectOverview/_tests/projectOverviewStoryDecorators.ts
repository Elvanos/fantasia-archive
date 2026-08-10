import type { Decorator } from '@storybook/vue3-vite'

import { seedStorybookWorkspaceHomePreviewStores } from '../../../../../.storybook-workspace/.storybook/decorators/withStorybookWorkspaceHomePreview'
import { S_FaProjectHierarchyTree } from 'app/src/stores/S_FaProjectHierarchyTree'
import type {
  I_faProjectDocumentDistributionResult,
  I_faProjectDocumentLastOpenedItem
} from 'app/types/I_faProjectDocumentLastOpenedDomain'
import type { I_faProjectHierarchyTreeWorkspaceWorld } from 'app/types/I_faProjectHierarchyTreeDomain'

import {
  projectOverviewStoryEmptyDistribution,
  projectOverviewStoryLastOpenedItems,
  projectOverviewStoryStackedDistribution,
  projectOverviewStoryTemplatesOnlyDistribution,
  projectOverviewStoryTwoWorldsWithPlacements,
  projectOverviewStoryWorldNoPlacements,
  projectOverviewStoryWorldWithPlacement
} from './projectOverviewStoryFixtures'

type T_projectOverviewStorySeed = {
  distribution: I_faProjectDocumentDistributionResult
  hideTooltipsProject: boolean
  lastOpenedItems: I_faProjectDocumentLastOpenedItem[]
  stabilizeTipAndMascotRandom: boolean
  worlds: I_faProjectHierarchyTreeWorkspaceWorld[]
}

/**
 * Storybook parameters.contentBridgeOverrides.projectContent partial for overview IPC.
 */
export function buildProjectOverviewStoryContentBridgeOverrides (input: {
  distribution: I_faProjectDocumentDistributionResult
  lastOpenedItems: I_faProjectDocumentLastOpenedItem[]
}): {
    projectContent: {
      listDocumentDistribution: () => Promise<I_faProjectDocumentDistributionResult>
      listDocumentLastOpened: () => Promise<{ items: I_faProjectDocumentLastOpenedItem[] }>
    }
  } {
  return {
    projectContent: {
      listDocumentDistribution: async () => input.distribution,
      listDocumentLastOpened: async () => ({ items: input.lastOpenedItems })
    }
  }
}

function seedProjectOverviewStorySession (input: T_projectOverviewStorySeed): void {
  if (input.stabilizeTipAndMascotRandom) {
    Math.random = () => 0
  }

  seedStorybookWorkspaceHomePreviewStores(input.hideTooltipsProject)

  S_FaProjectHierarchyTree().replaceSessionForComponentTesting({
    worlds: input.worlds
  })
}

function createProjectOverviewStoryDecorator (input: T_projectOverviewStorySeed): Decorator {
  return (story) => {
    seedProjectOverviewStorySession(input)
    return story()
  }
}

/** Default empty CTA: createTemplate (zero templates, zero docs). */
export const withProjectOverviewStoryEmptyCreateTemplate = createProjectOverviewStoryDecorator({
  distribution: projectOverviewStoryEmptyDistribution,
  hideTooltipsProject: false,
  lastOpenedItems: [],
  stabilizeTipAndMascotRandom: false,
  worlds: []
})

/** Empty CTA: assignTemplate (templates exist, no placements). */
export const withProjectOverviewStoryEmptyAssignTemplate = createProjectOverviewStoryDecorator({
  distribution: projectOverviewStoryTemplatesOnlyDistribution,
  hideTooltipsProject: true,
  lastOpenedItems: [],
  stabilizeTipAndMascotRandom: false,
  worlds: [projectOverviewStoryWorldNoPlacements]
})

/** Empty CTA: createDocument (templates + placement, zero docs). */
export const withProjectOverviewStoryEmptyCreateDocument = createProjectOverviewStoryDecorator({
  distribution: projectOverviewStoryTemplatesOnlyDistribution,
  hideTooltipsProject: true,
  lastOpenedItems: [],
  stabilizeTipAndMascotRandom: false,
  worlds: [projectOverviewStoryWorldWithPlacement]
})

/**
 * Populated overview: stacked chart, last opened variants, tip card (Math.random fixed).
 */
export const withProjectOverviewStoryPopulatedTipVisible = createProjectOverviewStoryDecorator({
  distribution: projectOverviewStoryStackedDistribution,
  hideTooltipsProject: false,
  lastOpenedItems: projectOverviewStoryLastOpenedItems,
  stabilizeTipAndMascotRandom: true,
  worlds: projectOverviewStoryTwoWorldsWithPlacements
})

/**
 * Same populated data with Hide tips on project overview — taller chart, no tip card.
 */
export const withProjectOverviewStoryPopulatedTipsHidden = createProjectOverviewStoryDecorator({
  distribution: projectOverviewStoryStackedDistribution,
  hideTooltipsProject: true,
  lastOpenedItems: projectOverviewStoryLastOpenedItems,
  stabilizeTipAndMascotRandom: false,
  worlds: projectOverviewStoryTwoWorldsWithPlacements
})
