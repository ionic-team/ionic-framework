describe('useIonLoading', () => {
  beforeEach(() => {
    cy.visit('/overlay-hooks/loading');
  });

  it('display loading using options', () => {
    //show loading
    cy.get('ion-button').contains('Show Loading with options').click();
    cy.get('ion-loading').contains('Loading');

    //loading goes away after 1s
    cy.get('ion-loading').should('not.exist');
  });

  it('display loading using params', () => {
    //show loading
    cy.get('ion-button').contains('Show Loading with params').click();
    cy.get('ion-loading').contains('Loading');

    //loading goes away after 1s
    cy.get('ion-loading').should('not.exist');
  });

  it('display loading and call dismiss to close it', () => {
    //show loading
    cy.get('ion-button').contains('Show Loading, hide after 250 ms').click();
    cy.get('ion-loading').contains('Loading');

    //verify loading is gone
    cy.get('ion-loading').should('not.exist');
  });
});
