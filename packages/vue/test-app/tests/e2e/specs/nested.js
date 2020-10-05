describe('Inputs', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/nested');
  });

  it('should show first page', () => {
    cy.ionPageVisible('nestedchild');
  });

  it.skip('should go to second page', () => {
    cy.get('#nested-child-two').click();
    cy.ionPageVisible('nestedchildtwo');
    cy.ionPageInvisible('nestedchild');
  });

  it.skip('should go back to first page', () => {
    cy.get('#nested-child-two').click();
    cy.ionBackClick('nestedchildtwo');
    cy.ionPageVisible('nestedchild');
  });
})
