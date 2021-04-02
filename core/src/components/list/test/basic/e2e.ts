describe('list: basic', () => {
  beforeEach(() => {
    cy.visit('components/list/test/basic?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-list').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
