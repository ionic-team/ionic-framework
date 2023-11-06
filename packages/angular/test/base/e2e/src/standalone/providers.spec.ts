describe('Providers', () => {
  beforeEach(() => {
    cy.visit('/standalone/providers');
  })

  it('provideIonicAngular should initialize Ionic and set config correctly', () => {
    cy.ionPageVisible('app-providers');

    cy.get('#keyboard-height').should('have.text', '12345');
  });
})


describe('Providers: Platform', () => {
  beforeEach(() => {
    cy.visit('/standalone/providers/platform');
  });

  it('isReady should be true', () => {
    cy.ionPageVisible('app-platform');

    cy.get('#is-ready').should('have.text', 'true');
  });

});
