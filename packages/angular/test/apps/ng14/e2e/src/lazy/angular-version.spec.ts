it("should be on Angular 14", () => {
  cy.visit('/lazy');

  cy.get('ion-title').contains('Angular 14');
});
