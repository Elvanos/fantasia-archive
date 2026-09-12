import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'

import DialogProjectMediaSlideTitle from '../DialogProjectMediaSlideTitle.vue'

/**
 * DialogProjectMediaSlideTitle
 * Renders the heading text and locator hook.
 */
test('Test that DialogProjectMediaSlideTitle renders label and locator', () => {
  const w = mount(DialogProjectMediaSlideTitle, {
    props: {
      label: 'Project Media - Add New Media',
      testLocator: 'dialogProjectMedia-title-mediaAdd'
    }
  })

  expect(w.element.tagName).toBe('H5')
  expect(w.text()).toBe('Project Media - Add New Media')
  expect(w.attributes('data-test-locator')).toBe('dialogProjectMedia-title-mediaAdd')
  w.unmount()
})
