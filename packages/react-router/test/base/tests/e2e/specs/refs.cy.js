const port = 3000;

describe("Refs", () => {
  /*
    This spec tests that refs and props get correctly set on ionic components
  */

  it("/refs, when ref is used on an FC, className should be added to ionic component", () => {
    cy.visit(`http://localhost:${port}/refs`);
    cy.ionPageVisible("refs-fc");
    cy.get(".ref-test");
  });


  it("/refs/class, when ref is used on a Class, className should be added to ionic component", () => {
    cy.visit(`http://localhost:${port}/refs/class`);
    cy.ionPageVisible("refs-class");
    cy.get(".ref-test");
  });
});
