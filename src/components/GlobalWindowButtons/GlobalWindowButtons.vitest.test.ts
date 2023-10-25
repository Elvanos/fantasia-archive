import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import GlobalWindowButtons from './GlobalWindowButtons.vue'

installQuasarPlugin()

describe('Component - "GlobalWindowButtons"', () => {
  /**
   * Object of string data selectors for the component
   */
  const selectorList = {
    buttonMinimize: 'globalWindowButtons-button-minimize',
    buttonResize: 'globalWindowButtons-button-resize',
    buttonClose: 'globalWindowButtons-button-close'
  }

  /**
   * Test if the component has three specific HTML element buttons properly mounted in it:
   * - Minimize button
   * - Resize button
   * - Close button
   */
  it('Wrapper should contain three buttons', () => {
    const wrapper = mount(GlobalWindowButtons)

    const buttonList = []

    buttonList.push(wrapper.get(`[data-test="${selectorList.buttonMinimize}"]`))
    buttonList.push(wrapper.get(`[data-test="${selectorList.buttonResize}"]`))
    buttonList.push(wrapper.get(`[data-test="${selectorList.buttonClose}"]`))

    expect(buttonList).toHaveLength(3)
  })

  /**
   * Test if the component has a specific HTML element button properly mounted in it.
   * - Minimize button
   */
  it('Wrapper should contain "minimize" button', () => {
    const wrapper = mount(GlobalWindowButtons)

    expect(wrapper.get(`[data-test="${selectorList.buttonMinimize}"]`))
  })

  /**
   * Test if the component has a specific HTML element button properly mounted in it.
   * - Resize button
   */
  it('Wrapper should contain "resize" button', () => {
    const wrapper = mount(GlobalWindowButtons)

    expect(wrapper.get(`[data-test="${selectorList.buttonResize}"]`))
  })

  /**
   * Test if the component has a specific HTML element button properly mounted in it.
   * - Close button
   */
  it('Wrapper should contain "close" button', () => {
    const wrapper = mount(GlobalWindowButtons)

    expect(wrapper.get(`[data-test="${selectorList.buttonClose}"]`))
  })
})
