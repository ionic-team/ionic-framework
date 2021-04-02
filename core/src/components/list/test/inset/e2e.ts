describe('list: inset', () => {
  beforeEach(() => {
    cy.visit('components/list/test/inset?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-list').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
