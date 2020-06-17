const port = 3000;

describe('Nested Outlets', () => {
  /*
    This spec tests that switching between tabs via a menu works
    Fixes bug https://github.com/ionic-team/ionic/issues/21336
  */

  it('/multiple-tabs > PageA should be visible', () => {
    cy.visit(`http://localhost:${port}/multiple-tabs`)
    cy.ionPageVisible('PageA')
  })

  it('/multiple-tabs > Page B Tab, PageB should be visible', () => {
    cy.visit(`http://localhost:${port}/multiple-tabs`)
    cy.ionPageVisible('PageA')
    cy.ionTabClick('Page B')
    cy.ionPageVisible('PageB')
  })
})