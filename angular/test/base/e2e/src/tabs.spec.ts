describe('Tabs', () => {
  beforeEach(() => {
    cy.visit('/tabs');
  })

  describe('entry url - /tabs', () => {
    it('should redirect and load tab-account', () => {
      testTabTitle('Tab 1 - Page 1');
      cy.testStack('ion-tabs ion-router-outlet', ['app-tabs-tab1']);
      testState(1, 'account');
    });

    it('should navigate between tabs and ionChange events should be dispatched', () => {
      let tab = testTabTitle('Tab 1 - Page 1');
      tab.find('.segment-changed').should('have.text', 'false');

      cy.get('#tab-button-contact').click();
      tab = testTabTitle('Tab 2 - Page 1');
      tab.find('.segment-changed').should('have.text', 'false');
    });

    describe('when navigating between tabs', () => {

      it('should emit ionTabsWillChange before setting the selected tab', () => {
        cy.get('#ionTabsWillChangeCounter').should('have.text', '1');
        cy.get('#ionTabsWillChangeEvent').should('have.text', 'account');
        cy.get('#ionTabsWillChangeSelectedTab').should('have.text', '');

        cy.get('#ionTabsDidChangeCounter').should('have.text', '1');
        cy.get('#ionTabsDidChangeEvent').should('have.text', 'account');
        cy.get('#ionTabsDidChangeSelectedTab').should('have.text', 'account');

        cy.get('#tab-button-contact').click();

        cy.get('#ionTabsWillChangeCounter').should('have.text', '2');
        cy.get('#ionTabsWillChangeEvent').should('have.text', 'contact');
        cy.get('#ionTabsWillChangeSelectedTab').should('have.text', 'account');

        cy.get('#ionTabsDidChangeCounter').should('have.text', '2');
        cy.get('#ionTabsDidChangeEvent').should('have.text', 'contact');
        cy.get('#ionTabsDidChangeSelectedTab').should('have.text', 'contact');
      })

    });

    it('should simulate stack + double tab click', () => {
      let tab = getSelectedTab();
      tab.find('#goto-tab1-page2').click();
      testTabTitle('Tab 1 - Page 2 (1)');
      cy.testStack('ion-tabs ion-router-outlet', ['app-tabs-tab1', 'app-tabs-tab1-nested']);
      testState(1, 'account');

      // When you call find on tab above it changes the value of tab
      // so we need to redefine it
      tab = getSelectedTab();
      tab.find('ion-back-button').should('be.visible');

      cy.get('#tab-button-contact').click();
      testTabTitle('Tab 2 - Page 1');
      cy.testStack('ion-tabs ion-router-outlet', ['app-tabs-tab1', 'app-tabs-tab1-nested', 'app-tabs-tab2']);
      testState(2, 'contact');

      cy.get('#tab-button-account').click();
      testTabTitle('Tab 1 - Page 2 (1)');
      cy.testStack('ion-tabs ion-router-outlet', ['app-tabs-tab1', 'app-tabs-tab1-nested', 'app-tabs-tab2']);
      testState(3, 'account');

      tab = getSelectedTab();
      tab.find('ion-back-button').should('be.visible');

      cy.get('#tab-button-account').click();
      testTabTitle('Tab 1 - Page 1');
      cy.testStack('ion-tabs ion-router-outlet', ['app-tabs-tab1', 'app-tabs-tab2']);
      testState(3, 'account');
    });

    it('should simulate stack + back button click', () => {
      const tab = getSelectedTab();
      tab.find('#goto-tab1-page2').click();
      testTabTitle('Tab 1 - Page 2 (1)');
      testState(1, 'account');

      cy.get('#tab-button-contact').click();
      testTabTitle('Tab 2 - Page 1');
      testState(2, 'contact');

      cy.get('#tab-button-account').click();
      testTabTitle('Tab 1 - Page 2 (1)');
      testState(3, 'account');

      cy.get('ion-back-button').click();
      testTabTitle('Tab 1 - Page 1');
      cy.testStack('ion-tabs ion-router-outlet', ['app-tabs-tab1', 'app-tabs-tab2']);
      testState(3, 'account');
    });

    it('should navigate deep then go home', () => {
      const tab = getSelectedTab();
      tab.find('#goto-tab1-page2').click();
      cy.ionPageVisible('app-tabs-tab1-nested');
      cy.ionPageHidden('app-tabs-tab1');

      testTabTitle('Tab 1 - Page 2 (1)');

      cy.get('#goto-next').click();
      cy.ionPageVisible('app-tabs-tab1-nested:last-of-type');
      cy.ionPageHidden('app-tabs-tab1-nested:first-of-type');

      testTabTitle('Tab 1 - Page 2 (2)');

      cy.get('#tab-button-contact').click();
      cy.ionPageVisible('app-tabs-tab2');
      cy.ionPageHidden('app-tabs-tab1-nested:last-of-type');

      testTabTitle('Tab 2 - Page 1');

      cy.get('#tab-button-account').click();
      cy.ionPageVisible('app-tabs-tab1-nested:last-of-type');
      cy.ionPageHidden('app-tabs-tab2');

      testTabTitle('Tab 1 - Page 2 (2)');
      cy.testStack('ion-tabs ion-router-outlet', [
        'app-tabs-tab1',
        'app-tabs-tab1-nested',
        'app-tabs-tab1-nested',
        'app-tabs-tab2'
      ]);

      cy.get('#tab-button-account').click();

      /**
       * Wait for the leaving view to
       * be unmounted otherwise testTabTitle
       * may get the leaving view before it
       * is unmounted.
       */
      cy.ionPageVisible('app-tabs-tab1');
      cy.ionPageDoesNotExist('app-tabs-tab1-nested');

      testTabTitle('Tab 1 - Page 1');
      cy.testStack('ion-tabs ion-router-outlet', [
        'app-tabs-tab1',
        'app-tabs-tab2'
      ]);
    });

    it('should switch tabs and go back', () => {
      cy.get('#tab-button-contact').click();
      const tab = testTabTitle('Tab 2 - Page 1');

      tab.find('#goto-tab1-page1').click();
      testTabTitle('Tab 1 - Page 1');
      cy.testStack('ion-tabs ion-router-outlet', ['app-tabs-tab1', 'app-tabs-tab2']);
    });

    it('should switch tabs and go to nested', () => {
      cy.get('#tab-button-contact').click();
      const tab = testTabTitle('Tab 2 - Page 1');

      tab.find('#goto-tab1-page2').click();
      testTabTitle('Tab 1 - Page 2 (1)');
      cy.testStack('ion-tabs ion-router-outlet', ['app-tabs-tab2', 'app-tabs-tab1-nested']);
    });

    it('should load lazy loaded tab', () => {
      cy.get('#tab-button-lazy').click();
      cy.ionPageVisible('app-tabs-tab3');
      testTabTitle('Tab 3 - Page 1');
    });

    it('should use ion-back-button defaultHref', () => {
      let tab = getSelectedTab();
      tab.find('#goto-tab3-page2').click();
      testTabTitle('Tab 3 - Page 2');
      cy.testStack('ion-tabs ion-router-outlet', ['app-tabs-tab1', 'app-tabs-tab3-nested']);

      tab = getSelectedTab();
      tab.find('ion-back-button').click();
      testTabTitle('Tab 3 - Page 1');
      cy.testStack('ion-tabs ion-router-outlet', ['app-tabs-tab1', 'app-tabs-tab3']);
    });

    it('should preserve navigation extras when switching tabs', () => {
      const expectUrlToContain = 'search=hello#fragment';
      let tab = getSelectedTab();
      tab.find('#goto-nested-page1-with-query-params').click();
      testTabTitle('Tab 1 - Page 2 (1)');
      testUrlContains(expectUrlToContain);

      cy.get('#tab-button-contact').click();
      testTabTitle('Tab 2 - Page 1');

      cy.get('#tab-button-account').click();
      tab = testTabTitle('Tab 1 - Page 2 (1)');
      testUrlContains(expectUrlToContain);
    });

    it('should set root when clicking on an active tab to navigate to the root', () => {
      const expectNestedTabUrlToContain = 'search=hello#fragment';
      cy.url().then(url => {
        const tab = getSelectedTab();
        tab.find('#goto-nested-page1-with-query-params').click();
        testTabTitle('Tab 1 - Page 2 (1)');
        testUrlContains(expectNestedTabUrlToContain);

        cy.get('#tab-button-account').click();
        testTabTitle('Tab 1 - Page 1');

        testUrlEquals(url);
      })
    });
  })

  describe('entry tab contains navigation extras', () => {
    const expectNestedTabUrlToContain = 'search=hello#fragment';
    const rootUrlParams = 'test=123#rootFragment';
    const rootUrl = `/tabs/account?${rootUrlParams}`;

    beforeEach(() => {
      cy.visit(rootUrl);
    })

    it('should preserve root url navigation extras when clicking on an active tab to navigate to the root', () => {
      const tab = getSelectedTab();
      tab.find('#goto-nested-page1-with-query-params').click();

      testTabTitle('Tab 1 - Page 2 (1)');
      testUrlContains(expectNestedTabUrlToContain);

      cy.get('#tab-button-account').click();
      testTabTitle('Tab 1 - Page 1');

      testUrlContains(rootUrl);
    });

    it('should preserve root url navigation extras when changing tabs', () => {
      getSelectedTab();
      cy.get('#tab-button-contact').click();
      testTabTitle('Tab 2 - Page 1');

      cy.get('#tab-button-account').click();
      testTabTitle('Tab 1 - Page 1');

      testUrlContains(rootUrl);
    });

    it('should navigate deep then go home and preserve navigation extras', () => {
      let tab = getSelectedTab();
      tab.find('#goto-tab1-page2').click();
      cy.ionPageVisible('app-tabs-tab1-nested');
      cy.ionPageHidden('app-tabs-tab1');

      tab = testTabTitle('Tab 1 - Page 2 (1)');

      tab.find('#goto-next').click();
      cy.ionPageVisible('app-tabs-tab1-nested:last-of-type');
      cy.ionPageHidden('app-tabs-tab1-nested:first-of-type');

      testTabTitle('Tab 1 - Page 2 (2)');

      cy.ionTabClick('Tab Two');
      cy.ionPageVisible('app-tabs-tab2');
      cy.ionPageHidden('app-tabs-tab1-nested:last-of-type');

      testTabTitle('Tab 2 - Page 1');

      cy.ionTabClick('Tab One');
      cy.ionPageVisible('app-tabs-tab1-nested:last-of-type');
      cy.ionPageHidden('app-tabs-tab2');

      testTabTitle('Tab 1 - Page 2 (2)');

      cy.ionTabClick('Tab One');
      /**
       * Wait for the leaving view to
       * be unmounted otherwise testTabTitle
       * may get the leaving view before it
       * is unmounted.
       */
      cy.ionPageVisible('app-tabs-tab1');
      cy.ionPageDoesNotExist('app-tabs-tab1-nested');

      testTabTitle('Tab 1 - Page 1');

      testUrlContains(rootUrl);
    });
  })

  describe('entry url - /tabs/account', () => {
    beforeEach(() => {
      cy.visit('/tabs/account');
    });
    it('should pop to previous view when leaving tabs outlet', () => {

      cy.get('ion-title').should('contain.text', 'Tab 1 - Page 1');

      cy.get('#goto-tab1-page2').click();

      cy.get('ion-title').should('contain.text', 'Tab 1 - Page 2 (1)');

      cy.get('#goto-global').click();

      cy.get('ion-title').should('contain.text', 'Global Page');

      cy.get('#goto-prev-pop').click();

      cy.get('ion-title').should('contain.text', 'Tab 1 - Page 2 (1)');

      cy.get('#goto-prev').click();

      cy.get('ion-title').should('contain.text', 'Tab 1 - Page 1');

      /**
       * Verifies that when entering the tabs outlet directly,
       * the navController.pop() method does not pop the previous view,
       * when you are at the root of the tabs outlet.
       */
      cy.get('#goto-previous-page').click();
      cy.get('ion-title').should('contain.text', 'Tab 1 - Page 1');
    });
  });

  describe('entry url - /', () => {
    it('should pop to the root outlet from the tabs outlet', () => {
      cy.visit('/');

      cy.get('ion-title').should('contain.text', 'Test App');

      cy.get('ion-item').contains('Tabs test').click();

      cy.get('ion-title').should('contain.text', 'Tab 1 - Page 1');

      cy.get('#goto-tab1-page2').click();

      cy.get('ion-title').should('contain.text', 'Tab 1 - Page 2 (1)');

      cy.get('#goto-global').click();

      cy.get('ion-title').should('contain.text', 'Global Page');

      cy.get('#goto-prev-pop').click();

      cy.get('ion-title').should('contain.text', 'Tab 1 - Page 2 (1)');

      cy.get('#goto-prev').click();

      cy.get('ion-title').should('contain.text', 'Tab 1 - Page 1');

      cy.get('#goto-previous-page').click();

      cy.get('ion-title').should('contain.text', 'Test App');

    });
  });


  describe('entry url - /tabs/account/nested/1', () => {
    beforeEach(() => {
      cy.visit('/tabs/account/nested/1');
    })

    it('should only display the back-button when there is a page in the stack', () => {
      let tab = getSelectedTab();
      tab.find('ion-back-button').should('not.be.visible');
      testTabTitle('Tab 1 - Page 2 (1)');
      cy.testStack('ion-tabs ion-router-outlet', ['app-tabs-tab1-nested']);

      cy.get('#tab-button-account').click();
      tab = testTabTitle('Tab 1 - Page 1');

      tab.find('#goto-tab1-page2').click();
      tab = testTabTitle('Tab 1 - Page 2 (1)');
      tab.find('ion-back-button').should('be.visible');
    });

    it('should not reuse the same page', () => {
      let tab = testTabTitle('Tab 1 - Page 2 (1)');
      tab.find('#goto-next').click();
      tab = testTabTitle('Tab 1 - Page 2 (2)');

      tab.find('#goto-next').click();
      tab = testTabTitle('Tab 1 - Page 2 (3)');

      cy.testStack('ion-tabs ion-router-outlet', [
        'app-tabs-tab1-nested',
        'app-tabs-tab1-nested',
        'app-tabs-tab1-nested'
      ]);

      tab = getSelectedTab();
      tab.find('ion-back-button').click();
      tab = testTabTitle('Tab 1 - Page 2 (2)');
      tab.find('ion-back-button').click();
      tab = testTabTitle('Tab 1 - Page 2 (1)');

      tab.find('ion-back-button').should('not.be.visible');

      cy.testStack('ion-tabs ion-router-outlet', ['app-tabs-tab1-nested']);
    });
  })

  describe('entry url - /tabs/lazy', () => {
    beforeEach(() => {
      cy.visit('/tabs/lazy');
    });

    it('should not display the back-button if coming from a different stack', () => {
      let tab = testTabTitle('Tab 3 - Page 1');
      cy.testStack('ion-tabs ion-router-outlet', ['app-tabs-tab3']);

      tab = getSelectedTab();
      tab.find('#goto-tab1-page2').click();
      cy.testStack('ion-tabs ion-router-outlet', ['app-tabs-tab3', 'app-tabs-tab1-nested']);

      tab = testTabTitle('Tab 1 - Page 2 (1)');
      tab.find('ion-back-button').should('not.be.visible');
    });
  })

  describe('enter url - /tabs/contact/one', () => {
    beforeEach(() => {
      cy.visit('/tabs/contact/one');
    });

    it('should return to correct tab after going to page in different outlet', () => {
      const tab = getSelectedTab();
      tab.find('#goto-nested-page1').click();
      cy.testStack('app-nested-outlet ion-router-outlet', ['app-nested-outlet-page']);

      const nestedOutlet = cy.get('app-nested-outlet');
      nestedOutlet.find('ion-back-button').click();

      testTabTitle('Tab 2 - Page 1');
    });
  })
})

