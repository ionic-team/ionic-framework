describe('toolbar: title', () => {
  beforeEach(() => {
    cy.visit('components/toolbar/test/title?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-toolbar').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});

describe('toolbar: title, rtl', () => {
  beforeEach(() => {
    cy.visit('components/toolbar/test/title?ionic:_testing=true&rtl=true');
  })

  it('should render', () => {
    cy.get('ion-toolbar').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
