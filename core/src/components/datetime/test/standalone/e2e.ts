describe('datetime: standalone', () => {
  beforeEach(() => {
    cy.visit('components/datetime/test/standalone?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-datetime').should('have.class', 'hydrated');

    // cy.screenshot();
  });

  it('should open the basic picker', () => {
    cy.get('#basic').click();

    cy.get('ion-picker').should('be.visible');

    // cy.screenshot();
  });

  it('should click the "October" option', () => {
    cy.get('#basic').click();

    cy.get('ion-picker').should('be.visible');

    cy.contains('October').click();

    // cy.screenshot();
  });
});
