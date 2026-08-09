import type { Decorator, Meta, StoryObj } from '@storybook/vue3-vite'

import {
  withStorybookWorkspaceHomePreview,
  withStorybookWorkspaceHomePreviewTipsHidden
} from '../../../../../.storybook-workspace/.storybook/decorators/withStorybookWorkspaceHomePreview'

import ProjectOverview from '../ProjectOverview.vue'

const projectOverviewCanvasDecorator: Decorator = (story) => {
  return {
    components: {
      story
    },
    template: `
      <div class="bg-dark flex flex-center" style="min-height: 580px; padding: 24px; width: 100%;">
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

export const Default: StoryObj<typeof meta> = {
  decorators: [withStorybookWorkspaceHomePreview]
}

export const TipsCardHidden: StoryObj<typeof meta> = {
  name: 'States/TipsCardHidden',
  decorators: [withStorybookWorkspaceHomePreviewTipsHidden]
}
