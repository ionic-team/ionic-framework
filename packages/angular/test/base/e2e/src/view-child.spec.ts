describe('View Child', () => {
  beforeEach(() => {
    cy.visit('/lazy/view-child');
  })

  it('should get a reference to all children', () => {
    // button should be red
    cy.get('#color-button').should('have.class', 'ion-color-danger');

    // tabs should be found
    cy.get('#tabs-result').should('have.text', 'all found');
  });
});

