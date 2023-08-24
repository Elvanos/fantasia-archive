import { vModelAdapter } from '@quasar/quasar-app-extension-testing-e2e-cypress'
import { ref } from 'vue'
import VModelComponent from '../VModelComponent.vue'

describe('VModelComponent', () => {
  it('should show the value', () => {
    const text = 'Quasar'

    cy.mount(VModelComponent, {
      props: {
        modelValue: text
      }
    })

    cy.dataCy('model-value').should('contain', text)
  })

  it('should call the listener when an update via inner button occurs', () => {
    const text = 'Quasar'
    const fn = cy.stub()

    cy.mount(VModelComponent, {
      props: {
        modelValue: text,
        // This is how Vue internally codifies listeners,
        // defining a prop prepended with `on` and camelCased
        'onUpdate:modelValue': fn
      }
    })

    cy.dataCy('button')
    cy.dataCy('button').click()
    cy.dataCy('button').then(() => {
      expect(fn).to.be.calledWith('uasar')
    })
  })

  it('should update the value via inner button when not using the helper', () => {
    const text = 'Quasar'

    cy.mount(VModelComponent, {
      props: {
        modelValue: text,
        'onUpdate:modelValue': (emittedValue: string) =>
          Cypress.vueWrapper.setProps({ modelValue: emittedValue })
      }
    })

    cy.dataCy('button').click()
    cy.dataCy('model-value').should('contain', 'uasar')
  })

  it('should update the value via inner button using the helper', () => {
    const model = ref('Quasar')

    cy.mount(VModelComponent, {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      props: {
        ...vModelAdapter(model)
      }
    })

    cy.dataCy('button').click()
    cy.dataCy('model-value')
      .should('contain', 'uasar')
      .then(() => {
        // You cannot access `model.value` in a synchronous way,
        // you need to chain checks on it to a Cypress command or you'll be testing the initial value.
        expect(model.value).to.equal('uasar')
      })
  })
})
