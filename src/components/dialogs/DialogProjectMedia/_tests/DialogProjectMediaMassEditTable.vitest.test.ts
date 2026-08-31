import { mount } from '@vue/test-utils'
import { expect, test, vi } from 'vitest'

import type { I_faProjectMediaMassEditRow } from 'app/types/I_faProjectMediaDomain'

import DialogProjectMediaMassEditTable from '../DialogProjectMediaMassEditTable.vue'

vi.mock('vue-i18n', () => {
  return {
    useI18n: () => {
      return {
        t: (key: string) => key
      }
    }
  }
})

const sampleRow: I_faProjectMediaMassEditRow = {
  id: 'row-1',
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

const tableGlobal = {
  mocks: { $t: (k: string) => k },
  stubs: {
    FaSelectInput: {
      name: 'FaSelectInput',
      props: ['modelValue', 'disable', 'testLocator', 'options'],
      emits: ['update:modelValue'],
      template: `
        <button
          type="button"
          v-bind="$attrs"
          :data-test-locator="testLocator"
          :data-disabled="String(disable)"
          @click="$emit('update:modelValue', options[0])"
        ></button>
      `
    },
    QBtn: {
      props: {
        label: {
          default: '',
          type: String
        }
      },
      template: '<button type="button" v-bind="$attrs">{{ label }}</button>'
    },
    QInput: {
      props: {
        modelValue: {
          default: '',
          type: String
        },
        disable: {
          default: false,
          type: Boolean
        }
      },
      emits: ['update:modelValue'],
      template: `
        <input
          v-bind="$attrs"
          :disabled="disable"
          :value="modelValue"
          @input="$emit('update:modelValue', ($event.target).value)"
        />
      `
    },
    QTable: {
      props: ['rows'],
      template: `
        <div v-bind="$attrs">
          <div v-for="row in rows" :key="row.id">
            <slot name="body" :row="row" />
          </div>
        </div>
      `
    },
    QTd: { template: '<div><slot /></div>' },
    QTr: { template: '<div><slot /></div>' }
  }
} as const

test('Test that DialogProjectMediaMassEditTable renders rows save and patches type', async () => {
  const w = mount(DialogProjectMediaMassEditTable, {
    global: tableGlobal,
    props: {
      modelValue: [{ ...sampleRow }]
    }
  })

  expect(w.find('[data-test-locator="dialogProjectMedia-massEditTable"]').exists()).toBe(true)
  expect(w.find('[data-test-locator="dialogProjectMedia-massEditSave"]').exists()).toBe(true)
  expect(w.text()).toContain('dialogs.projectMedia.massEditSaveButton')
  const titleInput = w.get('[data-test-locator="dialogProjectMedia-massEdit-title-row-1"]')
  await titleInput.setValue('renamed')
  expect((w.props('modelValue') as I_faProjectMediaMassEditRow[])[0]?.displayName).toBe('renamed')

  const externalLinkInput = w.get('[data-test-locator="dialogProjectMedia-massEdit-externalLink-row-1"]')
  await externalLinkInput.setValue('https://cdn.example.com/foo/bar2.png')
  expect((w.props('modelValue') as I_faProjectMediaMassEditRow[])[0]?.externalLink).toBe(
    'https://cdn.example.com/foo/bar2.png'
  )

  await w.get('[data-test-locator="dialogProjectMedia-massEdit-type-row-1"]').trigger('click')
  expect((w.props('modelValue') as I_faProjectMediaMassEditRow[])[0]?.type).toBe('internal')

  const internalLinkInput = w.get('[data-test-locator="dialogProjectMedia-massEdit-internalLink-row-1"]')
  await internalLinkInput.setValue('doc-2')
  expect((w.props('modelValue') as I_faProjectMediaMassEditRow[])[0]?.internalLink).toBe('doc-2')

  await w.get('[data-test-locator="dialogProjectMedia-massEdit-internalType-row-1"]').trigger('click')
  expect((w.props('modelValue') as I_faProjectMediaMassEditRow[])[0]?.internalType).toBe('embedded')

  await w.get('[data-test-locator="dialogProjectMedia-massEdit-externalType-row-1"]').trigger('click')
  expect((w.props('modelValue') as I_faProjectMediaMassEditRow[])[0]?.externalType).toBe('linked')

  const typeSelect = w.findAllComponents({ name: 'FaSelectInput' })[0]
  await typeSelect?.vm.$emit('update:modelValue', null)
  expect((w.props('modelValue') as I_faProjectMediaMassEditRow[])[0]?.type).toBe('internal')
  w.unmount()
})

test('Test that DialogProjectMediaMassEditTable disables sibling fields by type', () => {
  const internalRow: I_faProjectMediaMassEditRow = {
    ...sampleRow,
    id: 'row-2',
    type: 'internal',
    internalType: '',
    externalType: '',
    externalLink: '',
    internalLink: 'doc-1'
  }
  const w = mount(DialogProjectMediaMassEditTable, {
    global: tableGlobal,
    props: {
      modelValue: [{ ...sampleRow }, internalRow]
    }
  })

  expect(
    w.get('[data-test-locator="dialogProjectMedia-massEdit-internalType-row-1"]').attributes('data-disabled')
  ).toBe('true')
  expect(
    w.get('[data-test-locator="dialogProjectMedia-massEdit-externalType-row-1"]').attributes('data-disabled')
  ).toBe('false')
  expect(
    w.get('[data-test-locator="dialogProjectMedia-massEdit-internalLink-row-1"]').attributes('disabled')
  ).toBeDefined()
  expect(
    w.get('[data-test-locator="dialogProjectMedia-massEdit-internalType-row-2"]').attributes('data-disabled')
  ).toBe('false')
  expect(
    w.get('[data-test-locator="dialogProjectMedia-massEdit-externalType-row-2"]').attributes('data-disabled')
  ).toBe('true')
  w.unmount()
})
