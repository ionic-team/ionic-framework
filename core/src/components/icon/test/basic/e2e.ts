describe('icon: basic', () => {
  beforeEach(() => {
    cy.visit('components/icon/test/basic?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-icon').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
