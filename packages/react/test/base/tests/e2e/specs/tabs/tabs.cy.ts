describe('IonTabs', () => {
  describe('With IonRouterOutlet', () => {
    beforeEach(() => {
      cy.visit('/tabs/tab1');
    });
  
    it('should handle onClick handlers on IonTabButton', () => {
      const stub = cy.stub();
  
      cy.on('window:alert', stub);
      cy.get('ion-tab-button[tab="tab1"]').click().then(() => {
        expect(stub.getCall(0)).to.be.calledWith('Tab was clicked')
      });
  
    });
  });

  describe('Without IonRouterOutlet', () => {
    beforeEach(() => {
      cy.visit('/tabs-basic');
    });
  
    it('should show correct tab when clicking the tab button', () => {
      cy.get('ion-tab[tab="tab1"]').should('be.visible');
      cy.get('ion-tab[tab="tab2"]').should('not.be.visible');
  
      cy.get('ion-tab-button[tab="tab2"]').click();
  
      cy.get('ion-tab[tab="tab1"]').should('not.be.visible');
      cy.get('ion-tab[tab="tab2"]').should('be.visible');
  
      cy.get('ion-tab-button[tab="tab1"]').click();
  
      cy.get('ion-tab[tab="tab1"]').should('be.visible');
      cy.get('ion-tab[tab="tab2"]').should('not.be.visible');
    });
  });
});
