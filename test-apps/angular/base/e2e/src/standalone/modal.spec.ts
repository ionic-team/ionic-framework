describe('Modals: Inline', () => {
  beforeEach(() => {
    cy.visit('/standalone/modal');
  });

  it('should render modal', () => {
    cy.get('button#open-modal').click();

    cy.get('ion-modal').should('be.visible');
    cy.get('ion-modal #modal-content').should('exist');
  });
});
