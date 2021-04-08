describe('tabs: standalone', () => {
  beforeEach(() => {
    cy.visit('components/tabs/test/standalone?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-tabs').should('have.class', 'hydrated');

    // cy.screenshot();
  });

  it('should go to tab one', () => {
    cy.get('#tab-button-tab-one').click();

    // cy.screenshot();
  });

  it('should go to tab two', () => {
    cy.get('#tab-button-tab-two').click();

    // cy.screenshot();
  });
});
