describe('keepContentsMounted', () => {
  describe('modal', () => {
    it('should not mount component if false', () => {
      cy.visit('/overlay-components/modal');

      cy.get('ion-modal ion-content').should('not.exist');
    });

    it('should mount component if true', () => {
      cy.visit('/keep-contents-mounted');

      cy.get('ion-modal ion-content').should('exist');
    });

    it('should keep component mounted after dismissing if true', () => {
      cy.visit('/keep-contents-mounted');

      cy.get('#open-modal').click();

      cy.get('ion-modal ion-content').should('exist');

      cy.get('ion-modal ion-button').click();

      cy.get('ion-modal')
        .should('not.be.visible')
        .should('have.class', 'overlay-hidden');

      cy.get('ion-modal ion-content').should('exist');
    });

    it('should display contents consistently on re-open', () => {
      // https://github.com/ionic-team/ionic-framework/issues/26253
      cy.visit('/keep-contents-mounted');

      cy.get('#open-modal').click();

      cy.get('ion-modal ion-content').should('exist');

      cy.get('ion-modal ion-button').click();

      cy.get('ion-modal')
        .should('not.be.visible')
        .should('have.class', 'overlay-hidden');

      cy.get('#open-modal').click();

      cy.get('ion-modal ion-button').should('be.visible');
    })
  })
  describe('popover', () => {
    it('should not mount component if false', () => {
      cy.visit('/overlay-components/popover');

      cy.get('ion-popover ion-content').should('not.exist');
    });

    it('should mount component if true', () => {
      cy.visit('/keep-contents-mounted');

      cy.get('ion-popover ion-content').should('exist');
    });

    it('should keep component mounted after dismissing if true', () => {
      cy.visit('/keep-contents-mounted');

      cy.get('#open-popover').click();

      cy.get('ion-popover ion-content').should('exist');

      cy.get('ion-popover ion-button').click();

      cy.get('ion-popover')
        .should('not.be.visible')
        .should('have.class', 'overlay-hidden');

      cy.get('ion-popover ion-content').should('exist');
    });
  })
});
