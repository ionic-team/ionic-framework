describe('button: icon', () => {
  beforeEach(() => {
    cy.visit('components/button/test/icon?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-button').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
