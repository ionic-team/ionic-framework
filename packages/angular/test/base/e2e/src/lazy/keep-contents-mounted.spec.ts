describe('overlays - keepContentsMounted', () => {
  describe('modal', () => {
    it('should not mount component if false', () => {
      cy.visit('/lazy/modal-inline');

      cy.get('ion-modal ion-content').should('not.exist');
    });

    it('should mount component if true', () => {
      cy.visit('/lazy/keep-contents-mounted');

      cy.get('ion-modal ion-content').should('exist');
    });

    it('should keep component mounted after dismissing if true', () => {
      cy.visit('/lazy/keep-contents-mounted');

      cy.get('#open-modal').click();

      cy.get('ion-modal ion-content').should('exist');

      cy.get('ion-modal ion-button').click();

      cy.get('ion-modal')
        .should('not.be.visible')
        .should('have.class', 'overlay-hidden');

      cy.get('ion-modal ion-content').should('exist');
    });

    it('should has ion-delegate-host on mount', () => {
      cy.visit('/lazy/keep-contents-mounted');

      cy.get('ion-modal .ion-delegate-host').should('exist');
    });
  })
  describe('popover', () => {
    it('should not mount component if false', () => {
      cy.visit('/lazy/popover-inline');

      cy.get('ion-popover ion-content').should('not.exist');
    });

    it('should mount component if true', () => {
      cy.visit('/lazy/keep-contents-mounted');

      cy.get('ion-popover ion-content').should('exist');
    });

    it('should keep component mounted after dismissing if true', () => {
      cy.visit('/lazy/keep-contents-mounted');

      cy.get('#open-popover').click();

      cy.get('ion-popover ion-content').should('exist');

      cy.get('ion-popover ion-button').click();

      cy.get('ion-popover')
        .should('not.be.visible')
        .should('have.class', 'overlay-hidden');

      cy.get('ion-popover ion-content').should('exist');
    });
  });
});
