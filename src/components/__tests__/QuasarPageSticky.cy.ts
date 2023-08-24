import LayoutContainer from 'app/test/cypress/wrappers/LayoutContainer.vue'
import QuasarPageSticky from '../QuasarPageSticky.vue'

describe('QuasarPageSticky', () => {
  it('should show a sticky at the bottom-right of the page', () => {
    cy.mount(LayoutContainer, {
      props: {
        component: QuasarPageSticky,
        title: 'Test'
      }
    })

    cy.dataCy('button')
      .should('be.visible')
      .should(($el) => {
        const rect = $el[0].getBoundingClientRect()
        expect(rect.bottom).to.equal(window.innerHeight - 18)
        expect(rect.right).to.equal(window.innerWidth - 18)
      })
  })
})
