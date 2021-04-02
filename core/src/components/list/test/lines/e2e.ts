describe('list: lines', () => {
  beforeEach(() => {
    cy.visit('components/list/test/lines?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-list').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
