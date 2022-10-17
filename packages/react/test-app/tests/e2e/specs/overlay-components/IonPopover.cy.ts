describe('IonPopover', () => {
  beforeEach(() => {
    cy.visit('/overlay-components/popover');
  });

  it('display popover', () => {
    //show popover
    cy.get('ion-button').contains('Show Popover').click();
    cy.get('ion-popover ion-list-header').contains('Ionic');

    //close popover
    cy.get('ion-item').contains('Close').click();
  });

  it('display popover and call dismiss to close it', () => {
    //show popover
    cy.get('ion-button').contains('Show Popover, hide after 250 ms').click();
    cy.get('ion-popover ion-list-header').contains('Ionic');
  });

  it('display popover and remove containing element', () => {
    //show popover, remove containing item
    cy.get('#openPopover').click();
    cy.get('#removeItem').click();

    //verify popover is gone
    cy.get('#popoverInItem').should('not.exist');
  });
});


describe('IonPopover: nested', () => {
  beforeEach(() => {
    cy.visit('/overlay-components/nested-popover');
  });

  it('display nested popover', () => {
    // Open the popover
    cy.get('ion-button').contains('Show Popover').click();
    cy.get('ion-popover ion-list-header').contains('Menu Items');
    // Open the nested popover
    cy.get('#item-4').click();
    cy.get('ion-popover ion-list-header').contains('Submenu Items');

    /**
     * These tests are disabled due to: https://github.com/ionic-team/ionic-framework/issues/25324
     *
     * When the nested overlay is dismissed, the parent overlay is also dismissed.
     *
     * Dev note: This behavior may be resolved when moving overlays to open with a React Portal.
     * In brief exploration, this problem did not reproduce when using a React Portal.
     */
    // Close the nested popover
    // cy.get('#close-submenu-popover').click();

    // // The nested popover should be dismissed, but still in the DOM.
    // cy.get('#submenu-popover').should('not.be.visible');
    // cy.get('#submenu-popover').should('exist');
    // // The parent popover should remain visible
    // cy.get('#menu-popover').should('be.visible');

    // Close the parent popover
    cy.get('#close-menu-popover').click();

    // The nested popover should not exist in the DOM.
    cy.get('#submenu-popover').should('not.exist');
    // The parent popover should be dismissed, but still in the DOM.
    cy.get('#menu-popover').should('not.be.visible');
    cy.get('#menu-popover').should('exist');

  });
})
