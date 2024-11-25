describe('Tabs', () => {
  describe('Without IonRouterOutlet', () => {
    beforeEach(() => {
      cy.visit('/standalone/tabs');
    });
  
    it('should redirect to the default tab', () => {
      cy.get('app-tab-one').should('be.visible');
      cy.contains('Tab 1');
    });
  
    it('should render new content when switching tabs', () => {
      cy.get('#tab-button-tab-two').click();
      cy.get('app-tab-two').should('be.visible');
      cy.contains('Tab 2');
    });
  
    // Issue: https://github.com/ionic-team/ionic-framework/issues/28417
    it('parentOutlet should be defined', () => {
      cy.get('#parent-outlet span').should('have.text', 'true');
    });
  });

  describe('Without IonRouterOutlet', () => {
    beforeEach(() => {
      cy.visit('/standalone/tabs-basic');
    })

    it('should show correct tab when clicking the tab button', () => {
      cy.get('ion-tab[tab="tab1"]').should('be.visible');
      cy.get('ion-tab[tab="tab2"]').should('not.be.visible');

      cy.get('ion-tab-button[tab="tab2"]').click();

      cy.get('ion-tab[tab="tab1"]').should('not.be.visible');
      cy.get('ion-tab[tab="tab2"]').should('be.visible');
    });

    it('should not change the URL when clicking the tab button', () => {
      cy.url().should('include', '/tabs-basic');

      cy.get('ion-tab-button[tab="tab2"]').click();

      cy.url().should('include', '/tabs-basic');
    });
  });
});
