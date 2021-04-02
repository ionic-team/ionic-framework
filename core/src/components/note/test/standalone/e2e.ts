describe('note: standalone', () => {
  beforeEach(() => {
    cy.visit('components/note/test/standalone?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-note').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
