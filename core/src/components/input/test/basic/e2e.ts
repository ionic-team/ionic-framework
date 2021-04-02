describe('input: basic', () => {
  beforeEach(() => {
    cy.visit('components/input/test/basic?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-input').should('have.class', 'hydrated');

    // cy.screenshot();
  });

  it('should focus item with lines full', () => {
    cy.get('[data-cy="input-full"]').click();

    cy.get('[data-cy="item-full"]').should('have.class', 'item-has-focus');

    // cy.screenshot();
  });

  it('should focus item with lines inset', () => {
    cy.get('[data-cy="input-inset"]').click();

    cy.get('[data-cy="item-inset"]').should('have.class', 'item-has-focus');

    // cy.screenshot();
  });

  it('should focus item with lines none', () => {
    cy.get('[data-cy="input-none"]').click();

    cy.get('[data-cy="item-none"]').should('have.class', 'item-has-focus');

    // cy.screenshot();
  });
});
