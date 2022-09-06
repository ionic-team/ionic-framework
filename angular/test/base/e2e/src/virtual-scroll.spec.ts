describe('Virtual Scroll', () => {
  beforeEach(() => {
    cy.visit('/virtual-scroll');
    cy.wait(30);
  })

  it('should open virtual-scroll', () => {
    cy.get('ion-virtual-scroll > *').its('length').should('be.gt', 0);
  });
});

