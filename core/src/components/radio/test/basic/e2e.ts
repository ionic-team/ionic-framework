describe('radio: basic', () => {
  beforeEach(() => {
    cy.visit('components/radio/test/basic?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-radio').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});

describe('radio: basic, rtl', () => {
  beforeEach(() => {
    cy.visit('components/icon/test/basic?ionic:_testing=true&rtl=true');
  })

  it('should render', () => {
    cy.get('ion-icon').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
