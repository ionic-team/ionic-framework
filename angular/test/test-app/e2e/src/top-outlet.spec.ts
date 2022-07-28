
describe('Top Router Outlet', () => {

  it('should pop to previous view when leaving tabs outlet', () => {
    cy.visit('/top-outlet/tabs/tab1/child1');

    cy.get('ion-title').should('contain.text', 'Item 1 Page');

    cy.get('#goToItem2Page').click();

    cy.get('ion-title').should('contain.text', 'Item 2 Page');

    cy.get('#goToGlobalPage').click();

    cy.get('ion-title').should('contain.text', 'Global Page');

    cy.get('#goToPage2').click();

    cy.get('ion-title').should('contain.text', 'Item 2 Page');

    cy.get('#goToPage1').click();

    cy.get('ion-title').should('contain.text', 'Item 1 Page');
  });

});
