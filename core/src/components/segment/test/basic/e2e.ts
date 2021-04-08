describe('segment: basic', () => {
  beforeEach(() => {
    cy.visit('components/segment/test/basic?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-segment').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});

describe('segment: basic, rtl', () => {
  beforeEach(() => {
    cy.visit('components/segment/test/basic?ionic:_testing=true&rtl=true');
  })

  it('should render', () => {
    cy.get('ion-segment').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
