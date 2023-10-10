describe('Providers', () => {
  beforeEach(() => {
    cy.visit('/lazy/providers');
  })

  it('should load all providers', () => {
    cy.get('#is-loaded').should('have.text', 'true');
    cy.get('#is-ready').should('have.text', 'true');
    cy.get('#is-paused').should('have.text', 'true');
    cy.get('#is-resumed').should('have.text', 'true');
    cy.get('#is-resized').should('have.text', 'true');
    cy.get('#is-testing').should('have.text', 'false');
    cy.get('#is-desktop').should('have.text', 'true');
    cy.get('#is-mobile').should('have.text', 'false');
    cy.get('#keyboard-height').should('have.text', '12345');
    cy.get('#query-params').should('have.text', 'firstParam: null, firstParam: null');
  });

  it('should detect testing mode', () => {
    cy.visit('/lazy/providers?ionic:_testing=true');

    cy.get('#is-testing').should('have.text', 'true');
  });

  it('should get query params', () => {
    cy.visit('/lazy/providers?firstParam=abc&secondParam=true');

    cy.get('#query-params').should('have.text', 'firstParam: abc, firstParam: true');
  })
});

