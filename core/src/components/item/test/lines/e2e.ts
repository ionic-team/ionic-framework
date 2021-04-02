describe('item: lines', () => {
  beforeEach(() => {
    cy.visit('components/item/test/lines?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-item').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
