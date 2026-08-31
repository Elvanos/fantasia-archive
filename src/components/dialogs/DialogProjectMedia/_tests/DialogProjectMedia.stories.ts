import type { Meta, StoryObj } from '@storybook/vue3-vite'

import DialogProjectMedia from '../DialogProjectMedia.vue'

const meta = {
  component: DialogProjectMedia,
  parameters: {
    docs: {
      description: {
        component:
          'Project Media dialog: sticky shell, Close, and four slide panels. Search media... lives on Media List only. Media Addition is a dashed drop zone with Add offline media / Add online media; Add online media swaps in a URL textarea and Submit media list on the same slide. Submit appends session rows on Mass Medium Edit. Opens via directInput in Storybook; initialPanel selects the slide.'
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
    directInput: 'ProjectMedia',
    initialPanel: 'mediaMassEdit'
  }
}

export const MediaAddition: StoryObj<typeof meta> = {
  args: {
    directInput: 'ProjectMedia',
    initialPanel: 'mediaAdd'
  }
}

export const SingleMediumEdit: StoryObj<typeof meta> = {
  args: {
    directInput: 'ProjectMedia',
    initialPanel: 'mediaSingleEdit'
  }
}

export const MassMediumEdit: StoryObj<typeof meta> = {
  args: {
    directInput: 'ProjectMedia',
    initialPanel: 'mediaMassEdit'
  }
}
