describe('thumbnail: standalone', () => {
  beforeEach(() => {
    cy.visit('components/thumbnail/test/standalone?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-thumbnail').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
