describe('item: icons', () => {
  beforeEach(() => {
    cy.visit('components/item/test/icons?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-item').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});

describe('item: icons, rtl', () => {
  beforeEach(() => {
    cy.visit('components/item/test/icons?ionic:_testing=true&rtl=true');
  })

  it('should render', () => {
    cy.get('ion-item').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
