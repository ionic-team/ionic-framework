describe('Overlays: Inline', () => {
  beforeEach(() => {
    cy.visit('/overlays-inline');
  });

  describe('Alert', () => {
    it('should be visible when presenting', () => {
      cy.get('ion-alert').should('not.be.visible');

      cy.get('#open-alert').click();
      cy.get('ion-alert').should('be.visible');

      cy.get('ion-alert ion-backdrop').click({ force: true });
      cy.get('ion-alert').should('not.be.visible');
    });
  });

  describe('Action Sheet', () => {
    it('should be visible when presenting', () => {
      cy.get('ion-action-sheet').should('not.be.visible');

      cy.get('#open-action-sheet').click();
      cy.get('ion-action-sheet').should('be.visible');

      cy.get('ion-action-sheet ion-backdrop').click({ force: true });
      cy.get('ion-action-sheet').should('not.be.visible');
    });
  });

  describe('Loading', () => {
    it('should be visible when presenting', () => {
      cy.get('ion-loading').should('not.be.visible');

      cy.get('#open-loading').click();
      cy.get('ion-loading').should('be.visible');

      cy.get('ion-loading ion-backdrop').click({ force: true });
      cy.get('ion-loading').should('not.be.visible');
    });
  });

  describe('Toast', () => {
    it('should be visible when presenting', () => {
      cy.get('ion-toast').should('not.be.visible');

      cy.get('#open-toast').click();
      cy.get('ion-toast').shadow().find('.toast-wrapper').should('be.visible');

      cy.get('ion-toast').shadow().find('.toast-button').click();
      cy.get('ion-toast').should('not.be.visible');
    });
  });
});
