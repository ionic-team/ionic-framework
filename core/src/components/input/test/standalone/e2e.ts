describe('input: standalone', () => {
  beforeEach(() => {
    cy.visit('components/input/test/standalone?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-input').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
