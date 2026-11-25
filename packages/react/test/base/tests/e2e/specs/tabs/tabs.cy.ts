describe('IonTabs', () => {
  /**
   * Verifies that tabs with similar route prefixes (e.g., /home, /home2, /home3)
   * correctly select the matching tab instead of the first prefix match.
   *
   * @see https://github.com/ionic-team/ionic-framework/issues/30448
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
      cy.visit('/tabs-basic', {
        onBeforeLoad(win) {
          cy.spy(win.console, 'log').as('consoleLog');
        },
      });
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

    it('should fire tab change events once on tab click', () => {
      cy.get('ion-tab-button[tab="tab2"]').click();

      cy.get('@consoleLog').should((consoleLog: any) => {
        expect(consoleLog.withArgs('onIonTabsWillChange', 'tab2')).to.have.been.calledOnce;
        expect(consoleLog.withArgs('onIonTabsDidChange:', 'tab2')).to.have.been.calledOnce;
      });
    });

    // Issue: https://github.com/ionic-team/ionic-framework/issues/30037
    it('should select a tab with selectTab from IonTabsContext', () => {
      cy.get('#select-tab2').click();

      cy.get('#select-result').should('have.text', 'true');
      cy.get('ion-tab').eq(1).should('not.have.class', 'tab-hidden');
      cy.get('ion-tab').eq(0).should('have.class', 'tab-hidden');
      cy.get('ion-tab-button[tab="tab2"]').should('have.class', 'tab-selected');
      cy.get('@consoleLog').should((consoleLog: any) => {
        expect(consoleLog.withArgs('onIonTabsWillChange', 'tab2')).to.have.been.calledOnce;
        expect(consoleLog.withArgs('onIonTabsDidChange:', 'tab2')).to.have.been.calledOnce;
      });
    });

    it('should return false from selectTab for a tab that does not exist', () => {
      cy.get('#select-missing-tab').click();

      cy.get('#select-result').should('have.text', 'false');
      cy.get('ion-tab').eq(0).should('not.have.class', 'tab-hidden');
    });

    it('should keep activeTab on IonTabsContext in sync with the selected tab', () => {
      cy.get('#read-active-tab').click();
      cy.get('#active-tab').should('have.text', 'tab1');

      cy.get('ion-tab-button[tab="tab2"]').click();
      cy.get('ion-tab').eq(1).should('not.have.class', 'tab-hidden');

      cy.get('#read-active-tab').click();
      cy.get('#active-tab').should('have.text', 'tab2');
    });
  });
});
