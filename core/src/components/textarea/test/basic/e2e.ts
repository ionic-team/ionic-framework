describe('textarea: basic', () => {
  beforeEach(() => {
    cy.visit('components/textarea/test/basic?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-textarea').should('have.class', 'hydrated');

    // cy.screenshot();
  });

  it('should change value', () => {
    cy.get('#timeout').should('have.value', 'timeout');

    // cy.screenshot();
  });
});
