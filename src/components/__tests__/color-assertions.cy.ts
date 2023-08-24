import ColorAssertionsComponent from '../color-assertions.vue'

describe('color assertions', () => {
  it('works with names, hex codes and CSS variables', () => {
    cy.mount(ColorAssertionsComponent)

    cy.get('.wrapper')
      .should('have.color', 'var(--q-primary)')
      .and('have.backgroundColor', 'black')
      .and('have.backgroundColor', '#000')
  })
})
