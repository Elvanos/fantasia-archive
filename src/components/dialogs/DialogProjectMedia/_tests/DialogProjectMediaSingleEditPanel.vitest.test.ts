import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'

import type { I_faProjectMediaMassEditRow } from 'app/types/I_faProjectMediaDomain'

import DialogProjectMediaSingleEditPanel from '../DialogProjectMediaSingleEditPanel.vue'

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

const panelGlobal = {
  mocks: { $t: (k: string) => k },
  stubs: {
    DialogProjectMediaSingleEditForm: {
      name: 'DialogProjectMediaSingleEditForm',
      emits: ['update:row'],
      template: '<div data-test-locator="dialogProjectMedia-singleEdit-form"></div>'
    },
    DialogProjectMediaSlideTitle: {
      name: 'DialogProjectMediaSlideTitle',
      props: ['label', 'testLocator'],
      template: '<h5 :data-test-locator="testLocator">{{ label }}</h5>'
    },
    QBtn: {
      props: {
        disable: {
          default: false,
          type: Boolean
        },
        label: {
          default: '',
          type: String
        }
      },
      template: '<button type="button" v-bind="$attrs" :disabled="disable">{{ label }}</button>'
    }
  }
} as const

/**
 * DialogProjectMediaSingleEditPanel
 * Empty tab shows the single-edit title and disables Save and close.
 */
test('Test that DialogProjectMediaSingleEditPanel empty tab disables Save and close', async () => {
  const w = mount(DialogProjectMediaSingleEditPanel, {
    global: panelGlobal,
    props: {
      isSaveDisabled: true,
      row: null
    }
  })

  expect(w.get('[data-test-locator="dialogProjectMedia-title-mediaSingleEdit"]').text())
    .toBe('dialogs.projectMedia.titleSingle')
  expect(w.find('[data-test-locator="dialogProjectMedia-singleEdit-form"]').exists()).toBe(false)
  expect(
    (w.get('[data-test-locator="dialogProjectMedia-singleEdit-saveAndClose"]')
      .element as HTMLButtonElement).disabled
  ).toBe(true)
  await w.get('[data-test-locator="dialogProjectMedia-singleEdit-close"]').trigger('click')
  expect(w.emitted('close')).toHaveLength(1)
  w.unmount()
})

/**
 * DialogProjectMediaSingleEditPanel
 * Loaded row shows the form and enables Save and close.
 */
test('Test that DialogProjectMediaSingleEditPanel loaded row enables save', async () => {
  const w = mount(DialogProjectMediaSingleEditPanel, {
    global: panelGlobal,
    props: {
      isSaveDisabled: false,
      row: sampleRow
    }
  })

  expect(w.find('[data-test-locator="dialogProjectMedia-singleEdit-form"]').exists()).toBe(true)
  expect(
    (w.get('[data-test-locator="dialogProjectMedia-singleEdit-saveAndClose"]')
      .element as HTMLButtonElement).disabled
  ).toBe(false)
  await w.get('[data-test-locator="dialogProjectMedia-singleEdit-saveAndClose"]').trigger('click')
  expect(w.emitted('save')).toHaveLength(1)
  await w.getComponent({ name: 'DialogProjectMediaSingleEditForm' }).vm.$emit(
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
  await w.setProps({ row: null })
  expect(w.find('[data-test-locator="dialogProjectMedia-singleEdit-form"]').exists()).toBe(false)
  w.unmount()
})
