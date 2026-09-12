import type { Meta, StoryObj } from '@storybook/vue3-vite'

import type { I_faProjectMediaMassEditRow } from 'app/types/I_faProjectMediaDomain'
import type { I_faSelectInputObjectItem } from 'app/types/I_faSelectInput'

import DialogProjectMediaMassEditBlockFields from '../DialogProjectMediaMassEditBlockFields.vue'

const typeOptions: I_faSelectInputObjectItem[] = [
  {
    id: 'internal',
    name: 'Internal'
  },
  {
    id: 'external',
    name: 'External'
  }
]

const internalTypeOptions: I_faSelectInputObjectItem[] = [
  {
    id: 'embedded',
    name: 'Embedded'
  },
  {
    id: 'linked_outside',
    name: 'Linked outside project'
  },
  {
    id: 'linked_in_project',
    name: 'Linked in project'
  }
]

const externalTypeOptions: I_faSelectInputObjectItem[] = [
  {
    id: 'linked',
    name: 'Linked'
  },
  {
    id: 'embed',
    icon: 'fa-solid fa-file-code',
    name: 'Embed'
  }
]

const externalRow: I_faProjectMediaMassEditRow = {
  id: '550e8400-e29b-41d4-a716-446655440001',
  displayName: 'bar',
  type: 'external',
  internalType: 'linked_outside',
  externalType: 'linked',
  externalLink: 'https://cdn.example.com/foo/bar.png',
  internalLink: '',
  internalEmbed: null,
  externalEmbed: '',
  createdAtMs: 0,
  updatedAtMs: 0,
  isNew: true
}

const meta = {
  component: DialogProjectMediaMassEditBlockFields,
  parameters: {
    docs: {
      description: {
        component:
          'Project Media mass-edit fields: Title, Type plus Internal or External type, then Internal link, External link, or External embed body when Embed is selected.'
      }
    },
    layout: 'padded'
  },
  tags: ['autodocs', 'skip-visual'],
  title: 'Components/dialogs/DialogProjectMediaMassEditBlockFields'
} satisfies Meta<typeof DialogProjectMediaMassEditBlockFields>

export default meta

export const ExternalLinked: StoryObj<typeof meta> = {
  args: {
    externalTypeOptions,
    internalTypeOptions,
    row: { ...externalRow },
    typeOptions
  }
}

export const ExternalEmbed: StoryObj<typeof meta> = {
  args: {
    externalTypeOptions,
    internalTypeOptions,
    row: {
      ...externalRow,
      externalType: 'embed',
      externalEmbed: '<iframe src="https://www.youtube.com/embed/x"></iframe>'
    },
    typeOptions
  }
}
