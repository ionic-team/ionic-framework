describe('Overlay Controllers', () => {
  beforeEach(() => {
    cy.visit('/standalone/overlay-controllers');
  })

  it('should present a modal', () => {
    cy.get('button#open-modal').click();

    cy.get('ion-modal app-dialog-content').should('be.visible');
  });

  it('should present a popover', () => {
    cy.get('button#open-popover').click();

    cy.get('ion-popover app-dialog-content').should('be.visible');
  });
})
