describe('list: standalone', () => {
  beforeEach(() => {
    cy.visit('components/list/test/standalone?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-list').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
