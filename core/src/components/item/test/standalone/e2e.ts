describe('item: standalone', () => {
  beforeEach(() => {
    cy.visit('components/item/test/standalone?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-item').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
