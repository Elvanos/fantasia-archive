import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'

import type { I_faProjectMedia } from 'app/types/I_faProjectMediaDomain'

import DialogProjectMediaPreviewThumbBind from '../DialogProjectMediaPreviewThumbBind.vue'

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

const bindGlobal = {
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
 * DialogProjectMediaPreviewThumbBind
 * Default locators match mass-edit thumbs.
 */
test('Test that DialogProjectMediaPreviewThumbBind defaults to mass-edit locators', () => {
  const w = mount(DialogProjectMediaPreviewThumbBind, {
    global: bindGlobal,
    props: { item: sampleItem }
  })

  expect(
    w.get('[data-test-locator="dialogProjectMedia-massEdit-previewImage-row-1"]').attributes('src')
  ).toBe('https://cdn.example.com/foo/bar.png')
  expect(
    w.get('[data-test-locator="dialogProjectMedia-massEdit-preview-row-1"]').classes()
  ).not.toContain('dialogProjectMediaMassEditPreviewThumb--list')
  expect(
    w.find('[data-test-locator="dialogProjectMedia-massEdit-previewCaption-row-1"]').exists()
  ).toBe(false)
  w.unmount()
})

/**
 * DialogProjectMediaPreviewThumbBind
 * List size and locator prefix apply on the Project Media list.
 */
test('Test that DialogProjectMediaPreviewThumbBind can use list locators and size', () => {
  const w = mount(DialogProjectMediaPreviewThumbBind, {
    global: bindGlobal,
    props: {
      debounceMs: 0,
      item: sampleItem,
      locatorPrefix: 'dialogProjectMedia-list-preview',
      thumbSize: 'list'
    }
  })

  expect(w.get('[data-test-locator="dialogProjectMedia-list-preview-row-1"]').classes()).toContain(
    'dialogProjectMediaMassEditPreviewThumb--list'
  )
  expect(w.get('[data-test-locator="dialogProjectMedia-list-previewCaption-row-1"]').text()).toBe(
    'bar'
  )
  w.unmount()
})

/**
 * DialogProjectMediaPreviewThumbBind
 * List overlay follows a later title or URL change on the same thumb.
 */
test('Test that DialogProjectMediaPreviewThumbBind list caption updates when the item changes', async () => {
  const w = mount(DialogProjectMediaPreviewThumbBind, {
    global: bindGlobal,
    props: {
      debounceMs: 0,
      item: sampleItem,
      locatorPrefix: 'dialogProjectMedia-list-preview',
      thumbSize: 'list'
    }
  })

  expect(w.get('[data-test-locator="dialogProjectMedia-list-previewCaption-row-1"]').text()).toBe(
    'bar'
  )
  await w.setProps({
    item: {
      ...sampleItem,
      displayName: 'renamed'
    }
  })
  expect(w.get('[data-test-locator="dialogProjectMedia-list-previewCaption-row-1"]').text()).toBe(
    'renamed'
  )
  await w.setProps({
    item: {
      ...sampleItem,
      displayName: '   ',
      externalLink: 'https://cdn.example.com/new.png'
    }
  })
  expect(w.get('[data-test-locator="dialogProjectMedia-list-previewCaption-row-1"]').text()).toBe(
    'https://cdn.example.com/new.png'
  )
  w.unmount()
})

/**
 * DialogProjectMediaPreviewThumbBind
 * List overlay falls back to the URL when the title is blank.
 */
test('Test that DialogProjectMediaPreviewThumbBind list caption falls back to the URL', () => {
  const w = mount(DialogProjectMediaPreviewThumbBind, {
    global: bindGlobal,
    props: {
      debounceMs: 0,
      item: {
        ...sampleItem,
        displayName: '   '
      },
      locatorPrefix: 'dialogProjectMedia-list-preview',
      thumbSize: 'list'
    }
  })

  expect(w.get('[data-test-locator="dialogProjectMedia-list-previewCaption-row-1"]').text()).toBe(
    'https://cdn.example.com/foo/bar.png'
  )
  w.unmount()
})

/**
 * DialogProjectMediaPreviewThumbBind
 * Embed with no title has no overlay (preview URL is empty).
 */
test('Test that DialogProjectMediaPreviewThumbBind hides list caption when title and URL are empty', () => {
  const w = mount(DialogProjectMediaPreviewThumbBind, {
    global: bindGlobal,
    props: {
      debounceMs: 0,
      item: {
        ...sampleItem,
        displayName: '',
        externalEmbed: '',
        externalLink: 'https://cdn.example.com/foo/bar.png',
        externalType: 'embed'
      },
      locatorPrefix: 'dialogProjectMedia-list-preview',
      thumbSize: 'list'
    }
  })

  expect(
    w.find('[data-test-locator="dialogProjectMedia-list-previewCaption-row-1"]').exists()
  ).toBe(false)
  w.unmount()
})

/**
 * DialogProjectMediaPreviewThumbBind
 * Empty URL shows the invalid preview warning.
 */
test('Test that DialogProjectMediaPreviewThumbBind warns when the preview URL is empty', () => {
  const w = mount(DialogProjectMediaPreviewThumbBind, {
    global: bindGlobal,
    props: {
      item: {
        ...sampleItem,
        externalLink: ''
      }
    }
  })

  expect(w.find('[data-test-locator="dialogProjectMedia-massEdit-previewWarning-row-1"]').exists())
    .toBe(true)
  w.unmount()
})

/**
 * DialogProjectMediaPreviewThumbBind
 * Single-edit embed size injects External embed body HTML.
 */
test('Test that DialogProjectMediaPreviewThumbBind single-edit embed renders the body HTML', () => {
  const w = mount(DialogProjectMediaPreviewThumbBind, {
    global: bindGlobal,
    props: {
      debounceMs: 0,
      item: {
        ...sampleItem,
        externalEmbed: '<iframe title="clip"></iframe>',
        externalLink: '',
        externalType: 'embed'
      },
      locatorPrefix: 'dialogProjectMedia-singleEdit-preview',
      thumbSize: 'singleEdit'
    }
  })

  expect(
    w.get('[data-test-locator="dialogProjectMedia-singleEdit-previewEmbed-row-1"]').html()
  ).toContain('<iframe title="clip"></iframe>')
  expect(
    w.find('[data-test-locator="dialogProjectMedia-singleEdit-previewTypeIcon-row-1"]').exists()
  ).toBe(false)
  w.unmount()
})
