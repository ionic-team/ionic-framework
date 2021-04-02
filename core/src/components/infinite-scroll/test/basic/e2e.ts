describe('infinite-scroll: basic', () => {
  beforeEach(() => {
    cy.visit('components/infinite-scroll/test/basic?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-infinite-scroll').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
