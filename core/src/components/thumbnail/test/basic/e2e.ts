describe('thumbnail: basic', () => {
  beforeEach(() => {
    cy.visit('components/thumbnail/test/basic?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-thumbnail').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
