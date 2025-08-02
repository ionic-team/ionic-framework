import { test, expect } from '@playwright/test';
import {
  testStack,
  testLifeCycle,
  testTabTitle,
  getSelectedTab,
  testState,
  testUrlContains,
  testUrlEquals,
  ionPageVisible,
  ionPageHidden,
  ionPageDoesNotExist,
  ionTabClick
} from '../../utils/test-helpers';

test.describe('Tabs', () => {
  test.describe('With IonRouterOutlet', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/lazy/tabs');
    });

    test.describe('entry url - /tabs', () => {
      test('should redirect and load tab-account', async ({ page }) => {
        await testTabTitle(page, 'Tab 1 - Page 1');
        await testStack(page, 'ion-tabs ion-router-outlet', ['app-tabs-tab1']);
        await testState(page, 1, 'account');
      });

      test('should navigate between tabs and ionChange events should be dispatched', async ({ page }) => {
        let tab = await testTabTitle(page, 'Tab 1 - Page 1');
        await expect(tab.locator('.segment-changed')).toHaveText('false');

        await page.locator('#tab-button-contact').click();
        tab = await testTabTitle(page, 'Tab 2 - Page 1');
        await expect(tab.locator('.segment-changed')).toHaveText('false');
      });

      test.describe('when navigating between tabs', () => {
        test('should emit ionTabsWillChange before setting the selected tab', async ({ page }) => {
          await expect(page.locator('#ionTabsWillChangeCounter')).toHaveText('1');
          await expect(page.locator('#ionTabsWillChangeEvent')).toHaveText('account');
          await expect(page.locator('#ionTabsWillChangeSelectedTab')).toHaveText('');

          await expect(page.locator('#ionTabsDidChangeCounter')).toHaveText('1');
          await expect(page.locator('#ionTabsDidChangeEvent')).toHaveText('account');
          await expect(page.locator('#ionTabsDidChangeSelectedTab')).toHaveText('account');

          await page.locator('#tab-button-contact').click();

          await expect(page.locator('#ionTabsWillChangeCounter')).toHaveText('2');
          await expect(page.locator('#ionTabsWillChangeEvent')).toHaveText('contact');
          await expect(page.locator('#ionTabsWillChangeSelectedTab')).toHaveText('account');

          await expect(page.locator('#ionTabsDidChangeCounter')).toHaveText('2');
          await expect(page.locator('#ionTabsDidChangeEvent')).toHaveText('contact');
          await expect(page.locator('#ionTabsDidChangeSelectedTab')).toHaveText('contact');
        });
      });

      test('should simulate stack + double tab click', async ({ page }) => {
        let tab = await getSelectedTab(page);
        await tab.locator('#goto-tab1-page2').click();
        await testTabTitle(page, 'Tab 1 - Page 2 (1)');
        await testStack(page, 'ion-tabs ion-router-outlet', ['app-tabs-tab1', 'app-tabs-tab1-nested']);
        await testState(page, 1, 'account');

        tab = await getSelectedTab(page);
        await expect(tab.locator('ion-back-button')).toBeVisible();

        await page.locator('#tab-button-contact').click();
        await testTabTitle(page, 'Tab 2 - Page 1');
        await testStack(page, 'ion-tabs ion-router-outlet', ['app-tabs-tab1', 'app-tabs-tab1-nested', 'app-tabs-tab2']);
        await testState(page, 2, 'contact');

        await page.locator('#tab-button-account').click();
        await testTabTitle(page, 'Tab 1 - Page 2 (1)');
        await testStack(page, 'ion-tabs ion-router-outlet', ['app-tabs-tab1', 'app-tabs-tab1-nested', 'app-tabs-tab2']);
        await testState(page, 3, 'account');

        tab = await getSelectedTab(page);
        await expect(tab.locator('ion-back-button')).toBeVisible();

        await page.locator('#tab-button-account').click();
        await testTabTitle(page, 'Tab 1 - Page 1');
        await testStack(page, 'ion-tabs ion-router-outlet', ['app-tabs-tab1', 'app-tabs-tab2']);
        await testState(page, 3, 'account');
      });

      test('should simulate stack + back button click', async ({ page }) => {
        const tab = await getSelectedTab(page);
        await tab.locator('#goto-tab1-page2').click();
        await testTabTitle(page, 'Tab 1 - Page 2 (1)');
        await testState(page, 1, 'account');

        await page.locator('#tab-button-contact').click();
        await testTabTitle(page, 'Tab 2 - Page 1');
        await testState(page, 2, 'contact');

        await page.locator('#tab-button-account').click();
        await testTabTitle(page, 'Tab 1 - Page 2 (1)');
        await testState(page, 3, 'account');

        await page.locator('ion-back-button').click();
        await testTabTitle(page, 'Tab 1 - Page 1');
        await testStack(page, 'ion-tabs ion-router-outlet', ['app-tabs-tab1', 'app-tabs-tab2']);
        await testState(page, 3, 'account');
      });

      test('should navigate deep then go home', async ({ page }) => {
        const tab = await getSelectedTab(page);
        await tab.locator('#goto-tab1-page2').click();
        await ionPageVisible(page, 'app-tabs-tab1-nested');
        await ionPageHidden(page, 'app-tabs-tab1');

        await testTabTitle(page, 'Tab 1 - Page 2 (1)');

        await page.locator('#goto-next').click();
        await ionPageVisible(page, 'app-tabs-tab1-nested:last-of-type');
        await ionPageHidden(page, 'app-tabs-tab1-nested:first-of-type');

        await testTabTitle(page, 'Tab 1 - Page 2 (2)');

        await page.locator('#tab-button-contact').click();
        await ionPageVisible(page, 'app-tabs-tab2');
        await ionPageHidden(page, 'app-tabs-tab1-nested:last-of-type');

        await testTabTitle(page, 'Tab 2 - Page 1');

        await page.locator('#tab-button-account').click();
        await ionPageVisible(page, 'app-tabs-tab1-nested:last-of-type');
        await ionPageHidden(page, 'app-tabs-tab2');

        await testTabTitle(page, 'Tab 1 - Page 2 (2)');
        await testStack(page, 'ion-tabs ion-router-outlet', [
          'app-tabs-tab1',
          'app-tabs-tab1-nested',
          'app-tabs-tab1-nested',
          'app-tabs-tab2'
        ]);

        await page.locator('#tab-button-account').click();

        /**
         * Wait for the leaving view to
         * be unmounted otherwise testTabTitle
         * may get the leaving view before it
         * is unmounted.
         */
        await ionPageVisible(page, 'app-tabs-tab1');
        await ionPageDoesNotExist(page, 'app-tabs-tab1-nested');

        await testTabTitle(page, 'Tab 1 - Page 1');
        await testStack(page, 'ion-tabs ion-router-outlet', [
          'app-tabs-tab1',
          'app-tabs-tab2'
        ]);
      });

      test('should switch tabs and go back', async ({ page }) => {
        await page.locator('#tab-button-contact').click();
        const tab = await testTabTitle(page, 'Tab 2 - Page 1');

        await tab.locator('#goto-tab1-page1').click();
        await testTabTitle(page, 'Tab 1 - Page 1');
        await testStack(page, 'ion-tabs ion-router-outlet', ['app-tabs-tab1', 'app-tabs-tab2']);
      });

      test('should switch tabs and go to nested', async ({ page }) => {
        await page.locator('#tab-button-contact').click();
        const tab = await testTabTitle(page, 'Tab 2 - Page 1');

        await tab.locator('#goto-tab1-page2').click();
        await testTabTitle(page, 'Tab 1 - Page 2 (1)');
        await testStack(page, 'ion-tabs ion-router-outlet', ['app-tabs-tab2', 'app-tabs-tab1-nested']);
      });

      test('should load lazy loaded tab', async ({ page }) => {
        await page.locator('#tab-button-lazy').click();
        await ionPageVisible(page, 'app-tabs-tab3');
        await testTabTitle(page, 'Tab 3 - Page 1');
      });

      test('should use ion-back-button defaultHref', async ({ page }) => {
        let tab = await getSelectedTab(page);
        await tab.locator('#goto-tab3-page2').click();
        await testTabTitle(page, 'Tab 3 - Page 2');
        await testStack(page, 'ion-tabs ion-router-outlet', ['app-tabs-tab1', 'app-tabs-tab3-nested']);

        tab = await getSelectedTab(page);
        await tab.locator('ion-back-button').click();
        await testTabTitle(page, 'Tab 3 - Page 1');
        await testStack(page, 'ion-tabs ion-router-outlet', ['app-tabs-tab1', 'app-tabs-tab3']);
      });

      test('should preserve navigation extras when switching tabs', async ({ page }) => {
        const expectUrlToContain = 'search=hello#fragment';
        let tab = await getSelectedTab(page);
        await tab.locator('#goto-nested-page1-with-query-params').click();
        await testTabTitle(page, 'Tab 1 - Page 2 (1)');
        await testUrlContains(page, expectUrlToContain);

        await page.locator('#tab-button-contact').click();
        await testTabTitle(page, 'Tab 2 - Page 1');

        await page.locator('#tab-button-account').click();
        tab = await testTabTitle(page, 'Tab 1 - Page 2 (1)');
        await testUrlContains(page, expectUrlToContain);
      });

      test('should set root when clicking on an active tab to navigate to the root', async ({ page }) => {
        const expectNestedTabUrlToContain = 'search=hello#fragment';
        const url = page.url();
        const tab = await getSelectedTab(page);
        await tab.locator('#goto-nested-page1-with-query-params').click();
        await testTabTitle(page, 'Tab 1 - Page 2 (1)');
        await testUrlContains(page, expectNestedTabUrlToContain);

        await page.locator('#tab-button-account').click();
        await testTabTitle(page, 'Tab 1 - Page 1');

        await testUrlEquals(page, await url);
      });
    });

    test.describe('entry tab contains navigation extras', () => {
      const expectNestedTabUrlToContain = 'search=hello#fragment';
      const rootUrlParams = 'test=123#rootFragment';
      const rootUrl = `/lazy/tabs/account?${rootUrlParams}`;

      test.beforeEach(async ({ page }) => {
        await page.goto(rootUrl);
      });

      test('should preserve root url navigation extras when clicking on an active tab to navigate to the root', async ({ page }) => {
        const tab = await getSelectedTab(page);
        await tab.locator('#goto-nested-page1-with-query-params').click();

        await testTabTitle(page, 'Tab 1 - Page 2 (1)');
        await testUrlContains(page, expectNestedTabUrlToContain);

        await page.locator('#tab-button-account').click();
        await testTabTitle(page, 'Tab 1 - Page 1');

        await testUrlContains(page, rootUrl);
      });

      test('should preserve root url navigation extras when changing tabs', async ({ page }) => {
        await getSelectedTab(page);
        await page.locator('#tab-button-contact').click();
        await testTabTitle(page, 'Tab 2 - Page 1');

        await page.locator('#tab-button-account').click();
        await testTabTitle(page, 'Tab 1 - Page 1');

        await testUrlContains(page, rootUrl);
      });

      test('should navigate deep then go home and preserve navigation extras', async ({ page }) => {
        let tab = await getSelectedTab(page);
        await tab.locator('#goto-tab1-page2').click();
        await ionPageVisible(page, 'app-tabs-tab1-nested');
        await ionPageHidden(page, 'app-tabs-tab1');

        tab = await testTabTitle(page, 'Tab 1 - Page 2 (1)');

        await tab.locator('#goto-next').click();
        await ionPageVisible(page, 'app-tabs-tab1-nested:last-of-type');
        await ionPageHidden(page, 'app-tabs-tab1-nested:first-of-type');

        await testTabTitle(page, 'Tab 1 - Page 2 (2)');

        await ionTabClick(page, 'Tab Two');
        await ionPageVisible(page, 'app-tabs-tab2');
        await ionPageHidden(page, 'app-tabs-tab1-nested:last-of-type');

        await testTabTitle(page, 'Tab 2 - Page 1');

        await ionTabClick(page, 'Tab One');
        await ionPageVisible(page, 'app-tabs-tab1-nested:last-of-type');
        await ionPageHidden(page, 'app-tabs-tab2');

        await testTabTitle(page, 'Tab 1 - Page 2 (2)');

        await ionTabClick(page, 'Tab One');
        /**
         * Wait for the leaving view to
         * be unmounted otherwise testTabTitle
         * may get the leaving view before it
         * is unmounted.
         */
        await ionPageVisible(page, 'app-tabs-tab1');
        await ionPageDoesNotExist(page, 'app-tabs-tab1-nested');

        await testTabTitle(page, 'Tab 1 - Page 1');

        await testUrlContains(page, rootUrl);
      });
    });

    test.describe('entry url - /tabs/account', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('/lazy/tabs/account');
      });

      test('should pop to previous view when leaving tabs outlet', async ({ page }) => {
        let tab = await getSelectedTab(page);
        await expect(tab.locator('ion-title')).toContainText('Tab 1 - Page 1');

        await page.locator('#goto-tab1-page2').click();

        tab = await getSelectedTab(page);
        await expect(tab.locator('ion-title')).toContainText('Tab 1 - Page 2 (1)');

        await page.locator('#goto-global').click();

        // Wait for navigation to complete
        await page.waitForTimeout(100);

        // Check for the global page title - target the specific title in the global page
        await expect(page.locator('ion-title').filter({ hasText: 'Global Page' })).toBeVisible();

        await page.locator('#goto-prev-pop').click();

        tab = await getSelectedTab(page);
        await expect(tab.locator('ion-title')).toContainText('Tab 1 - Page 2 (1)');

        await page.locator('#goto-prev').click();

        tab = await getSelectedTab(page);
        await expect(tab.locator('ion-title')).toContainText('Tab 1 - Page 1');

        /**
         * Verifies that when entering the tabs outlet directly,
         * the navController.pop() method does not pop the previous view,
         * when you are at the root of the tabs outlet.
         */
        await page.locator('#goto-previous-page').click();

        tab = await getSelectedTab(page);
        await expect(tab.locator('ion-title')).toContainText('Tab 1 - Page 1');
      });
    });

    test.describe('entry url - /', () => {
      test('should pop to the root outlet from the tabs outlet', async ({ page }) => {
        await page.goto('/lazy/');

        await expect(page.locator('ion-title')).toContainText('Test App');

        await page.locator('ion-item').filter({ hasText: 'Tabs Test' }).first().click();

        let tab = await getSelectedTab(page);
        await expect(tab.locator('ion-title')).toContainText('Tab 1 - Page 1');

        await page.locator('#goto-tab1-page2').click();

        tab = await getSelectedTab(page);
        await expect(tab.locator('ion-title')).toContainText('Tab 1 - Page 2 (1)');

        await page.locator('#goto-global').click();

        // Wait for navigation to complete
        await page.waitForTimeout(100);

        // Check for the global page title - target the specific title in the global page
        await expect(page.locator('ion-title').filter({ hasText: 'Global Page' })).toBeVisible();

        await page.locator('#goto-prev-pop').click();

        tab = await getSelectedTab(page);
        await expect(tab.locator('ion-title')).toContainText('Tab 1 - Page 2 (1)');

        await page.locator('#goto-prev').click();

        tab = await getSelectedTab(page);
        await expect(tab.locator('ion-title')).toContainText('Tab 1 - Page 1');

        await page.locator('#goto-previous-page').click();

        // Wait for navigation to complete
        await page.waitForTimeout(100);

        // Check for the root app title - target the specific title that contains "Test App"
        await expect(page.locator('ion-title').filter({ hasText: 'Test App' })).toBeVisible();
      });
    });

    test.describe('entry url - /tabs/account/nested/1', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('/lazy/tabs/account/nested/1');
      });

      test('should only display the back-button when there is a page in the stack', async ({ page }) => {
        let tab = await getSelectedTab(page);
        await expect(tab.locator('ion-back-button')).not.toBeVisible();
        await testTabTitle(page, 'Tab 1 - Page 2 (1)');
        await testStack(page, 'ion-tabs ion-router-outlet', ['app-tabs-tab1-nested']);

        await page.locator('#tab-button-account').click();
        tab = await testTabTitle(page, 'Tab 1 - Page 1');

        await tab.locator('#goto-tab1-page2').click();
        tab = await testTabTitle(page, 'Tab 1 - Page 2 (1)');
        await expect(tab.locator('ion-back-button')).toBeVisible();
      });

      test('should not reuse the same page', async ({ page }) => {
        let tab = await testTabTitle(page, 'Tab 1 - Page 2 (1)');
        await tab.locator('#goto-next').click();
        tab = await testTabTitle(page, 'Tab 1 - Page 2 (2)');

        await tab.locator('#goto-next').click();
        tab = await testTabTitle(page, 'Tab 1 - Page 2 (3)');

        await testStack(page, 'ion-tabs ion-router-outlet', [
          'app-tabs-tab1-nested',
          'app-tabs-tab1-nested',
          'app-tabs-tab1-nested'
        ]);

        tab = await getSelectedTab(page);
        await tab.locator('ion-back-button').click();
        tab = await testTabTitle(page, 'Tab 1 - Page 2 (2)');
        await tab.locator('ion-back-button').click();
        tab = await testTabTitle(page, 'Tab 1 - Page 2 (1)');

        await expect(tab.locator('ion-back-button')).not.toBeVisible();

        await testStack(page, 'ion-tabs ion-router-outlet', ['app-tabs-tab1-nested']);
      });
    });

    test.describe('entry url - /tabs/lazy', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('/lazy/tabs/lazy');
      });

      test('should not display the back-button if coming from a different stack', async ({ page }) => {
        let tab = await testTabTitle(page, 'Tab 3 - Page 1');
        await testStack(page, 'ion-tabs ion-router-outlet', ['app-tabs-tab3']);

        tab = await getSelectedTab(page);
        await tab.locator('#goto-tab1-page2').click();
        await testStack(page, 'ion-tabs ion-router-outlet', ['app-tabs-tab3', 'app-tabs-tab1-nested']);

        tab = await testTabTitle(page, 'Tab 1 - Page 2 (1)');
        await expect(tab.locator('ion-back-button')).not.toBeVisible();
      });
    });

    test.describe('enter url - /tabs/contact/one', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('/lazy/tabs/contact/one');
      });

      test('should return to correct tab after going to page in different outlet', async ({ page }) => {
        const tab = await getSelectedTab(page);
        await tab.locator('#goto-nested-page1').click();
        await testStack(page, 'app-nested-outlet ion-router-outlet', ['app-nested-outlet-page']);

        const nestedOutlet = page.locator('app-nested-outlet');
        await nestedOutlet.locator('ion-back-button').click();

        await testTabTitle(page, 'Tab 2 - Page 1');
      });
    });
  });

  test.describe('Without IonRouterOutlet', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/lazy/tabs-basic');
    });

    test('should show correct tab when clicking the tab button', async ({ page }) => {
      await expect(page.locator('ion-tab[tab="tab1"]')).toBeVisible();
      await expect(page.locator('ion-tab[tab="tab2"]')).not.toBeVisible();

      await page.locator('ion-tab-button[tab="tab2"]').click();

      await expect(page.locator('ion-tab[tab="tab1"]')).not.toBeVisible();
      await expect(page.locator('ion-tab[tab="tab2"]')).toBeVisible();
    });

    test('should not change the URL when clicking the tab button', async ({ page }) => {
      await expect(page).toHaveURL(/.*\/tabs-basic/);

      await page.locator('ion-tab-button[tab="tab2"]').click();

      await expect(page).toHaveURL(/.*\/tabs-basic/);
    });
  });
});

test('Tabs should support conditional slots', async ({ page }) => {
  await page.goto('/lazy/tabs-slots');

  await expect(page.locator('ion-tabs .tabs-inner + ion-tab-bar')).toHaveCount(1);

  // Click the button to change the slot to the top
  await page.locator('#set-slot-top').click();

  // The tab bar should be removed from the bottom
  await expect(page.locator('ion-tabs .tabs-inner + ion-tab-bar')).toHaveCount(0);

  // The tab bar should be added to the top
  await expect(page.locator('ion-tabs ion-tab-bar + .tabs-inner')).toHaveCount(1);

  // Click the button to change the slot to the bottom
  await page.locator('#set-slot-bottom').click();

  // The tab bar should be removed from the top
  await expect(page.locator('ion-tabs ion-tab-bar + .tabs-inner')).toHaveCount(0);

  // The tab bar should be added to the bottom
  await expect(page.locator('ion-tabs .tabs-inner + ion-tab-bar')).toHaveCount(1);
});
