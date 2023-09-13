describe('overlays - keepContentsMounted', () => {
  beforeEach(() => {
    cy.viewport(1000, 900);
    cy.visit('/keep-contents-mounted')
  })
  describe('modal', () => {
    it('should not mount component if false', () => {
      cy.get('ion-modal#default-modal ion-content').should('not.exist');
    });

    it('should mount component if true', () => {
      cy.get('ion-modal#auto-mount-modal ion-content').should('exist');
    });

    it('should keep component mounted after dismissing if true', () => {
      cy.get('#open-auto-mount-modal').click();

      cy.get('ion-modal#auto-mount-modal ion-content').should('exist');

      cy.get('ion-modal#auto-mount-modal #dismiss').click();

      cy.get('ion-modal#auto-mount-modal')
        .should('not.be.visible')
        .should('have.class', 'overlay-hidden');

      cy.get('ion-modal#auto-mount-modal ion-content').should('exist');
    });

    it('should mount content if passed as attribute', () => {
      cy.get('ion-modal#auto-mount-modal-attribute ion-content').should('exist');
    });
  })
  describe('popover', () => {
    it('should not mount component if false', () => {
      cy.get('ion-popover#default-popover ion-content').should('not.exist');
    });

    it('should mount component if true', () => {
      cy.get('ion-popover#auto-mount-popover ion-content').should('exist');
    });

    it('should keep component mounted after dismissing if true', () => {
      cy.get('#open-auto-mount-popover').click();

      cy.get('ion-popover#auto-mount-popover ion-content').should('exist');

      cy.get('ion-popover#auto-mount-popover #dismiss').click();

      cy.get('ion-popover#auto-mount-popover')
        .should('not.be.visible')
        .should('have.class', 'overlay-hidden');

      cy.get('ion-popover#auto-mount-popover ion-content').should('exist');
    });
  })
})
