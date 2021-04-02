describe('infinite-scroll: top', () => {
  beforeEach(() => {
    cy.visit('components/infinite-scroll/test/top?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-infinite-scroll').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
