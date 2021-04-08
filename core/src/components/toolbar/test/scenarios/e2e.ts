describe('toolbar: scenarios', () => {
  beforeEach(() => {
    cy.visit('components/toolbar/test/scenarios?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-toolbar').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});

describe('toolbar: scenarios, rtl', () => {
  beforeEach(() => {
    cy.visit('components/toolbar/test/scenarios?ionic:_testing=true&rtl=true');
  })

  it('should render', () => {
    cy.get('ion-toolbar').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
