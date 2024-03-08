describe('Accordion', () => {
  beforeEach(() => {
    cy.visit('/lazy/accordions');
  });

  it('should correctly expand on multiple modal opens', () => {
    cy.get('#open-modal').click();

    cy.get('ion-accordion:first-of-type').should('have.class', 'accordion-expanded');
    cy.get('ion-accordion:last-of-type').should('not.have.class', 'accordion-expanded');

    cy.get('#dismiss').click();

    cy.get('#open-modal').click();

    cy.get('ion-accordion:first-of-type').should('have.class', 'accordion-expanded');
    cy.get('ion-accordion:last-of-type').should('not.have.class', 'accordion-expanded');
  });
});
