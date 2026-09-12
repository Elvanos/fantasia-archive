import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'

import type { I_faProjectMediaMassEditRow } from 'app/types/I_faProjectMediaDomain'

import DialogProjectMediaSingleEditSlide from '../DialogProjectMediaSingleEditSlide.vue'

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

const slideGlobal = {
  mocks: { $t: (k: string) => k },
  stubs: {
    DialogProjectMediaSingleEditForm: {
      name: 'DialogProjectMediaSingleEditForm',
      props: {
        dense: {
          default: true,
          type: Boolean
        }
      },
      emits: ['update:row'],
      template: '<div data-test-locator="dialogProjectMedia-singleEdit-form"></div>'
    },
    QBtn: {
      props: {
        disable: {
          default: false,
          type: Boolean
        },
        icon: {
          default: '',
          type: String
        },
        label: {
          default: '',
          type: String
        },
        outline: {
          default: false,
          type: Boolean
        },
        round: {
          default: false,
          type: Boolean
        }
      },
      template: '<button type="button" v-bind="$attrs" :data-icon="icon" :disabled="disable">{{ label }}</button>'
    }
  }
} as const

/**
 * DialogProjectMediaSingleEditSlide
 * Slide chrome has nav, Close, Save without close, and Save and close.
 */
test('Test that DialogProjectMediaSingleEditSlide renders form Close and Save', async () => {
  const w = mount(DialogProjectMediaSingleEditSlide, {
    global: slideGlobal,
    props: {
      nextDisabled: false,
      previousDisabled: true,
      row: sampleRow
    }
  })

  expect(w.find('[data-test-locator="dialogProjectMedia-singleEditSlide"]').exists()).toBe(true)
  expect(w.find('[data-test-locator="dialogProjectMedia-singleEditSlide-backdrop"]').exists())
    .toBe(true)
  expect(w.find('[data-test-locator="dialogProjectMedia-singleEdit-form"]').exists()).toBe(true)
  expect(w.getComponent({ name: 'DialogProjectMediaSingleEditForm' }).props('dense')).toBe(false)
  expect(w.find('.dialogProjectMediaSlideTitle').exists()).toBe(false)
  expect(
    w.get('[data-test-locator="dialogProjectMedia-singleEditSlide-previous"]').attributes('disabled')
  ).toBeDefined()
  expect(
    w.get('[data-test-locator="dialogProjectMedia-singleEditSlide-next"]').attributes('disabled')
  ).toBeUndefined()
  expect(
    w.get('[data-test-locator="dialogProjectMedia-singleEditSlide-previous"]').attributes('data-icon')
  ).toBe('keyboard_arrow_left')
  expect(
    w.get('[data-test-locator="dialogProjectMedia-singleEditSlide-previous"]').classes()
  ).toContain('dialogProjectMediaSingleEditSlide__navBtn')
  expect(
    w.get('[data-test-locator="dialogProjectMedia-singleEditSlide-next"]').classes()
  ).toContain('dialogProjectMediaSingleEditSlide__navBtn')
  expect(w.find('q-tooltip').exists()).toBe(false)
  await w.get('[data-test-locator="dialogProjectMedia-singleEditSlide-close"]').trigger('click')
  expect(w.emitted('close')).toHaveLength(1)
  await w.get('[data-test-locator="dialogProjectMedia-singleEditSlide-saveStay"]').trigger('click')
  expect(w.emitted('saveStay')).toHaveLength(1)
  await w.get('[data-test-locator="dialogProjectMedia-singleEditSlide-save"]').trigger('click')
  expect(w.emitted('save')).toHaveLength(1)
  await w.get('[data-test-locator="dialogProjectMedia-singleEditSlide-next"]').trigger('click')
  expect(w.emitted('next')).toHaveLength(1)
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
  w.unmount()

  const nav = mount(DialogProjectMediaSingleEditSlide, {
    global: slideGlobal,
    props: {
      nextDisabled: true,
      previousDisabled: false,
      row: sampleRow
    }
  })
  await nav.get('[data-test-locator="dialogProjectMedia-singleEditSlide-previous"]').trigger(
    'click'
  )
  expect(nav.emitted('previous')).toHaveLength(1)
  nav.unmount()
})

/**
 * DialogProjectMediaSingleEditSlide
 * Null row hides the form.
 */
test('Test that DialogProjectMediaSingleEditSlide hides the form when row is null', () => {
  const w = mount(DialogProjectMediaSingleEditSlide, {
    global: slideGlobal,
    props: {
      nextDisabled: true,
      previousDisabled: true,
      row: null
    }
  })

  expect(w.find('[data-test-locator="dialogProjectMedia-singleEdit-form"]').exists()).toBe(false)
  w.unmount()
})
