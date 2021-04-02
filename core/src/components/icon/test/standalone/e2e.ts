describe('icon: standalone', () => {
  beforeEach(() => {
    cy.visit('components/icon/test/standalone?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-icon').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
