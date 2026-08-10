import type { Decorator, Meta, StoryObj } from '@storybook/vue3-vite'

import ProjectOverview from '../ProjectOverview.vue'
import {
  buildProjectOverviewStoryContentBridgeOverrides,
  withProjectOverviewStoryEmptyAssignTemplate,
  withProjectOverviewStoryEmptyCreateDocument,
  withProjectOverviewStoryEmptyCreateTemplate,
  withProjectOverviewStoryPopulatedTipVisible,
  withProjectOverviewStoryPopulatedTipsHidden
} from './projectOverviewStoryDecorators'
import {
  projectOverviewStoryEmptyDistribution,
  projectOverviewStoryLastOpenedItems,
  projectOverviewStoryStackedDistribution,
  projectOverviewStoryTemplatesOnlyDistribution
} from './projectOverviewStoryFixtures'

const projectOverviewCanvasDecorator: Decorator = (story) => {
  return {
    components: {
      story
    },
    template: `
      <div class="bg-dark flex flex-center" style="min-height: 900px; padding: 24px; width: 100%;">
        <story />
      </div>
    `
  }
}

const meta = {
  title: 'Components/projectUI/ProjectOverview',
  component: ProjectOverview,
  tags: ['autodocs'],
  decorators: [projectOverviewCanvasDecorator],
  parameters: {
    docs: {
      description: {
        component:
          'Workspace home block on /home: project name, optional Did you know tip card, stacked document-distribution chart, last-opened list, and empty-project CTAs.'
      }
    }
  }
} satisfies Meta<typeof ProjectOverview>

export default meta

/** Zero documents and zero templates — welcome empty CTA (create template). */
export const Default: StoryObj<typeof meta> = {
  decorators: [withProjectOverviewStoryEmptyCreateTemplate],
  parameters: {
    contentBridgeOverrides: buildProjectOverviewStoryContentBridgeOverrides({
      distribution: projectOverviewStoryEmptyDistribution,
      lastOpenedItems: []
    })
  }
}

/** Templates exist without world placements — assign-template empty CTA. */
export const EmptyCtaAssignTemplate: StoryObj<typeof meta> = {
  name: 'States/EmptyCtaAssignTemplate',
  decorators: [withProjectOverviewStoryEmptyAssignTemplate],
  parameters: {
    contentBridgeOverrides: buildProjectOverviewStoryContentBridgeOverrides({
      distribution: projectOverviewStoryTemplatesOnlyDistribution,
      lastOpenedItems: []
    })
  }
}

/** Placed template with zero documents — create-first-document empty CTA. */
export const EmptyCtaCreateDocument: StoryObj<typeof meta> = {
  name: 'States/EmptyCtaCreateDocument',
  decorators: [withProjectOverviewStoryEmptyCreateDocument],
  parameters: {
    contentBridgeOverrides: buildProjectOverviewStoryContentBridgeOverrides({
      distribution: projectOverviewStoryTemplatesOnlyDistribution,
      lastOpenedItems: []
    })
  }
}

/**
 * Docs > 0 with tips on: tip card, stacked chart + legend, last opened
 * (dead / category / plain / multi-world indicators). Math.random fixed for VRT.
 */
export const PopulatedWithTipCard: StoryObj<typeof meta> = {
  name: 'States/PopulatedWithTipCard',
  decorators: [withProjectOverviewStoryPopulatedTipVisible],
  parameters: {
    contentBridgeOverrides: buildProjectOverviewStoryContentBridgeOverrides({
      distribution: projectOverviewStoryStackedDistribution,
      lastOpenedItems: projectOverviewStoryLastOpenedItems
    })
  }
}

/**
 * Same populated chart + last opened with Hide tips on project overview.
 */
export const TipsCardHidden: StoryObj<typeof meta> = {
  name: 'States/TipsCardHidden',
  decorators: [withProjectOverviewStoryPopulatedTipsHidden],
  parameters: {
    contentBridgeOverrides: buildProjectOverviewStoryContentBridgeOverrides({
      distribution: projectOverviewStoryStackedDistribution,
      lastOpenedItems: projectOverviewStoryLastOpenedItems
    })
  }
}
