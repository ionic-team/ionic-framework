describe('toolbar: basic', () => {
  beforeEach(() => {
    cy.visit('components/toolbar/test/basic?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-toolbar').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});

describe('toolbar: basic, rtl', () => {
  beforeEach(() => {
    cy.visit('components/toolbar/test/basic?ionic:_testing=true&rtl=true');
  })

  it('should render', () => {
    cy.get('ion-toolbar').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
