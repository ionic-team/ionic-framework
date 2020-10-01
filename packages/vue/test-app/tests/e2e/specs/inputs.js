// https://docs.cypress.io/api/introduction/api.html

describe('Inputs', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/inputs')
  })
  it('should have default value', () => {
    cy.get('ion-checkbox').its('checked').should('equal', false)

    cy.get('ion-checkbox').click();

    cy.get('ion-checkbox').its('checked').should('equal', true)
  })
})
