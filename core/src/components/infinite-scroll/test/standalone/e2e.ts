describe('infinite-scroll: standalone', () => {
  beforeEach(() => {
    cy.visit('components/infinite-scroll/test/standalone?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-infinite-scroll').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
