describe('avatar: basic', () => {
  beforeEach(() => {
    cy.visit('components/avatar/test/basic?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-avatar').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
