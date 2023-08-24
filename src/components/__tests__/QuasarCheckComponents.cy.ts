import QuasarCheckComponents from '../QuasarCheckComponents.vue'

describe('QuasarCheckbox', () => {
  it('can be used with normal Cypress commands', () => {
    cy.mount(QuasarCheckComponents)

    cy.dataCy('checkbox').check()
    cy.dataCy('checkbox').should('be.checked')

    cy.dataCy('checkbox').uncheck()
    cy.dataCy('checkbox').should('not.be.checked')
  })
})

describe('QuasarToggle', () => {
  it('can be used with normal Cypress commands', () => {
    cy.mount(QuasarCheckComponents)

    cy.dataCy('toggle').check()
    cy.dataCy('toggle').should('be.checked')

    cy.dataCy('toggle').uncheck()
    cy.dataCy('toggle').should('not.be.checked')
  })
})

describe('QuasarToggle', () => {
  it('can be used with normal Cypress commands', () => {
    cy.mount(QuasarCheckComponents)

    cy.dataCy('radio-1').check()
    cy.dataCy('radio-1').should('be.checked')

    cy.dataCy('radio-2').check()
    cy.dataCy('radio-2').should('be.checked')
    cy.dataCy('radio-1').should('not.be.checked')
  })
})
