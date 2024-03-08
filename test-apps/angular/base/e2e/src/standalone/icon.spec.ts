describe('Icons', () => {
  it('should render an icon', () => {
    cy.visit('/standalone/icon');

    cy.get('ion-icon#icon-string').shadow().find('svg').should('exist');
    cy.get('ion-icon#icon-binding').shadow().find('svg').should('exist');
  });

  it('should render an icon on iOS mode', () => {
    cy.visit('/standalone/icon?ionic:mode=ios');

    cy.get('ion-icon#icon-mode').shadow().find('svg').should('exist');
  });

  it('should render an icon on MD mode', () => {
    cy.visit('/standalone/icon?ionic:mode=md');

    cy.get('ion-icon#icon-mode').shadow().find('svg').should('exist');
  });
});
