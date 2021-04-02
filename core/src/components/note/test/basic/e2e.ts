describe('note: basic', () => {
  beforeEach(() => {
    cy.visit('components/note/test/basic?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-note').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
