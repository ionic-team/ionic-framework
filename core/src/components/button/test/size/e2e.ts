describe('button: size', () => {
  beforeEach(() => {
    cy.visit('components/button/test/size?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-button').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
