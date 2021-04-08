describe('toggle: basic', () => {
  beforeEach(() => {
    cy.visit('components/toggle/test/basic?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-toggle').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});

describe('toggle: basic, rtl', () => {
  beforeEach(() => {
    cy.visit('components/toggle/test/basic?ionic:_testing=true&rtl=true');
  })

  it('should render', () => {
    cy.get('ion-toggle').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
