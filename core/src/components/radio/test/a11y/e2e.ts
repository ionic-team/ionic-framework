describe('radio: a11y', () => {
  beforeEach(() => {
    cy.visit('components/radio/test/a11y?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-radio').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});

describe('radio: a11y, rtl', () => {
  beforeEach(() => {
    cy.visit('components/radio/test/a11y?ionic:_testing=true&rtl=true');
  })

  it('should render', () => {
    cy.get('ion-radio').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
