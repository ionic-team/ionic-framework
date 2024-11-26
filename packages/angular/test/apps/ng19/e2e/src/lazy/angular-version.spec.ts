it("should be on Angular 19", () => {
  cy.visit('/lazy');

  cy.get('ion-title').contains('Angular 19');
});
