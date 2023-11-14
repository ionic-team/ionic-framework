describe('Picker Controller', () => {
  beforeEach(() => {
    cy.visit('/standalone/overlay-controllers');
  });

  it('should open a picker', () => {
    cy.get('button#open-picker').click();

    cy.get('ion-picker').should('be.visible');
  });
});
