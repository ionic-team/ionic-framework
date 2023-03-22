describe('Icons', () => {
  it('should use ios svg', () => {
    cy.visit('/icons?ionic:mode=ios');

    cy.get('#customSvg').shadow().find('svg').should('have.class', 'ios');
    cy.get('#customSvg').shadow().find('svg').should('have.class', 'apple');
  });

  it('should use md svg', () => {
    cy.visit('/icons?ionic:mode=md');

    cy.get('#customSvg').shadow().find('svg').should('have.class', 'md');
    cy.get('#customSvg').shadow().find('svg').should('have.class', 'android');
  });

  it('should use fallback md svg', () => {
    cy.visit('/icons');

    cy.get('#customSvg').shadow().find('svg').should('have.class', 'md');
    cy.get('#customSvg').shadow().find('svg').should('have.class', 'android');
  });
})
