describe('Routing', () => {
  beforeEach(() => {
    cy.visit('/router-link?ionic:mode=ios');
  })

  it('should swipe and abort', () => {
    cy.get('#routerLink').click();
    cy.wait(500);

    cy.ionSwipeToGoBack();
    cy.wait(500);

    cy.get('app-router-link').should('have.attr', 'aria-hidden').and('equal', 'true');
    cy.get('app-router-link').should('have.attr', 'class').and('equal', 'ion-page ion-page-hidden');

    cy.get('app-router-link-page').should('not.have.attr', 'aria-hidden');
    cy.get('app-router-link-page').should('have.attr', 'class').and('equal', 'ion-page can-go-back');
  });

  it('should swipe and go back', () => {
    cy.get('#routerLink').click();
    cy.wait(500);
    cy.testStack('ion-router-outlet', ['app-router-link', 'app-router-link-page']);

    cy.ionSwipeToGoBack(true);
    cy.wait(1000);
    cy.testStack('ion-router-outlet', ['app-router-link']);

    cy.get('app-router-link').should('not.have.attr', 'aria-hidden');
    cy.get('app-router-link').should('have.attr', 'class').and('equal', 'ion-page');
  });
})
