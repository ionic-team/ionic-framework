describe('Popovers: Inline', () => {
  beforeEach(() => {
    cy.visit('/lazy/popover-inline');
  });

  it('should initially have no items', () => {
    cy.get('ion-button').click();

    cy.get('ion-popover').should('be.visible');
    cy.get('ion-list ion-item').should('not.exist');
  });

  it('should have items after 1500ms', () => {
    cy.get('ion-button').click();

    cy.get('ion-popover').should('be.visible');

    cy.wait(1500);

    cy.get('ion-list ion-item:nth-child(1)').should('have.text', 'A');
    cy.get('ion-list ion-item:nth-child(2)').should('have.text', 'B');
    cy.get('ion-list ion-item:nth-child(3)').should('have.text', 'C');
    cy.get('ion-list ion-item:nth-child(4)').should('have.text', 'D');
  });
});
