describe('img: basic', () => {
  beforeEach(() => {
    cy.visit('components/img/test/basic?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-img').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
