import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'

import type { I_faProjectMediaMassEditRow } from 'app/types/I_faProjectMediaDomain'
import type { I_faSelectInputObjectItem } from 'app/types/I_faSelectInput'

import DialogProjectMediaMassEditBlockFields from '../DialogProjectMediaMassEditBlockFields.vue'

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

const fieldsGlobal = {
  mocks: { $t: (k: string) => k },
  stubs: {
    FaSelectInput: {
      name: 'FaSelectInput',
      props: ['dense', 'testLocator', 'label'],
      template: '<button type="button" :data-test-locator="testLocator">{{ label }}</button>'
    },
    QInput: {
      name: 'QInput',
      props: {
        dense: {
          default: true,
          type: Boolean
        },
        modelValue: {
          default: '',
          type: String
        }
      },
      emits: ['update:modelValue'],
      template: '<input v-bind="$attrs" :value="modelValue" />'
    }
  }
} as const

function mountFields (row: I_faProjectMediaMassEditRow) {
  return mount(DialogProjectMediaMassEditBlockFields, {
    global: fieldsGlobal,
    props: {
      externalTypeOptions,
      internalTypeOptions,
      row,
      typeOptions
    }
  })
}

/**
 * DialogProjectMediaMassEditBlockFields
 * Linked external rows keep External link; Embed rows swap in the embed body.
 */
test('Test that DialogProjectMediaMassEditBlockFields swaps link for embed body', () => {
  const linked = mountFields({ ...sampleRow })
  expect(
    linked.find('[data-test-locator="dialogProjectMedia-massEdit-externalLink-row-1"]').exists()
  ).toBe(true)
  expect(
    linked.find('[data-test-locator="dialogProjectMedia-massEdit-externalEmbed-row-1"]').exists()
  ).toBe(false)
  linked.unmount()

  const embed = mountFields({
    ...sampleRow,
    externalType: 'embed',
    externalEmbed: '<iframe></iframe>'
  })
  expect(
    embed.find('[data-test-locator="dialogProjectMedia-massEdit-externalEmbed-row-1"]').exists()
  ).toBe(true)
  expect(
    embed.find('[data-test-locator="dialogProjectMedia-massEdit-externalLink-row-1"]').exists()
  ).toBe(false)
  embed.unmount()
})

/**
 * DialogProjectMediaMassEditBlockFields
 * locatorPrefix and stackTypeRow change locators and the type-row class.
 */
test('Test that DialogProjectMediaMassEditBlockFields honors locatorPrefix and stack', () => {
  const stacked = mount(DialogProjectMediaMassEditBlockFields, {
    global: fieldsGlobal,
    props: {
      externalTypeOptions,
      internalTypeOptions,
      locatorPrefix: 'dialogProjectMedia-singleEdit',
      row: { ...sampleRow },
      stackTypeRow: true,
      typeOptions
    }
  })
  expect(
    stacked.find('[data-test-locator="dialogProjectMedia-singleEdit-title-row-1"]').exists()
  ).toBe(true)
  expect(
    stacked.find('[data-test-locator="dialogProjectMedia-massEdit-title-row-1"]').exists()
  ).toBe(false)
  expect(stacked.find('.dialogProjectMediaMassEditBlockFields__typeRow--stack').exists()).toBe(
    true
  )
  stacked.unmount()
})

/**
 * DialogProjectMediaMassEditBlockFields
 * Dense is on by default and can be turned off.
 */
test('Test that DialogProjectMediaMassEditBlockFields dense defaults on and can be off', () => {
  const denseOn = mountFields({ ...sampleRow })
  expect(denseOn.getComponent({ name: 'QInput' }).props('dense')).toBe(true)
  expect(denseOn.getComponent({ name: 'FaSelectInput' }).props('dense')).toBe(true)
  denseOn.unmount()

  const denseOff = mount(DialogProjectMediaMassEditBlockFields, {
    global: fieldsGlobal,
    props: {
      dense: false,
      externalTypeOptions,
      internalTypeOptions,
      row: { ...sampleRow },
      typeOptions
    }
  })
  expect(denseOff.getComponent({ name: 'QInput' }).props('dense')).toBe(false)
  expect(denseOff.getComponent({ name: 'FaSelectInput' }).props('dense')).toBe(false)
  denseOff.unmount()
})
