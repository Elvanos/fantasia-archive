import { installQuasar } from '@quasar/quasar-app-extension-testing-unit-vitest'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import GlobalWindowButtons from './GlobalWindowButtons.vue'

installQuasar()

describe('Unit test - GlobalWindowButtons component', () => {
  it('should mount three buttons', () => {
    const wrapper = mount(GlobalWindowButtons)
    expect(wrapper.findAll('.q-btn')).toHaveLength(3)
  })

  it('should have `minimize` button', () => {
    const wrapper = mount(GlobalWindowButtons)
    expect(wrapper.findAll('.globalWindowButtons__minimize')).toHaveLength(1)
  })

  it('should have `resize` button', () => {
    const wrapper = mount(GlobalWindowButtons)
    expect(wrapper.findAll('.globalWindowButtons__minimize')).toHaveLength(1)
  })

  it('should have `close` button', () => {
    const wrapper = mount(GlobalWindowButtons)
    expect(wrapper.findAll('.globalWindowButtons__minimize')).toHaveLength(1)
  })
})
