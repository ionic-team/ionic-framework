it("should be on Angular 14", () => {
  cy.visit('/');

  cy.get('ion-title').contains('Angular 14');
});
