it("should be on Angular 20", () => {
  cy.visit('/lazy');

  cy.get('ion-title').contains('Angular 20');
});
