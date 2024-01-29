describe('Navigation', () => {
  beforeEach(() => {
    cy.visit('/lazy/navigation/page1?ionic:_testing=true');
  })

  it('should navigate correctly', () => {
    cy.testStack('ion-router-outlet', ['app-navigation-page2', 'app-navigation-page1']);

    cy.get('app-navigation-page2').should('have.attr', 'aria-hidden').and('equal', 'true');
    cy.get('app-navigation-page2').should('have.attr', 'class').and('equal', 'ion-page ion-page-hidden');

    cy.get('app-navigation-page1').should('not.have.attr', 'aria-hidden');
    cy.get('app-navigation-page1').should('have.attr', 'class').and('equal', 'ion-page can-go-back');
  });
})

