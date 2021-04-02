describe('item-divider: spec', () => {
  beforeEach(() => {
    cy.visit('components/item-divider/test/spec?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-item-divider').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});

describe('item-divider: spec, rtl', () => {
  beforeEach(() => {
    cy.visit('components/item-divider/test/spec?ionic:_testing=true&rtl=true');
  })

  it('should render', () => {
    cy.get('ion-item-divider').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
