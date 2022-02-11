describe('IonPage', () => {
  it('Inherits string object attribute while retaining ionic critical classes', () => {
    cy.visit('http://localhost:8080/ion-page-class-object');

    cy.get('.ion-page-additional-class').should('have.class', 'ion-page');

    cy.get('#navigation').click();

    cy.get('.ion-page-additional-class').should('have.class', 'ion-page-hidden');
  });

  it('Inherits string class attribute while retaining ionic critical classes', () => {
    cy.visit('http://localhost:8080/ion-page-class-string');

    cy.get('.ion-page-additional-class').should('have.class', 'ion-page');

    cy.get('#navigation').click();

    cy.get('.ion-page-additional-class').should('have.class', 'ion-page-hidden');
  });

  it('Correctly renders class attribute when no class attribute is set', () => {
    cy.visit('http://localhost:8080/ion-page-class-undefined');

    cy.get('.ion-page').should('not.have.class', 'undefined');
  });
});
