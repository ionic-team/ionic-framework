describe('useIonPopover', () => {
  beforeEach(() => {
    cy.visit('/overlay-hooks/popover');
  });

  it('display popover using component param', () => {
    //show popover
    cy.get('ion-button').contains('Show Popover with component param').click();
    cy.get('ion-popover ion-list-header').contains('Ionic');

    //close popover
    cy.get('ion-item').contains('Close').click();
    cy.get('ion-popover').should('not.exist');
  });

  it('display popover using element param', () => {
    //show popover
    cy.get('ion-button').contains('Show Popover with element param').click();
    cy.get('ion-popover ion-list-header').contains('Ionic');

    //close popover
    cy.get('ion-item').contains('Close').click();
    cy.get('ion-popover').should('not.exist');
  });

  it('display popover and call dismiss to close it', () => {
    //show popover
    cy.get('ion-button').contains('Show Popover, hide after 250 ms').click();
    cy.get('ion-popover ion-list-header').contains('Ionic');

    //verify popover is gone
    cy.get('ion-popover').should('not.exist');
  });

});
