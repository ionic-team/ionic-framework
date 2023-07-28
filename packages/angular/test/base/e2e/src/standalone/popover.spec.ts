describe('Popovers: Inline', () => {
  beforeEach(() => {
    cy.visit('/standalone/popover');
  });

  it('should render popover', () => {
    cy.get('ion-button').click();

    cy.get('ion-popover').should('be.visible');
    cy.get('ion-list ion-item').should('not.exist');
  });
});
