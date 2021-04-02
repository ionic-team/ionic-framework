describe('item: media', () => {
  beforeEach(() => {
    cy.visit('components/item/test/media?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-item').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
