describe('Overlay Controllers', () => {
  beforeEach(() => {
    cy.visit('/standalone/overlay-controllers');
  });

  it('should present an alert', () => {
    cy.get('button#open-alert').click();

    cy.get('ion-alert').should('be.visible');
  });

  it('should present a loading indicator', () => {
    cy.get('button#open-loading').click();

    cy.get('ion-loading').should('be.visible');
  });

  it('should present a modal', () => {
    cy.get('button#open-modal').click();

    cy.get('ion-modal app-dialog-content').should('be.visible');
  });

  it('should present a picker', () => {
    cy.get('button#open-picker').click();

    cy.get('ion-picker-legacy .picker-button').should('be.visible');
  });

  it('should present a popover', () => {
    cy.get('button#open-popover').click();

    cy.get('ion-popover app-dialog-content').should('be.visible');
  });
});
