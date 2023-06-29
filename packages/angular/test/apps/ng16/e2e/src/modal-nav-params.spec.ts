describe('Modal Nav Params', () => {

  beforeEach(() => {
    cy.visit('/version-test/modal-nav-params');
  });

  it('should assign the rootParams when presented in a modal multiple times', () => {
    cy.contains('Open Modal').click();
    cy.get('ion-modal').should('exist').should('be.visible');
    cy.get('ion-modal').contains('OK');

    cy.contains("Close").click();
    cy.get('ion-modal').should('not.be.visible');

    cy.contains('Open Modal').click();
    cy.get('ion-modal').should('exist').should('be.visible');
    cy.get('ion-modal').contains('OK').should('exist');
  });

});
