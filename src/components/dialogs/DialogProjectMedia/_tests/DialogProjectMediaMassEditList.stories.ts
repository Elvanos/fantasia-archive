import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

import type { I_faProjectMediaMassEditRow } from 'app/types/I_faProjectMediaDomain'

import DialogProjectMediaMassEditList from '../DialogProjectMediaMassEditList.vue'

const sampleRows: I_faProjectMediaMassEditRow[] = [
  {
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
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    displayName: 'baz',
    type: 'external',
    internalType: 'linked_outside',
    externalType: 'linked',
    externalLink: 'https://cdn.example.com/foo/baz.png',
    internalLink: '',
    internalEmbed: null,
    externalEmbed: '',
    createdAtMs: 0,
    updatedAtMs: 0,
    isNew: true
  }
]

const meta = {
  component: DialogProjectMediaMassEditList,
  parameters: {
    docs: {
      description: {
        component:
          'Project Media mass-edit list: one row per session item (intake, not loaded from the project file), with a themed divider between items.'
      }
    },
    layout: 'padded'
  },
  tags: ['autodocs', 'skip-visual'],
  title: 'Components/dialogs/DialogProjectMediaMassEditList'
} satisfies Meta<typeof DialogProjectMediaMassEditList>

export default meta

export const Empty: StoryObj<typeof meta> = {
  render: () => ({
    components: { DialogProjectMediaMassEditList },
    setup () {
      const rows = ref<I_faProjectMediaMassEditRow[]>([])
      return { rows }
    },
    template: '<DialogProjectMediaMassEditList v-model="rows" />'
  })
}

export const WithIntakeRows: StoryObj<typeof meta> = {
  render: () => ({
    components: { DialogProjectMediaMassEditList },
    setup () {
      const rows = ref<I_faProjectMediaMassEditRow[]>(sampleRows.map((row) => {
        return { ...row }
      }))
      return { rows }
    },
    template: '<DialogProjectMediaMassEditList v-model="rows" />'
  })
}
