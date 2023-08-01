describe('Router Outlet', () => {
  beforeEach(() => {
    cy.visit('/standalone/router-outlet');
  })

  it('should render a visible page', () => {
    cy.ionPageVisible('app-router-outlet');
  });
})
