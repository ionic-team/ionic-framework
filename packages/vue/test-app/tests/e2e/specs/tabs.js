describe('Tabs', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080')
  })

  it('should be able to create and destroy tabs', () => {
    cy.get('#tabs').click();
    cy.ionPageVisible('tab1');

    cy.ionBackClick('tab1');
    cy.ionPageDoesNotExist('tabs');

    cy.get('#tabs').click();
    cy.ionPageVisible('tab1');

    cy.ionBackClick('tab1');
    cy.ionPageDoesNotExist('tabs');
  });
})
