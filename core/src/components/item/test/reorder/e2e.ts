describe('item: reorder', () => {
  beforeEach(() => {
    cy.visit('components/item/test/reorder?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-item').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
