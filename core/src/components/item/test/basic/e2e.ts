describe('item: basic', () => {
  beforeEach(() => {
    cy.visit('components/item/test/basic?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-item').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});

describe('item: basic, rtl', () => {
  beforeEach(() => {
    cy.visit('components/item/test/basic?ionic:_testing=true&rtl=true');
  })

  it('should render', () => {
    cy.get('ion-item').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
