describe('segment: toolbar', () => {
  beforeEach(() => {
    cy.visit('components/segment/test/toolbar?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-segment').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});

describe('segment: toolbar, rtl', () => {
  beforeEach(() => {
    cy.visit('components/segment/test/toolbar?ionic:_testing=true&rtl=true');
  })

  it('should render', () => {
    cy.get('ion-segment').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
