it("should be on Angular 15", () => {
  cy.visit('/lazy');

  cy.get('ion-title').contains('Angular 15');
});
