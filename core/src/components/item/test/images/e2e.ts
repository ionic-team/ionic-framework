describe('item: images', () => {
  beforeEach(() => {
    cy.visit('components/item/test/images?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-item').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
