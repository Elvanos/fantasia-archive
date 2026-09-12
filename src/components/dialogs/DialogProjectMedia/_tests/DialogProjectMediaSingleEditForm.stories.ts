import type { Meta, StoryObj } from '@storybook/vue3-vite'

import type { I_faProjectMediaMassEditRow } from 'app/types/I_faProjectMediaDomain'

import DialogProjectMediaSingleEditForm from '../DialogProjectMediaSingleEditForm.vue'

const sampleRow: I_faProjectMediaMassEditRow = {
  createdAtMs: 0,
  displayName: 'bar',
  externalEmbed: '',
  externalLink: 'https://cdn.example.com/foo/bar.png',
  externalType: 'linked',
  id: '550e8400-e29b-41d4-a716-446655440001',
  internalEmbed: null,
  internalLink: '',
  internalType: 'linked_outside',
  isNew: false,
  type: 'external',
  updatedAtMs: 0
}

const meta = {
  component: DialogProjectMediaSingleEditForm,
  parameters: {
    docs: {
      description: {
        component:
          'Project Media single-medium form: stacked Title / Type / subtype / link fields plus a full-width 300px preview (contain image, playable video/audio, raw embed HTML).'
      }
    },
    layout: 'padded'
  },
  tags: ['autodocs', 'skip-visual'],
  title: 'Components/dialogs/DialogProjectMediaSingleEditForm'
} satisfies Meta<typeof DialogProjectMediaSingleEditForm>

export default meta

export const ExternalLinked: StoryObj<typeof meta> = {
  args: {
    row: sampleRow
  }
}
