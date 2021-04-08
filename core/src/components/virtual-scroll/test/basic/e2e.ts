describe('virtual-scroll: basic', () => {
  beforeEach(() => {
    cy.visit('components/virtual-scroll/test/basic?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-virtual-scroll').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
