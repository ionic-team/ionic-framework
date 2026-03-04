const port = 3000;

describe('Nested Params', () => {
  /*
    Tests that route params are correctly passed to nested routes
    when using parameterized wildcard routes (e.g., user/:userId/*).
  */

  it('/nested-params > Landing page should be visible', () => {
    cy.visit(`http://localhost:${port}/nested-params`);
    cy.ionPageVisible('nested-params-landing');
  });

  it('/nested-params > Navigate to user details > Params should be available', () => {
    cy.visit(`http://localhost:${port}/nested-params`);
    cy.ionPageVisible('nested-params-landing');

    cy.get('#go-to-user-42').click();

    cy.get('[data-testid="user-layout-param"]').should('contain', 'Layout sees user: 42');
    cy.get('[data-testid="user-details-param"]').should('contain', 'Details view user: 42');
  });

  it('/nested-params > Navigate between sibling routes > Params should be maintained', () => {
    cy.visit(`http://localhost:${port}/nested-params`);
    cy.ionPageVisible('nested-params-landing');

    // Navigate to user 42 details
    cy.get('#go-to-user-42').click();
    cy.get('[data-testid="user-layout-param"]').should('contain', 'Layout sees user: 42');
    cy.get('[data-testid="user-details-param"]').should('contain', 'Details view user: 42');

    // Navigate to settings (sibling route)
    cy.get('#go-to-settings').click();
    cy.get('[data-testid="user-layout-param"]').should('contain', 'Layout sees user: 42');
    cy.get('[data-testid="user-settings-param"]').should('contain', 'Settings view user: 42');

    // Navigate back to details
    cy.contains('ion-button', 'Back to Details').click();
    cy.get('[data-testid="user-layout-param"]').should('contain', 'Layout sees user: 42');
    cy.get('[data-testid="user-details-param"]').should('contain', 'Details view user: 42');
  });

  it('/nested-params > Direct navigation to nested route > Params should be available', () => {
    // Navigate directly to a nested route with params
    cy.visit(`http://localhost:${port}/nested-params/user/123/settings`);

    cy.get('[data-testid="user-layout-param"]').should('contain', 'Layout sees user: 123');
    cy.get('[data-testid="user-settings-param"]').should('contain', 'Settings view user: 123');
  });

  it('/nested-params > Different users should have different params', () => {
    cy.visit(`http://localhost:${port}/nested-params`);
    cy.ionPageVisible('nested-params-landing');

    // Navigate to user 42
    cy.get('#go-to-user-42').click();
    cy.get('[data-testid="user-layout-param"]').should('contain', 'Layout sees user: 42');
    cy.get('[data-testid="user-details-param"]').should('contain', 'Details view user: 42');

    // Go back to landing
    cy.go('back');
    cy.ionPageVisible('nested-params-landing');

    // Navigate to user 99
    cy.get('#go-to-user-99').click();
    cy.get('[data-testid="user-layout-param"]').should('contain', 'Layout sees user: 99');
    cy.get('[data-testid="user-details-param"]').should('contain', 'Details view user: 99');
  });
});
