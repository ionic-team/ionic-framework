describe('virtual-scroll: cards', () => {
  beforeEach(() => {
    cy.visit('components/virtual-scroll/test/cards?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-virtual-scroll').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
