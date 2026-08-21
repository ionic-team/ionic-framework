describe('IonModal: nested overlay hidden by a Suspense boundary', () => {
  beforeEach(() => {
    cy.visit('/overlay-components/modal-suspense');

    cy.get('#open-suspense-outer-modal').click();
    cy.get('#suspense-outer-modal').should('be.visible');
  });

  it('should present the nested modal after its contents suspend', () => {
    cy.get('#open-suspense-nested-modal').click();

    // The nested modal's contents suspend as `present()` mounts them, which
    // hides the boundary and runs `componentWillUnmount` on the wrapper.
    cy.get('#suspense-fallback').should('exist');

    // The reveal has to bring the presenting overlay back.
    cy.get('#suspense-nested-modal').should('be.visible');
    cy.get('#nested-modal-contents').should('be.visible');
  });

  it('should dismiss the nested modal after the reveal', () => {
    cy.get('#open-suspense-nested-modal').click();
    cy.get('#nested-modal-contents').should('be.visible');

    cy.get('#close-suspense-nested-modal').click();

    // The dismiss lifecycle still reaches the app.
    cy.get('#suspense-nested-modal').should('not.be.visible');
    cy.get('#nested-modal-dismiss-count').should('have.text', '1');
    cy.get('#suspense-outer-modal').should('be.visible');
  });

  it('should keep the nested modal on top after the reveal', () => {
    cy.get('#open-suspense-nested-modal').click();
    cy.get('#nested-modal-contents').should('be.visible');

    /**
     * `getPresentedOverlay` takes the last match in document order, so the
     * overlay restored after the reveal has to keep its place in `ion-app`.
     * If it moves, Escape, hardware back and the focus trap start acting on
     * the outer modal instead.
     */
    cy.get('ion-app ion-modal').last().should('have.id', 'suspense-nested-modal');

    cy.get('body').type('{esc}');

    cy.get('#suspense-nested-modal').should('not.be.visible');
    cy.get('#nested-modal-dismiss-count').should('have.text', '1');
    cy.get('#suspense-outer-modal').should('be.visible');
  });
});
