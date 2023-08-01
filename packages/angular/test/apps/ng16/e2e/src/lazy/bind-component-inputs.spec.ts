it("binding route data to inputs should work", () => {
  cy.visit('/lazy/version-test/bind-route/test?query=test');

  cy.get('#route-params').contains('test');
  cy.get('#query-params').contains('test');
  cy.get('#data').contains('data:bindToComponentInputs');
  cy.get('#resolve').contains('resolve:bindToComponentInputs');
});
