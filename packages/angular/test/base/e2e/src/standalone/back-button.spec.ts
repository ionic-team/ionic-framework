describe('Back Button', () => {
  beforeEach(() => {
    cy.visit('/standalone/back-button');
  })

  it('should be visible and navigate back to page', () => {
    cy.ionPageVisible('app-back-button');

    cy.get('ion-back-button').click();

    cy.ionPageDoesNotExist('app-back-button');
    cy.ionPageVisible('app-router-outlet');
  });
})
