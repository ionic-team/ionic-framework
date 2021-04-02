describe('input: spec', () => {
  beforeEach(() => {
    cy.visit('components/input/test/spec?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-input').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});

describe('input: spec, rtl', () => {
  beforeEach(() => {
    cy.visit('components/input/test/spec?ionic:_testing=true&rtl=true');
  })

  it('should render', () => {
    cy.get('ion-input').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
