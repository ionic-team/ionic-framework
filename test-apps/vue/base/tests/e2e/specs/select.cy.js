describe("Components: Select", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8080/components/select");
  });

  it("should open a popover overlay interface", () => {
    cy.get("#select-popover").click();
    cy.get("ion-popover").should("exist").should("be.visible");
  });
});
