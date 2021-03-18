describe('Nested Outlet', () => {
  beforeEach(() => {
    cy.visit('/nested-outlet/page');
  })

  it('should navigate correctly', () => {
    cy.get('ion-router-outlet ion-router-outlet app-nested-outlet-page h1').should('have.text', 'Nested page 1');

    cy.get('#goto-tabs').click();
    cy.wait(500);
    cy.get('#goto-nested-page1').click();
    cy.wait(500);
    cy.get('#goto-nested-page2').click();
    cy.wait(500);

    cy.get('ion-router-outlet ion-router-outlet app-nested-outlet-page2 h1').should('have.text', 'Nested page 2');
  });
});

