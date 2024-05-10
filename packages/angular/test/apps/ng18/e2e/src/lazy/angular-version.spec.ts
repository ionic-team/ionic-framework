it("should be on Angular 18", () => {
  cy.visit('/lazy');

  cy.get('ion-title').contains('Angular 18');
});
