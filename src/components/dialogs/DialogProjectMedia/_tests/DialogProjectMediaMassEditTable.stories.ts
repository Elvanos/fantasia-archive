import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

import type { I_faProjectMediaMassEditRow } from 'app/types/I_faProjectMediaDomain'

import DialogProjectMediaMassEditTable from '../DialogProjectMediaMassEditTable.vue'

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
    createdAtMs: 0,
    updatedAtMs: 0,
    isNew: true
  }
]

const meta = {
  component: DialogProjectMediaMassEditTable,
  parameters: {
    docs: {
      description: {
        component:
          'Project Media mass-edit table: session rows only (intake, not loaded from the project file). Save media changes is a placeholder.'
      }
    },
    layout: 'padded'
  },
  tags: ['autodocs', 'skip-visual'],
  title: 'Components/dialogs/DialogProjectMediaMassEditTable'
} satisfies Meta<typeof DialogProjectMediaMassEditTable>

export default meta

export const Empty: StoryObj<typeof meta> = {
  render: () => ({
    components: { DialogProjectMediaMassEditTable },
    setup () {
      const rows = ref<I_faProjectMediaMassEditRow[]>([])
      return { rows }
    },
    template: '<DialogProjectMediaMassEditTable v-model="rows" />'
  })
}

export const WithIntakeRows: StoryObj<typeof meta> = {
  render: () => ({
    components: { DialogProjectMediaMassEditTable },
    setup () {
      const rows = ref<I_faProjectMediaMassEditRow[]>(sampleRows.map((row) => {
        return { ...row }
      }))
      return { rows }
    },
    template: '<DialogProjectMediaMassEditTable v-model="rows" />'
  })
}
