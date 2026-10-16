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

    it('should fire tab change events on tab click', () => {
      cy.get('ion-tab-button[tab="tab2"]').click();

      cy.get('@consoleLog').should('be.calledWith', 'onIonTabsWillChange', 'tab2');
      cy.get('@consoleLog').should('be.calledWith', 'onIonTabsDidChange:', 'tab2');
    });
  });

  /**
   * Verifies that pressing the active tab button scrolls the content
   * to the top when the `tabTap` config is enabled.
   *
   * @see https://github.com/ionic-team/ionic-framework/issues/22558
   */
  describe('tabTap', () => {
    const getScrollTop = ($content: JQuery<HTMLElement>) =>
      $content[0].shadowRoot!.querySelector('.inner-scroll')!.scrollTop;

    const scrollContentDown = (selector: string) => {
      cy.get(selector).then(($content) => ($content[0] as HTMLIonContentElement).scrollToPoint(0, 500));
      cy.get(selector).should(($content) => expect(getScrollTop($content)).to.be.greaterThan(0));
    };

    const spyOnScrollToTop = (selector: string) => {
      cy.get(selector).then(($content) => cy.spy($content[0], 'scrollToTop').as('scrollToTop'));
    };

    const setTabTap = (value: boolean) => {
      cy.window().then((win) => (win as any).Ionic.config.set('tabTap', value));
    };

    beforeEach(() => {
      cy.visit('/tabs-tab-tap/home');
    });

    it('should scroll to the top when pressing the active tab button at the root of the tab', () => {
      setTabTap(true);
      scrollContentDown('[data-testid="home-page"] ion-content');

      cy.get('[data-testid="home-tab"]').click();

      cy.get('[data-testid="home-page"] ion-content').should(($content) => expect(getScrollTop($content)).to.equal(0));
    });

    it('should not scroll to the top when tabTap is not enabled', () => {
      spyOnScrollToTop('[data-testid="home-page"] ion-content');

      cy.get('[data-testid="home-tab"]').click();

      cy.get('@scrollToTop').should('not.have.been.called');
    });

    it('should navigate to the root of the tab without scrolling the child page', () => {
      setTabTap(true);
      cy.get('[data-testid="detail-link"]').click();
      cy.get('[data-testid="home-detail-page"]').should('be.visible');
      spyOnScrollToTop('[data-testid="home-detail-page"] ion-content');

      cy.get('[data-testid="home-tab"]').click();

      cy.location('pathname').should('eq', '/tabs-tab-tap/home');
      cy.get('@scrollToTop').should('not.have.been.called');
    });
  });
});
