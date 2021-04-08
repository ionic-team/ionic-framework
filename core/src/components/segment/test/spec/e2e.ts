describe('segment: spec', () => {
  beforeEach(() => {
    cy.visit('components/segment/test/spec?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-segment').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});

describe('segment: spec, rtl', () => {
  beforeEach(() => {
    cy.visit('components/segment/test/spec?ionic:_testing=true&rtl=true');
  })

  it('should render', () => {
    cy.get('ion-segment').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
