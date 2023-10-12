describe('Router Outlet', () => {
  beforeEach(() => {
    cy.visit('/standalone/router-outlet');
  })

  it('should render a as a child page of the router outlet', () => {
    cy.ionPageVisible('ion-router-outlet app-router-outlet');
  });
})
