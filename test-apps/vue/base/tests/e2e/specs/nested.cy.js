describe('Nested', () => {
  beforeEach(() => {
    cy.visit('/nested');
    cy.ionPageVisible('nestedchild');
  });

  it('should go to second page', () => {
    cy.get('#nested-child-two').click();
    cy.ionPageVisible('nestedchildtwo');
    cy.ionPageHidden('nestedchild');
  });

  it('should go back to first page', () => {
    cy.get('#nested-child-two').click();
    cy.ionBackClick('nestedchildtwo');
    cy.ionPageVisible('nestedchild');
  });

  it('should go navigate across nested outlet contexts', () => {
    cy.get('#nested-tabs').click();

    cy.ionPageHidden('routeroutlet');
    cy.ionPageVisible('tab1');

    cy.ionBackClick('tab1');

    cy.ionPageDoesNotExist('tab1');
    cy.ionPageVisible('routeroutlet');
  });
})

describe('Nested - Replace', () => {
  it('should replace a route but still be able to go back to main outlet', () => {
    cy.visit('/');
    cy.ionPageVisible('home');

    cy.routerPush('/nested');
    cy.ionPageHidden('home');
    cy.ionPageVisible('nestedchild');

    cy.routerReplace('/nested/two');
    cy.ionPageDoesNotExist('nestedchild');
    cy.ionPageVisible('nestedchildtwo');

    /**
     * ionBackClick does not handle nested pages
     * with multiple back buttons
     */
    cy.get('#routeroutlet-back-button').click();
    cy.ionPageDoesNotExist('nestedchildtwo');
    cy.ionPageVisible('home');
  })
})
