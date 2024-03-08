describe('Action Sheet Controller', () => {
  beforeEach(() => {
    cy.visit('/standalone/action-sheet-controller');
  })

  it('should open an action sheet', () => {
    cy.get('button#open-action-sheet').click();

    cy.get('ion-action-sheet').should('be.visible');
  });
})
