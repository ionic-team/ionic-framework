describe('IonTabs', () => {
  /**
   * Verifies that tabs with similar route prefixes (e.g., /home, /home2, /home3)
   * correctly select the matching tab instead of the first prefix match.
   */
  describe('Similar Route Prefixes', () => {
    it('should select the correct tab when routes have similar prefixes', () => {
      cy.visit('/tabs-similar-prefixes/home2');

      cy.get('[data-testid="home2-content"]').should('be.visible');
      cy.get('[data-testid="home2-tab"]').should('have.class', 'tab-selected');
      cy.get('[data-testid="home-tab"]').should('not.have.class', 'tab-selected');
    });

    it('should select the correct tab when navigating via tab buttons', () => {
      cy.visit('/tabs-similar-prefixes/home');

      cy.get('[data-testid="home-tab"]').should('have.class', 'tab-selected');
      cy.get('[data-testid="home2-tab"]').should('not.have.class', 'tab-selected');

      cy.get('[data-testid="home2-tab"]').click();
      cy.get('[data-testid="home2-tab"]').should('have.class', 'tab-selected');
      cy.get('[data-testid="home-tab"]').should('not.have.class', 'tab-selected');

      cy.get('[data-testid="home3-tab"]').click();
      cy.get('[data-testid="home3-tab"]').should('have.class', 'tab-selected');
      cy.get('[data-testid="home-tab"]').should('not.have.class', 'tab-selected');
      cy.get('[data-testid="home2-tab"]').should('not.have.class', 'tab-selected');
    });

    it('should select the correct tab when directly navigating to home3', () => {
      cy.visit('/tabs-similar-prefixes/home3');

      cy.get('[data-testid="home3-content"]').should('be.visible');
      cy.get('[data-testid="home3-tab"]').should('have.class', 'tab-selected');
      cy.get('[data-testid="home-tab"]').should('not.have.class', 'tab-selected');
      cy.get('[data-testid="home2-tab"]').should('not.have.class', 'tab-selected');
    });
  });

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

    it.skip('should show correct tab when clicking the tab button', () => {
      cy.get('ion-tab[tab="tab1"]').should('be.visible');
      cy.get('ion-tab[tab="tab2"]').should('not.be.visible');

      cy.get('ion-tab-button[tab="tab2"]').click();

      cy.get('ion-tab[tab="tab1"]').should('not.be.visible');
      cy.get('ion-tab[tab="tab2"]').should('be.visible');

      cy.get('ion-tab-button[tab="tab1"]').click();

      cy.get('ion-tab[tab="tab1"]').should('be.visible');
      cy.get('ion-tab[tab="tab2"]').should('not.be.visible');
    });

    it('should not change the URL when clicking the tab button', () => {
      cy.url().should('include', '/tabs-basic');

      cy.get('ion-tab-button[tab="tab2"]').click();

      cy.url().should('include', '/tabs-basic');
    });
  });
});
