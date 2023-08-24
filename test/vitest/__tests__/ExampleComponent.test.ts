import { installQuasar } from '@quasar/quasar-app-extension-testing-unit-vitest'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ExampleComponent from './demo/ExampleComponent.vue'

installQuasar()

describe('example Component', () => {
  it('should mount component with todos', () => {
    const wrapper = mount(ExampleComponent, {
      props: {
        title: 'Hello',
        meta: {
          totalCount: 4
        },
        todos: [
          { id: 1, content: 'Hallo' },
          { id: 2, content: 'Hoi' }
        ]
      }
    })
    expect(wrapper.vm.clickCount).toBe(0)
    wrapper.find('.q-item').trigger('click')
    expect(wrapper.vm.clickCount).toBe(1)
  })

  it('should mount component without todos', () => {
    const wrapper = mount(ExampleComponent, {
      props: {
        title: 'Hello',
        meta: {
          totalCount: 4
        }
      }
    })
    expect(wrapper.findAll('.q-item')).toHaveLength(0)
  })
})
