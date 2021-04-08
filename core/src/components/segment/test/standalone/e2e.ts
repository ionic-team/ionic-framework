describe('segment: standalone', () => {
  beforeEach(() => {
    cy.visit('components/segment/test/standalone?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-segment').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
