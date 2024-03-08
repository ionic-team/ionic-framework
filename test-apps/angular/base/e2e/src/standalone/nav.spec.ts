describe('Nav', () => {
  beforeEach(() => {
    cy.visit('/standalone/nav');
  })

  it('should mount the root component', () => {
    cy.ionPageVisible('app-nav');

    cy.contains('Page One');
  });
})
