const port = 3000;

describe('Overlays', () => {
  it('should remove the overlay when going back to the previous route', () => {
    // Requires navigation history to perform a pop
    cy.visit(`http://localhost:${port}`);
    cy.visit(`http://localhost:${port}/overlays`);

    cy.get('#openModal').click();

    cy.get('ion-modal').should('exist');

    cy.get('#goBack').click();

    cy.get('ion-modal').should('not.exist');
  });

  it('should remove the overlay when pushing to a new route', () => {
    cy.visit(`http://localhost:${port}/overlays`);

    cy.get('#openModal').click();

    cy.get('ion-modal').should('exist');

    cy.get('#push').click();

    cy.get('ion-modal').should('not.exist');
  });

  it('should remove the overlay when replacing the route', () => {
    cy.visit(`http://localhost:${port}/overlays`);

    cy.get('#openModal').click();

    cy.get('ion-modal').should('exist');

    cy.get('#replace').click();

    cy.get('ion-modal').should('not.exist');
  });
});
