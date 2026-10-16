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
   * Verifies the scroll effect of a tab bar in tabs with a router outlet.
   *
   * @see https://github.com/ionic-team/ionic-framework/issues/26510
   */
  describe('Tab bar scrollEffect', () => {
    const getScrollTop = ($content: JQuery<HTMLElement>) =>
      $content[0].shadowRoot!.querySelector('.inner-scroll')!.scrollTop;

    // The tab bar starts following a page once it is visible, so wait for that before scrolling
    const scrollToBottom = (pageTestId: string) => {
      const selector = `[data-testid="${pageTestId}"] ion-content`;

      cy.get(selector).should('have.class', 'content-tab-bar-hide-scroll-partner');
      cy.get(selector).then(($content) => ($content[0] as HTMLIonContentElement).scrollToBottom(0));
      cy.get(selector).should(($content) => expect(getScrollTop($content)).to.be.greaterThan(0));
    };

    describe('hide', () => {
      beforeEach(() => {
        cy.visit('/tabs-scroll-effect/home');
      });

      it('should hide the tab bar when scrolling down the root page of a tab', () => {
        scrollToBottom('home-page');

        cy.get('ion-tab-bar').should('have.class', 'tab-bar-scroll-hidden');
      });

      it('should hide the tab bar when scrolling down after switching tabs', () => {
        cy.get('[data-testid="other-tab"]').click();
        cy.get('[data-testid="other-page"]').should('be.visible');

        scrollToBottom('other-page');

        cy.get('ion-tab-bar').should('have.class', 'tab-bar-scroll-hidden');
      });

      it('should not hide the tab bar when scrolling down a page that can go back', () => {
        cy.get('[data-testid="go-child"]').click();
        cy.get('[data-testid="child-page"]').should('be.visible');

        // The tab bar stopped following the root page and does not follow the child page
        cy.get('[data-testid="home-page"] ion-content').should('not.have.class', 'content-tab-bar-hide-scroll-partner');
        cy.get('[data-testid="child-page"] ion-content').should(
          'not.have.class',
          'content-tab-bar-hide-scroll-partner'
        );
        cy.get('[data-testid="child-page"] ion-content').then(($content) =>
          ($content[0] as HTMLIonContentElement).scrollToBottom(0)
        );
        cy.get('[data-testid="child-page"] ion-content').should(($content) =>
          expect(getScrollTop($content)).to.be.greaterThan(0)
        );

        cy.get('ion-tab-bar').should('not.have.class', 'tab-bar-scroll-hidden');
      });

      it('should hide the tab bar on a page that can go back when tabBarScrollEffect is true', () => {
        cy.get('[data-testid="go-child-effect"]').click();
        cy.get('[data-testid="child-effect-page"]').should('be.visible');

        scrollToBottom('child-effect-page');

        cy.get('ion-tab-bar').should('have.class', 'tab-bar-scroll-hidden');
      });

      it('should show the tab bar when navigating to a page that can go back', () => {
        scrollToBottom('home-page');
        cy.get('ion-tab-bar').should('have.class', 'tab-bar-scroll-hidden');

        cy.get('[data-testid="go-child"]').click();
        cy.get('[data-testid="child-page"]').should('be.visible');

        cy.get('ion-tab-bar').should('not.have.class', 'tab-bar-scroll-hidden');
      });
    });

    describe('fade', () => {
      beforeEach(() => {
        cy.visit('/tabs-scroll-effect/home?effect=fade');
      });

      const getOpacityScale = ($tabBar: JQuery<HTMLElement>) => $tabBar[0].style.getPropertyValue('--opacity-scale');

      it('should fade the tab bar background out when the content is scrolled to the end', () => {
        cy.get('ion-tab-bar').should(($tabBar) => expect(getOpacityScale($tabBar)).to.equal('1'));

        cy.get('[data-testid="home-page"] ion-content').then(($content) =>
          ($content[0] as HTMLIonContentElement).scrollToBottom(0)
        );

        cy.get('ion-tab-bar').should(($tabBar) => expect(getOpacityScale($tabBar)).to.equal('0'));
      });
    });
  });
});
