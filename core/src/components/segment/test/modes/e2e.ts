describe('segment: modes', () => {
  beforeEach(() => {
    cy.visit('components/segment/test/modes?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-segment').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
