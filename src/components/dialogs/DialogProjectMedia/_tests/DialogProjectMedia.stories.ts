import type { Meta, StoryObj } from '@storybook/vue3-vite'

import DialogProjectMedia from '../DialogProjectMedia.vue'

const meta = {
  component: DialogProjectMedia,
  parameters: {
    docs: {
      description: {
        component:
          'Project Media dialog shell: title, non-filtering search field, and Close. Opens via directInput in Storybook.'
      },
      story: {
        iframeHeight: '760px',
        inline: false
      }
    }
  },
  tags: ['autodocs'],
  title: 'Components/dialogs/DialogProjectMedia'
} satisfies Meta<typeof DialogProjectMedia>

export default meta

export const Default: StoryObj<typeof meta> = {
  args: {
    directInput: 'ProjectMedia'
  }
}
