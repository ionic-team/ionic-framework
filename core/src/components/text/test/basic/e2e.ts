describe('text: basic', () => {
  beforeEach(() => {
    cy.visit('components/text/test/basic?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-text').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
