import type { Meta, StoryObj } from '@storybook/vue3-vite'

import DialogQuickAddDocument from '../DialogQuickAddDocument.vue'

const meta = {
  title: 'Components/dialogs/DialogQuickAddDocument',
  component: DialogQuickAddDocument,
  tags: ['autodocs'],
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: '520px'
      },
      description: {
        component:
          'Quick-add a temporary document: pick world then template. Storybook opens via directInput; create needs a project content bridge with worlds and templates.'
      }
    }
  }
} satisfies Meta<typeof DialogQuickAddDocument>

export default meta

export const Default: StoryObj<typeof meta> = {
  args: {
    directInput: 'QuickAddDocument'
  }
}
