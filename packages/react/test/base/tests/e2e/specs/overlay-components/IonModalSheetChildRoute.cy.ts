/**
 * Tests for sheet modals in child routes with showBackdrop=false.
 * See https://github.com/ionic-team/ionic-framework/issues/30700
 */
describe('IonModal: Sheet in Child Route with Nested Routing', () => {
  beforeEach(() => {
    cy.visit('/overlay-components/modal-sheet-child-route/child');
  });

  it('should render parent content and child modal', () => {
    cy.get('#increment-btn').should('exist');
    cy.get('#decrement-btn').should('exist');
    cy.get('#background-action-count').should('have.text', '0');
    cy.get('ion-modal.show-modal').should('exist');
    cy.get('#modal-content-loaded').should('exist');
  });

  it('should allow interacting with parent content while modal is open in child route', () => {
    // Wait for modal to be presented
    cy.get('ion-modal.show-modal').should('exist');

    // Click the increment button in the parent content
    cy.get('#increment-btn').click();
    cy.get('#background-action-count').should('have.text', '1');
  });

  it('should allow multiple interactions with parent content while modal is open', () => {
    cy.get('ion-modal.show-modal').should('exist');

    cy.get('#increment-btn').click();
    cy.get('#increment-btn').click();
    cy.get('#background-action-count').should('have.text', '2');

    cy.get('#decrement-btn').click();
    cy.get('#background-action-count').should('have.text', '1');
  });
});
