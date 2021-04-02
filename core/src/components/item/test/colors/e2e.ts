describe('item: colors', () => {
  beforeEach(() => {
    cy.visit('components/item/test/colors?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-item').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
