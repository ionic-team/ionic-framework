it("should be on Angular 15", () => {
  cy.visit('/');

  cy.get('ion-title').contains('Angular 15');
});
