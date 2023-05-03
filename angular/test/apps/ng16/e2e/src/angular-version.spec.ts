it("should be on Angular 16", () => {
  cy.visit('/');

  cy.get('ion-title').contains('Angular 16');
});
