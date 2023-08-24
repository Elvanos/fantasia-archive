import DialogWrapper from 'app/test/cypress/wrappers/DialogWrapper.vue'
import QuasarDialog from '../QuasarDialog.vue'

describe('QuasarDialog', () => {
  it('should show a dialog with a message', () => {
    const message = 'Hello, I am a dialog'
    cy.mount(DialogWrapper, {
      props: {
        component: QuasarDialog,
        componentProps: {
          message
        }
      }
    })

    cy.withinDialog((el) => {
      cy.wrap(el).should('contain', message)
      cy.dataCy('ok-button').click()
    })
  })

  it('should keep the dialog open when not dismissed', () => {
    const message = 'Hello, I am a dialog'
    cy.mount(DialogWrapper, {
      props: {
        component: QuasarDialog,
        componentProps: {
          message
        }
      }
    })

    // The helper won't check for the dialog to be closed
    // when the callback completes
    cy.withinDialog({
      persistent: true,
      fn: (el) => {
        cy.wrap(el).should('contain', message)
      }
    })
  })
})
