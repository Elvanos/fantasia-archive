import QuasarButton from '../QuasarButton.vue'

describe('QuasarButton', () => {
  it('renders a message', () => {
    const label = 'Hello there'
    cy.mount(QuasarButton, {
      props: {
        label
      }
    })

    cy.dataCy('button').should('contain', label)
  })

  it('renders another message', () => {
    const label = 'Will this work?'
    cy.mount(QuasarButton, {
      props: {
        label
      }
    })

    cy.dataCy('button').should('contain', label)
  })

  it('should have a `positive` color', () => {
    cy.mount(QuasarButton)

    cy.dataCy('button')
      .should('have.backgroundColor', 'var(--q-positive)')
      .should('have.color', 'white')
  })

  it('should emit `test` upon click', () => {
    cy.mount(QuasarButton)

    cy.dataCy('button')
    cy.dataCy('button').click()
    cy.dataCy('button').should(() => {
      expect(Cypress.vueWrapper.emitted('test')).to.have.length(1)
    })
  })
})
