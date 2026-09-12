import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { expect, test, vi } from 'vitest'

import type { I_faProjectMediaMassEditRow } from 'app/types/I_faProjectMediaDomain'

import DialogProjectMediaMassEditList from '../DialogProjectMediaMassEditList.vue'

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
  externalEmbed: '',
  internalLink: '',
  internalEmbed: null,
  createdAtMs: 0,
  updatedAtMs: 0,
  isNew: true
}

const listGlobal = {
  mocks: { $t: (k: string) => k },
  stubs: {
    FaSelectInput: {
      name: 'FaSelectInput',
      props: ['modelValue', 'disable', 'testLocator', 'options', 'label'],
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
    QSeparator: {
      template: '<hr role="separator" v-bind="$attrs">'
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
        },
        label: {
          default: '',
          type: String
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
    }
  }
} as const

function lastEmittedRows (wrapper: VueWrapper): I_faProjectMediaMassEditRow[] {
  const emitted = wrapper.emitted('update:modelValue')
  const last = emitted?.[emitted.length - 1]?.[0] as I_faProjectMediaMassEditRow[] | undefined
  if (last === undefined) {
    throw new Error('expected update:modelValue')
  }
  return last
}

/**
 * DialogProjectMediaMassEditList
 * Renders a block per row and still patches title and type.
 */
test('Test that DialogProjectMediaMassEditList renders blocks and patches type', async () => {
  const w = mount(DialogProjectMediaMassEditList, {
    global: listGlobal,
    props: {
      modelValue: [{ ...sampleRow }]
    }
  })

  expect(w.find('[data-test-locator="dialogProjectMedia-massEditList"]').exists()).toBe(true)
  expect(w.find('[data-test-locator="dialogProjectMedia-massEdit-itemDivider"]').exists()).toBe(false)
  expect(w.find('[data-test-locator="dialogProjectMedia-massEdit-block-row-1"]').exists()).toBe(true)
  const titleInput = w.get('[data-test-locator="dialogProjectMedia-massEdit-title-row-1"]')
  await titleInput.setValue('renamed')
  expect(lastEmittedRows(w)[0]?.displayName).toBe('renamed')

  const externalLinkInput = w.get('[data-test-locator="dialogProjectMedia-massEdit-externalLink-row-1"]')
  await externalLinkInput.setValue('https://cdn.example.com/foo/bar2.png')
  expect(lastEmittedRows(w)[0]?.externalLink).toBe(
    'https://cdn.example.com/foo/bar2.png'
  )

  await w.get('[data-test-locator="dialogProjectMedia-massEdit-type-row-1"]').trigger('click')
  expect(lastEmittedRows(w)[0]?.type).toBe('internal')
  w.unmount()
})

/**
 * DialogProjectMediaMassEditList
 * Sibling field disablement still follows Type and Internal Type.
 */
test('Test that DialogProjectMediaMassEditList disables sibling fields by type', async () => {
  const internalRow: I_faProjectMediaMassEditRow = {
    ...sampleRow,
    id: 'row-2',
    type: 'internal',
    internalType: '',
    externalType: '',
    externalLink: '',
    internalLink: 'doc-1'
  }
  const w = mount(DialogProjectMediaMassEditList, {
    global: listGlobal,
    props: {
      modelValue: [{ ...sampleRow }, internalRow]
    }
  })

  expect(w.findAll('[data-test-locator="dialogProjectMedia-massEdit-itemDivider"]')).toHaveLength(1)
  expect(
    w.find('[data-test-locator="dialogProjectMedia-massEdit-internalType-row-1"]').exists()
  ).toBe(false)
  expect(
    w.get('[data-test-locator="dialogProjectMedia-massEdit-externalType-row-1"]').attributes(
      'data-disabled'
    )
  ).toBe('false')
  expect(
    w.get('[data-test-locator="dialogProjectMedia-massEdit-internalType-row-2"]').attributes(
      'data-disabled'
    )
  ).toBe('false')
  expect(
    w.find('[data-test-locator="dialogProjectMedia-massEdit-externalType-row-2"]').exists()
  ).toBe(false)
  expect(
    w.get('[data-test-locator="dialogProjectMedia-massEdit-internalLink-row-2"]').attributes('disabled')
  ).toBeDefined()

  await w.get('[data-test-locator="dialogProjectMedia-massEdit-type-row-1"]').trigger('click')
  const updated = lastEmittedRows(w)
  expect(updated[0]?.type).toBe('internal')
  expect(updated[1]?.type).toBe('internal')
  expect(updated[1]?.id).toBe('row-2')
  w.unmount()
})

/**
 * DialogProjectMediaMassEditList
 * Empty list still renders the list host.
 */
test('Test that DialogProjectMediaMassEditList renders the list with no rows', () => {
  const w = mount(DialogProjectMediaMassEditList, {
    global: listGlobal,
    props: {
      modelValue: []
    }
  })

  expect(w.find('[data-test-locator="dialogProjectMedia-massEditList"]').exists()).toBe(true)
  expect(w.find('[data-test-locator="dialogProjectMedia-massEdit-itemDivider"]').exists()).toBe(false)
  w.unmount()
})
