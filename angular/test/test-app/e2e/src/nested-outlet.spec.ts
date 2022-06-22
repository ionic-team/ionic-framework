describe('Nested Outlet', () => {
  beforeEach(() => {
    cy.visit('/nested-outlet/page');
  })

  it('should navigate correctly', () => {
    cy.get('ion-router-outlet ion-router-outlet app-nested-outlet-page h1').should('have.text', 'Nested page 1');

    cy.get('#goto-tabs').click();

    cy.ionPageVisible('app-tabs');
    cy.ionPageVisible('app-tabs-tab1');

    cy.get('#goto-nested-page1').click();

    cy.ionPageVisible('app-nested-outlet-page');
    cy.ionPageDoesNotExist('app-tabs');

    cy.get('#goto-nested-page2').click();
    cy.ionPageVisible('app-nested-outlet-page2');

    cy.get('ion-router-outlet ion-router-outlet app-nested-outlet-page2 h1').should('have.text', 'Nested page 2');

    cy.get('#goto-nested-page1').click();
    cy.ionPageVisible('app-nested-outlet-page');

    cy.get('#goto-nested-page2').click();
  });

});

