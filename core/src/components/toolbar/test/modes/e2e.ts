describe('toolbar: modes', () => {
  beforeEach(() => {
    cy.visit('components/toolbar/test/modes?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-toolbar').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});

describe('toolbar: modes, rtl', () => {
  beforeEach(() => {
    cy.visit('components/toolbar/test/modes?ionic:_testing=true&rtl=true');
  })

  it('should render', () => {
    cy.get('ion-toolbar').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
