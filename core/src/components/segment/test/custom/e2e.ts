describe('segment: custom', () => {
  beforeEach(() => {
    cy.visit('components/segment/test/custom?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-segment').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
