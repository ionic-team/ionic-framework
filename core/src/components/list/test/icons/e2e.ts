describe('list: icons', () => {
  beforeEach(() => {
    cy.visit('components/list/test/icons?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-list').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
