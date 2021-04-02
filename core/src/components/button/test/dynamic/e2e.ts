describe('button: dynamic', () => {
  beforeEach(() => {
    cy.visit('components/button/test/dynamic?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-button').should('have.class', 'hydrated');

    // cy.screenshot();
  });

  it('should add item button', () => {
    cy.get('[data-cy="add-item-button"]').click();

    // cy.screenshot();
  });

  it('should add item divider button', () => {
    cy.get('[data-cy="add-item-divider-button"]').click();

    // cy.screenshot();
  });

  it('should change item button', () => {
    cy.get('[data-cy="change-item-button"]').click();

    // cy.screenshot();
  });

  it('should change item divider button', () => {
    cy.get('[data-cy="change-item-divider-button"]').click();

    // cy.screenshot();
  });
});
