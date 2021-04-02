describe('item: states', () => {
  beforeEach(() => {
    cy.visit('components/item/test/states?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-item').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
