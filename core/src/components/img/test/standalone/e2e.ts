describe('img: standalone', () => {
  beforeEach(() => {
    cy.visit('components/img/test/standalone?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-img').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
