describe('Nested', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/nested');
  });

  it('should show first page', () => {
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
    cy.ionPageVisible('nestedchild');

    cy.get('#nested-tabs').click();

    cy.ionPageHidden('routeroutlet');
    cy.ionPageVisible('tab1');

    cy.ionBackClick('tab1');

    cy.ionPageDoesNotExist('tab1');
    cy.ionPageVisible('routeroutlet');
  });
})
