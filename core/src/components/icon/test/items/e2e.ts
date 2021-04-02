describe('icon: items', () => {
  beforeEach(() => {
    cy.visit('components/icon/test/items?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-icon').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
