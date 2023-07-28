describe('Popovers: Inline', () => {
  beforeEach(() => {
    cy.visit('/standalone/popover');
  });

  it('should render popover', () => {
    cy.get('button#open-popover').click();

    cy.get('ion-popover').should('be.visible');
    cy.get('ion-popover #popover-content').should('exist');
  });
});