it('Tabs should support conditional slots', () => {
  cy.visit('/tabs-slots');

  cy.get('ion-tabs .tabs-inner + ion-tab-bar').should('have.length', 1);

  // Click the button to change the slot to the top
  cy.get('#set-slot-top').click();

  // The tab bar should be removed from the bottom
  cy.get('ion-tabs .tabs-inner + ion-tab-bar').should('have.length', 0);

  // The tab bar should be added to the top
  cy.get('ion-tabs ion-tab-bar + .tabs-inner').should('have.length', 1);

  // Click the button to change the slot to the bottom
  cy.get('#set-slot-bottom').click();

  // The tab bar should be removed from the top
  cy.get('ion-tabs ion-tab-bar + .tabs-inner').should('have.length', 0);

  // The tab bar should be added to the bottom
  cy.get('ion-tabs .tabs-inner + ion-tab-bar').should('have.length', 1);
});


function testTabTitle(title) {
  const tab = getSelectedTab();

  // Find is used to get a direct descendant instead of get
  tab.find('ion-title').should('have.text', title);
  return getSelectedTab();
}

function getSelectedTab() {
  cy.get('ion-tabs ion-router-outlet > *:not(.ion-page-hidden)').should('have.length', 1);
  return cy.get('ion-tabs ion-router-outlet > *:not(.ion-page-hidden)').first();
}

function testState(count, tab) {
  cy.get('#tabs-state').should('have.text', `${count}.${tab}`);
}

function testUrlContains(urlFragment) {
  cy.location().should((location) => {
    expect(location.href).to.contain(urlFragment);
  });
}

function testUrlEquals(url) {
  cy.url().should('eq', url);
}
