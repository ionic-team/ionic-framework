describe('Routing with Standalone Components', () => {
  beforeEach(() => {
    cy.visit('/version-test/standalone');
  });

  it('should render the component', () => {
    cy.get('ion-content').contains('This is a standalone component rendered from a route.');
  });
});
