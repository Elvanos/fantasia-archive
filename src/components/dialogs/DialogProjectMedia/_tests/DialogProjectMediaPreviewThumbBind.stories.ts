import type { Meta, StoryObj } from '@storybook/vue3-vite'

import type { I_faProjectMedia } from 'app/types/I_faProjectMediaDomain'

import DialogProjectMediaPreviewThumbBind from '../DialogProjectMediaPreviewThumbBind.vue'

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
  component: DialogProjectMediaPreviewThumbBind,
  parameters: {
    docs: {
      description: {
        component:
          'Binds a saved medium or mass-edit row to the Project Media preview thumb (image, type icon, player, embed HTML, or missing-file warning).'
      }
    },
    layout: 'padded'
  },
  tags: ['autodocs', 'skip-visual'],
  title: 'Components/dialogs/DialogProjectMediaPreviewThumbBind'
} satisfies Meta<typeof DialogProjectMediaPreviewThumbBind>

export default meta

export const MassEditImage: StoryObj<typeof meta> = {
  args: {
    item: imageItem
  }
}

export const ListCaption: StoryObj<typeof meta> = {
  args: {
    debounceMs: 0,
    item: imageItem,
    locatorPrefix: 'dialogProjectMedia-list-preview',
    thumbSize: 'list'
  }
}

export const ListMissing: StoryObj<typeof meta> = {
  args: {
    debounceMs: 0,
    item: {
      ...imageItem,
      externalLink: ''
    },
    locatorPrefix: 'dialogProjectMedia-list-preview',
    thumbSize: 'list'
  }
}

export const SingleEditEmbed: StoryObj<typeof meta> = {
  args: {
    debounceMs: 0,
    item: {
      ...imageItem,
      externalEmbed: '<iframe title="clip" width="560" height="315"></iframe>',
      externalLink: '',
      externalType: 'embed'
    },
    locatorPrefix: 'dialogProjectMedia-singleEdit-preview',
    thumbSize: 'singleEdit'
  }
}
