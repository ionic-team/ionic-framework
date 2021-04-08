describe('toolbar: custom', () => {
  beforeEach(() => {
    cy.visit('components/toolbar/test/custom?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-toolbar').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});

describe('toolbar: custom, rtl', () => {
  beforeEach(() => {
    cy.visit('components/toolbar/test/custom?ionic:_testing=true&rtl=true');
  })

  it('should render', () => {
    cy.get('ion-toolbar').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
