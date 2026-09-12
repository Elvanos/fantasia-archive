import type { Meta, StoryObj } from '@storybook/vue3-vite'

import type { I_faProjectMedia } from 'app/types/I_faProjectMediaDomain'

import DialogProjectMediaListGrid from '../DialogProjectMediaListGrid.vue'

const imageItem: I_faProjectMedia = {
  createdAtMs: 0,
  displayName: 'bar',
  externalEmbed: '',
  externalLink: 'https://cdn.example.com/foo/bar.png',
  externalType: 'linked',
  id: '550e8400-e29b-41d4-a716-446655440001',
  internalEmbed: null,
  internalLink: '',
  internalType: 'linked_outside',
  type: 'external',
  updatedAtMs: 0
}

const meta = {
  component: DialogProjectMediaListGrid,
  parameters: {
    docs: {
      description: {
        component:
          'Project Media list thumbnail grid: 150px squares using the same preview well, type icons, and missing-file warning as mass-edit thumbs, plus a filename overlay. Left-click a thumb to open the 700px right single-edit slide-out.'
      }
    },
    layout: 'padded'
  },
  tags: ['autodocs', 'skip-visual'],
  title: 'Components/dialogs/DialogProjectMediaListGrid'
} satisfies Meta<typeof DialogProjectMediaListGrid>

export default meta

export const Empty: StoryObj<typeof meta> = {
  args: {
    items: []
  }
}

export const ImageAndMissing: StoryObj<typeof meta> = {
  args: {
    items: [
      imageItem,
      {
        ...imageItem,
        displayName: 'missing',
        externalLink: '',
        id: '550e8400-e29b-41d4-a716-446655440002'
      },
      {
        ...imageItem,
        displayName: '',
        externalLink: 'https://cdn.example.com/unnamed.png',
        id: '550e8400-e29b-41d4-a716-446655440003'
      }
    ]
  }
}
