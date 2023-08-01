it("should be on Angular 16", () => {
  cy.visit('/lazy');

  cy.get('ion-title').contains('Angular 16');
});
