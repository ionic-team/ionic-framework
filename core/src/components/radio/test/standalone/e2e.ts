describe('radio: standalone', () => {
  beforeEach(() => {
    cy.visit('components/radio/test/standalone?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-radio').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
