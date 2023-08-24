import LayoutContainer from 'app/test/cypress/wrappers/LayoutContainer.vue'
import QuasarDrawer from '../QuasarDrawer.vue'

describe('QuasarDrawer', () => {
  it('should show a drawer', () => {
    cy.mount(LayoutContainer, {
      props: {
        component: QuasarDrawer
      }
    })
    cy.dataCy('drawer')
      .should('exist')
      .dataCy('button')
      .should('not.be.visible')
    cy.get('.q-scrollarea .scroll')
    cy.get('.q-scrollarea .scroll').scrollTo('bottom', { duration: 500 })
    cy.get('.q-scrollarea .scroll').dataCy('button')
    cy.get('.q-scrollarea .scroll').should('be.visible')
  })
})
