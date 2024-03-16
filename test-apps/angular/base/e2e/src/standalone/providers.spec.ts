describe('Providers', () => {
  beforeEach(() => {
    cy.visit('/standalone/providers');
  })

  it('provideIonicAngular should initialize Ionic and set config correctly', () => {
    cy.ionPageVisible('app-providers');

    cy.get('#keyboard-height').should('have.text', '12345');
  });
})
