describe("Components: Breadcrumbs", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8080/components/breadcrumbs");
  });

  it("should have color attribute", () => {
    cy.get('ion-breadcrumbs#color').should('have.prop', 'color');
  });
});
