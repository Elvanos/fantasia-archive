import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import FantasiaMascotImage from './FantasiaMascotImage.vue'

installQuasarPlugin()

describe('Component - "FantasiaMascotImage"', () => {
  /**
   * Object of string data selectors for the component
   */
  const selectorList = {
    image: 'fantasiaMascotImage-image'
  }

  /**
   * Test if the component has an "img" HTML element properly mounted in it.
   */
  it('Wrapper should contain an image', () => {
    const wrapper = mount(FantasiaMascotImage)

    const imageElement = wrapper.get(`[data-test="${selectorList.image}"]`).element

    expect(imageElement.tagName).toBe('IMG')
  })

  /**
   * Test if the "img" HTML element has received the "width" prop properly.
   * - Testing via "dataset" instead of actual width due to Vitest limitations.
   */
  it('Image inside wrapper should have 300px "width"', () => {
    const testString = '300px'

    const wrapper = mount(FantasiaMascotImage, {
      props: {
        width: testString
      }
    })

    const imageElement = wrapper.get(`[data-test="${selectorList.image}"]`).element as HTMLImageElement

    expect(imageElement.dataset.testWidth).toBe(testString)
  })

  /**
   * Test if the "img" HTML element has received the "height" prop properly.
   * - Testing via "dataset" instead of actual height due to Vitest limitations.
   */
  it('Image inside wrapper should have 300px "height"', () => {
    const testString = '300px'

    const wrapper = mount(FantasiaMascotImage, {
      props: {
        height: testString
      }
    })

    const imageElement = wrapper.get(`[data-test="${selectorList.image}"]`).element as HTMLImageElement

    expect(imageElement.dataset.testHeight).toBe(testString)
  })

  /**
   * Test if the component properly determines if the image will be random.
   */
  it('Should generate random image URL', () => {
    const wrapper = mount(FantasiaMascotImage)

    const imageElement = wrapper.get(`[data-test="${selectorList.image}"]`).element as HTMLImageElement

    expect(imageElement.dataset.testIsRandom).toBe('true')
  })

  /**
   * Test if the component properly determines if the image will NOT be random.
   */
  it('Should generate non-random image URL', () => {
    const testString = 'flop'

    const wrapper = mount(FantasiaMascotImage, {
      props: {
        fantasiaImage: testString
      }
    })

    const imageElement = wrapper.get(`[data-test="${selectorList.image}"]`).element as HTMLImageElement

    expect(imageElement.dataset.testIsRandom).toBe('false')
  })
})
