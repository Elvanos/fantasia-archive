import { mount } from '@vue/test-utils'
import { expect, test, vi } from 'vitest'

import type { I_faProjectMediaMassEditRow } from 'app/types/I_faProjectMediaDomain'

import DialogProjectMediaSingleEditForm from '../DialogProjectMediaSingleEditForm.vue'

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
  createdAtMs: 0,
  displayName: 'bar',
  externalEmbed: '',
  externalLink: 'https://cdn.example.com/foo/bar.png',
  externalType: 'linked',
  id: 'row-1',
  internalEmbed: null,
  internalLink: '',
  internalType: 'linked_outside',
  isNew: false,
  type: 'external',
  updatedAtMs: 0
}

const formGlobal = {
  mocks: { $t: (k: string) => k },
  stubs: {
    DialogProjectMediaMassEditBlockFields: {
      name: 'DialogProjectMediaMassEditBlockFields',
      props: {
        dense: {
          default: true,
          type: Boolean
        },
        locatorPrefix: {
          default: '',
          type: String
        },
        stackTypeRow: {
          default: false,
          type: Boolean
        }
      },
      emits: ['update:row'],
      template: '<div data-test-locator="dialogProjectMedia-singleEdit-title-row-1"></div>'
    },
    DialogProjectMediaPreviewThumbBind: {
      name: 'DialogProjectMediaPreviewThumbBind',
      props: ['locatorPrefix', 'thumbSize'],
      template: '<div data-test-locator="dialogProjectMedia-singleEdit-preview-row-1"></div>'
    }
  }
} as const

/**
 * DialogProjectMediaSingleEditForm
 * Stacked form uses single-edit locators and a single-edit player preview.
 */
test('Test that DialogProjectMediaSingleEditForm renders stacked single-edit locators', async () => {
  const w = mount(DialogProjectMediaSingleEditForm, {
    global: formGlobal,
    props: { row: sampleRow }
  })

  expect(w.find('[data-test-locator="dialogProjectMedia-singleEdit-form"]').exists()).toBe(true)
  expect(w.find('[data-test-locator="dialogProjectMedia-singleEdit-preview-row-1"]').exists())
    .toBe(true)
  expect(w.find('[data-test-locator="dialogProjectMedia-singleEdit-title-row-1"]').exists())
    .toBe(true)
  expect(w.getComponent({ name: 'DialogProjectMediaMassEditBlockFields' }).props('locatorPrefix'))
    .toBe('dialogProjectMedia-singleEdit')
  expect(w.getComponent({ name: 'DialogProjectMediaMassEditBlockFields' }).props('stackTypeRow'))
    .toBe(true)
  expect(w.getComponent({ name: 'DialogProjectMediaMassEditBlockFields' }).props('dense'))
    .toBe(true)
  expect(w.getComponent({ name: 'DialogProjectMediaPreviewThumbBind' }).props('thumbSize'))
    .toBe('singleEdit')
  await w.getComponent({ name: 'DialogProjectMediaMassEditBlockFields' }).vm.$emit(
    'update:row',
    {
      ...sampleRow,
      displayName: 'changed'
    }
  )
  expect(w.emitted('update:row')?.[0]).toEqual([{
    ...sampleRow,
    displayName: 'changed'
  }])
  w.unmount()
})

/**
 * DialogProjectMediaSingleEditForm
 * Dense can be turned off for the slide-out fields.
 */
test('Test that DialogProjectMediaSingleEditForm forwards dense false to fields', () => {
  const w = mount(DialogProjectMediaSingleEditForm, {
    global: formGlobal,
    props: {
      dense: false,
      row: sampleRow
    }
  })

  expect(w.getComponent({ name: 'DialogProjectMediaMassEditBlockFields' }).props('dense'))
    .toBe(false)
  w.unmount()
})
