describe('item: alignment', () => {
  beforeEach(() => {
    cy.visit('components/item/test/alignment?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-item').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});

describe('item: alignment, rtl', () => {
  beforeEach(() => {
    cy.visit('components/item/test/alignment?ionic:_testing=true&rtl=true');
  })

  it('should render', () => {
    cy.get('ion-item').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
