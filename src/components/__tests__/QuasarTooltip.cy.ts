import QuasarTooltip from '../QuasarTooltip.vue'

describe('QuasarTooltip', () => {
  it('should show a tooltip', () => {
    cy.mount(QuasarTooltip)

    cy.dataCy('button').trigger('mouseover')
    cy.dataCy('tooltip').contains('Here I am!')
  })
})
