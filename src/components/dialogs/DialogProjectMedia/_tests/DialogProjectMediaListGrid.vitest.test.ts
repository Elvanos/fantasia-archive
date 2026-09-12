import { flushPromises, mount } from '@vue/test-utils'
import { expect, test } from 'vitest'

import type { I_faProjectMedia } from 'app/types/I_faProjectMediaDomain'

import DialogProjectMediaListGrid from '../DialogProjectMediaListGrid.vue'

const sampleItem: I_faProjectMedia = {
  createdAtMs: 0,
  displayName: 'bar',
  externalEmbed: '',
  externalLink: 'https://cdn.example.com/foo/bar.png',
  externalType: 'linked',
  id: 'row-1',
  internalEmbed: null,
  internalLink: '',
  internalType: 'linked_outside',
  type: 'external',
  updatedAtMs: 0
}

const gridGlobal = {
  mocks: { $t: (k: string) => k },
  stubs: {
    QIcon: {
      inheritAttrs: true,
      template: '<i v-bind="$attrs" />'
    },
    QTooltip: {
      template: '<span><slot /></span>'
    }
  }
} as const

/**
 * DialogProjectMediaListGrid
 * Empty library still renders the grid root.
 */
test('Test that DialogProjectMediaListGrid renders an empty grid root', () => {
  const w = mount(DialogProjectMediaListGrid, {
    global: gridGlobal,
    props: { items: [] }
  })

  expect(w.find('[data-test-locator="dialogProjectMedia-listGrid"]').exists()).toBe(true)
  expect(w.find('[data-test-locator="dialogProjectMedia-list-preview-row-1"]').exists()).toBe(false)
  w.unmount()
})

/**
 * DialogProjectMediaListGrid
 * Saved rows use list-size thumbs and list locators.
 */
test('Test that DialogProjectMediaListGrid renders list-size preview thumbs', async () => {
  const w = mount(DialogProjectMediaListGrid, {
    global: gridGlobal,
    props: { items: [sampleItem] }
  })

  await flushPromises()
  expect(w.get('[data-test-locator="dialogProjectMedia-list-preview-row-1"]').classes()).toContain(
    'dialogProjectMediaMassEditPreviewThumb--list'
  )
  expect(
    w.get('[data-test-locator="dialogProjectMedia-list-previewImage-row-1"]').attributes('src')
  ).toBe('https://cdn.example.com/foo/bar.png')
  expect(w.get('[data-test-locator="dialogProjectMedia-list-previewCaption-row-1"]').text()).toBe(
    'bar'
  )
  expect(w.find('[data-test-locator="dialogProjectMedia-list-thumb-row-1"]').exists()).toBe(true)
  w.unmount()
})

/**
 * DialogProjectMediaListGrid
 * Blank titles fall back to the visible URL on the overlay.
 */
test('Test that DialogProjectMediaListGrid caption falls back to the URL', async () => {
  const w = mount(DialogProjectMediaListGrid, {
    global: gridGlobal,
    props: {
      items: [{
        ...sampleItem,
        displayName: ''
      }]
    }
  })

  await flushPromises()
  expect(w.get('[data-test-locator="dialogProjectMedia-list-previewCaption-row-1"]').text()).toBe(
    'https://cdn.example.com/foo/bar.png'
  )
  w.unmount()
})

/**
 * DialogProjectMediaListGrid
 * Left-click on a thumb emits the saved item.
 */
test('Test that DialogProjectMediaListGrid emits selectItem on thumb click', async () => {
  const w = mount(DialogProjectMediaListGrid, {
    global: gridGlobal,
    props: { items: [sampleItem] }
  })

  await w.get('[data-test-locator="dialogProjectMedia-list-thumb-row-1"]').trigger('click')
  expect(w.emitted('selectItem')?.[0]).toEqual([sampleItem])
  w.unmount()
})
