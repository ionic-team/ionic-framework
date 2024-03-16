it("should be on Angular 17", () => {
  cy.visit('/lazy');

  cy.get('ion-title').contains('Angular 17');
});
