import { test, expect } from '@playwright/test';
import {
  ionPageVisible, ionPageHidden, ionPageDoesNotExist,
  ionNav, ionBackClick, ionTabClick, ionGoBack, withTestingMode
} from './utils/test-utils';

test.describe('Tabs', () => {
  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/23101
  test('should return to previous tab instance when using the ion-back-button', async ({ page }) => {
    await page.goto(withTestingMode('/tabs/tab1'));

    await page.locator('#tabs-secondary').click();
    await ionPageVisible(page, 'tab1-secondary');

    await page.locator('ion-tab-button#tab-button-tab2-secondary').click();
    await ionPageHidden(page, 'tab1-secondary');
    await ionPageVisible(page, 'tab2-secondary');

    await page.locator('ion-tab-button#tab-button-tab1-secondary').click();
    await ionPageHidden(page, 'tab2-secondary');
    await ionPageVisible(page, 'tab1-secondary');

    await ionBackClick(page, 'tab1-secondary');
    await ionPageDoesNotExist(page, 'tabs-secondary');
    await ionPageVisible(page, 'tab1');
  });

  // Verifies that /tabs outlet uses segment-aware scope checking
  // so /tabs-secondary is not treated as a prefix match of /tabs
  test('should hide /tabs views when navigating to /tabs-secondary (segment-aware scope)', async ({ page }) => {
    await page.goto(withTestingMode('/tabs/tab1'));
    await ionPageVisible(page, 'tab1');

    await page.locator('#tabs-secondary').click();
    await ionPageVisible(page, 'tab1-secondary');
    await ionPageDoesNotExist(page, 'tab1');
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/25141
  test('browser back from preserved child page should sync URL and display', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/25141',
    });

    await page.goto(withTestingMode('/tabs/tab1'));
    await ionPageVisible(page, 'tab1');

    await page.locator('#child-one').click();
    await ionPageHidden(page, 'tab1');
    await ionPageVisible(page, 'tab1child1');

    await ionTabClick(page, 'Tab2');
    await ionPageHidden(page, 'tab1child1');
    await ionPageVisible(page, 'tab2');

    await ionTabClick(page, 'Tab1');
    await ionPageHidden(page, 'tab2');
    await ionPageVisible(page, 'tab1child1');

    await ionGoBack(page, '/tabs/tab1');
    await ionPageDoesNotExist(page, 'tab1child1');
    await ionPageVisible(page, 'tab1');
    await expect(page.locator('ion-tab-button.tab-selected')).toContainText('Tab1');
  });

  // Verifies that defaultHref works on direct deep-link load of a tab child page
  test('back button defaultHref should work on direct deep-link load of tab child page', async ({ page }) => {
    await page.goto(withTestingMode('/tabs/tab1/child'));
    await ionPageVisible(page, 'tab1child1');

    await ionBackClick(page, 'tab1child1');
    await ionPageVisible(page, 'tab1');
    await expect(page).toHaveURL(/\/tabs\/tab1$/);
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/23087
  test('should return to correct view and url when going back from child page after switching tabs', async ({ page }) => {
    await page.goto(withTestingMode('/tabs/tab1'));

    await page.locator('#child-one').click();
    await ionPageHidden(page, 'tab1');
    await ionPageVisible(page, 'tab1child1');

    await page.locator('ion-tab-button#tab-button-tab2').click();
    await ionPageHidden(page, 'tab1child1');
    await ionPageVisible(page, 'tab2');

    await page.locator('ion-tab-button#tab-button-tab1').click();
    await ionPageHidden(page, 'tab2');
    await ionPageVisible(page, 'tab1child1');

    await ionBackClick(page, 'tab1child1');
    await ionPageDoesNotExist(page, 'tab1child1');
    await ionPageVisible(page, 'tab1');

    await expect(page).toHaveURL(/\/tabs\/tab1/);
  });
});
