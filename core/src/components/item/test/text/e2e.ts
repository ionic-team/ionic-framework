describe('item: text', () => {
  beforeEach(() => {
    cy.visit('components/item/test/text?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-item').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
