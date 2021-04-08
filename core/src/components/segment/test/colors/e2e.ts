describe('segment: colors', () => {
  beforeEach(() => {
    cy.visit('components/segment/test/colors?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-segment').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});

describe('segment: colors, rtl', () => {
  beforeEach(() => {
    cy.visit('components/segment/test/colors?ionic:_testing=true&rtl=true');
  })

  it('should render', () => {
    cy.get('ion-segment').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
