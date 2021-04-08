describe('tabs: basic', () => {
  beforeEach(() => {
    cy.visit('components/tabs/test/basic?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-tabs').should('have.class', 'hydrated');

    // cy.screenshot();
  });

  it('should go to tab two', () => {
    cy.get('[data-cy="e2eTabTwoButton"]').click();

    // cy.screenshot();
  });

  it('should not go to tab three', () => {
    cy.get('[data-cy="e2eTabThreeButton"]').click({ force: true });

    // cy.screenshot();
  });

  it('should go to tab four', () => {
    cy.get('[data-cy="e2eTabFourButton"]').click();

    // cy.screenshot();
  });
});
