describe('toggle: sizes', () => {
  beforeEach(() => {
    cy.visit('components/toggle/test/sizes?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-toggle').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});

describe('toggle: sizes, rtl', () => {
  beforeEach(() => {
    cy.visit('components/toggle/test/sizes?ionic:_testing=true&rtl=true');
  })

  it('should render', () => {
    cy.get('ion-toggle').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
