describe('range: basic', () => {
  beforeEach(() => {
    cy.visit('components/range/test/basic?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-range').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});

describe('range: basic, rtl', () => {
  beforeEach(() => {
    cy.visit('components/icon/test/basic?ionic:_testing=true&rtl=true');
  })

  it('should render', () => {
    cy.get('ion-icon').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
