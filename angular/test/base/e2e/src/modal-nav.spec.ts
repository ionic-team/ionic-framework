describe('Modal Nav', () => {
  beforeEach(() => {
    cy.visit('/modal-nav');
  });

  it('should assign the rootParams when opened multiple times', () => {
    // https://github.com/ionic-team/ionic-framework/issues/27146
    cy.contains('Open Modal').click();
    cy.get('ion-modal').should('exist').should('be.visible');
    cy.contains('Hello world 1');

    cy.contains('Close').click();
    cy.get('ion-modal').should('not.exist');

    cy.contains('Open Modal').click();
    cy.contains('Hello world 2');
  });

});
