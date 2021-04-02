describe('item: buttons', () => {
  beforeEach(() => {
    cy.visit('components/item/test/buttons?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-item').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
