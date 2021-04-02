describe('item: disabled', () => {
  beforeEach(() => {
    cy.visit('components/item/test/disabled?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-item').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});

describe('item: disabled, rtl', () => {
  beforeEach(() => {
    cy.visit('components/item/test/disabled?ionic:_testing=true&rtl=true');
  })

  it('should render', () => {
    cy.get('ion-item').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
