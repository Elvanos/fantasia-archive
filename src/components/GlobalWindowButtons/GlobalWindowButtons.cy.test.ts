import GlobalWindowButtons from './GlobalWindowButtons.vue'

describe('Component test - GlobalWindowButtons', () => {
  it('should have a `accent` color & `dark` background-color', () => {
    cy.mount(GlobalWindowButtons)

    cy.get('.q-btn-group')
      .should('have.backgroundColor', 'var(--q-dark)')
      .should('have.color', 'var(--q-accent)')
  })
})
