describe('item: dividers', () => {
  beforeEach(() => {
    cy.visit('components/item/test/dividers?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-item').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
