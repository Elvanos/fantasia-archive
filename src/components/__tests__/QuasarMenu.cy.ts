import QuasarMenu from '../QuasarMenu.vue'

describe('QuasarMenu', () => {
  it('click an item by content', () => {
    cy.mount(QuasarMenu)

    cy.dataCy('open-menu-btn').click()
    cy.withinMenu(() => {
      cy.get('.q-item').contains('Item 1').click()
    })
  })

  it('click an item by cardinality', () => {
    cy.mount(QuasarMenu)

    cy.dataCy('open-menu-btn').click()
    cy.withinMenu(() => {
      cy.get('.q-item').eq(1).click()
    })
  })
})
