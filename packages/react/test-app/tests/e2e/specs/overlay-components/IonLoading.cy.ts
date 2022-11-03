describe('IonLoading', () => {
  beforeEach(() => {
    cy.visit('/overlay-components/loading');
  });

  it('display loading', () => {
    //show loading
    cy.get('ion-button').contains('Show Loading').click();
    cy.get('ion-loading').contains('Loading');

    //loading goes away after 1s
    cy.get('ion-loading').should('not.be.visible');
  });

  it('display loading and call dismiss to close it', () => {
    //show loading
    cy.get('ion-button').contains('Show Loading, hide after 250 ms').click();
    cy.get('ion-loading').contains('Loading');

    //verify loading is hidden
    cy.get('ion-loading').should('not.be.visible');
  });
});
