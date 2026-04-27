import { test, expect } from '@playwright/test';
import {
  ionPageVisible,
  ionPageDoesNotExist,
  ionBackClick,
  ionNav,
  ionGoBack,
  withTestingMode,
} from './utils/test-utils';

test.describe('Replace History Entries', () => {
  /**
   * Tests that replace navigation does not create duplicate browser history entries
   * when using browser back for all navigation.
   *
   * Flow: home -> page1 -> push page2 -> replace page3 -> browser back -> page1 -> browser back -> home
   */
  test('replace should not create duplicate history entries with browser back', async ({ page }) => {
    await page.goto(withTestingMode('/'));
    await ionPageVisible(page, 'home');

    // Navigate to the replace-action test
    await ionNav(page, 'ion-item', 'Replace Action');
    await ionPageVisible(page, 'page1');

    // Push to page2
    await page.locator('#go-to-page2').click();
    await ionPageVisible(page, 'page2');

    // Replace page2 with page3
    await page.locator('#go-to-page3').click();
    await ionPageVisible(page, 'page3');
    await ionPageDoesNotExist(page, 'page2');

    // Browser back from page3 -> page1 (page2 was replaced)
    await ionGoBack(page, '/replace-action/page1');
    await ionPageVisible(page, 'page1');

    // Browser back from page1 -> home, NOT page1 again
    await ionGoBack(page, '/');
    await ionPageVisible(page, 'home');
  });

  /**
   * Tests that Ionic back button + browser back does not create duplicate entries.
   *
   * The Ionic back button calls handleNavigateBack which may use navigate(-1) or
   * handleNavigate (replace). If it incorrectly uses a replace, the browser history
   * will have page1 twice: once from the original navigation and once from the
   * replace that overwrote page3's entry.
   *
   * Flow: home -> page1 -> push page2 -> replace page3 -> IonBackButton -> page1 -> browser back -> home
   */
  test('ionic back button after replace should not create duplicate history entries', async ({ page }) => {
    await page.goto(withTestingMode('/'));
    await ionPageVisible(page, 'home');

    // Navigate to the replace-action test
    await ionNav(page, 'ion-item', 'Replace Action');
    await ionPageVisible(page, 'page1');

    // Push to page2
    await page.locator('#go-to-page2').click();
    await ionPageVisible(page, 'page2');

    // Replace page2 with page3
    await page.locator('#go-to-page3').click();
    await ionPageVisible(page, 'page3');
    await ionPageDoesNotExist(page, 'page2');

    // Use the IonBackButton (not browser back) from page3
    await ionBackClick(page, 'page3');
    await ionPageVisible(page, 'page1');
    await expect(page).toHaveURL(/\/replace-action\/page1/);

    // Browser back from page1 -> should go to home, NOT page1 again
    await ionGoBack(page);
    // Page1 should no longer be visible - we should be at home
    const url = page.url();
    expect(url).not.toContain('/replace-action/page1');
    await ionPageVisible(page, 'home');
  });

  /**
   * Tests browser forward still works after going back from a replaced page.
   * This verifies navigate(-1) is used (not replace) for the back navigation.
   */
  test('browser forward should work after going back from replaced page', async ({ page }) => {
    await page.goto(withTestingMode('/'));
    await ionPageVisible(page, 'home');

    await ionNav(page, 'ion-item', 'Replace Action');
    await ionPageVisible(page, 'page1');

    await page.locator('#go-to-page2').click();
    await ionPageVisible(page, 'page2');

    await page.locator('#go-to-page3').click();
    await ionPageVisible(page, 'page3');
    await ionPageDoesNotExist(page, 'page2');

    // Browser back -> page1
    await ionGoBack(page, '/replace-action/page1');
    await ionPageVisible(page, 'page1');

    // Browser forward -> page3 (forward history should be preserved)
    await page.goForward();
    await page.waitForTimeout(500);
    await ionPageVisible(page, 'page3');
  });

  /**
   * Tests the "Replace to Page1" button on Page3 which uses ionRouter.push
   * with routeAction='replace'. This goes through handleNavigate() rather than
   * React Router's navigate() directly.
   *
   * Flow: home -> page1 -> page2 -> replace page3 -> replace back to page1 -> browser back -> home
   */
  test('ionRouter.push with replace should not create duplicate history entries', async ({ page }) => {
    // Note: NOT using withTestingMode() - search params interfere with replace-to-existing
    await page.goto('/');
    await ionPageVisible(page, 'home');

    await ionNav(page, 'ion-item', 'Replace Action');
    await ionPageVisible(page, 'page1');

    // Push to page2
    await page.locator('#go-to-page2').click();
    await ionPageVisible(page, 'page2');

    // Replace page2 with page3
    await page.locator('#go-to-page3').click();
    await ionPageVisible(page, 'page3');
    await ionPageDoesNotExist(page, 'page2');

    // Replace page3 back to page1 using ionRouter.push
    await page.locator('#replace-to-page1').click();
    await page.waitForTimeout(500);
    await ionPageVisible(page, 'page1');
    await expect(page).toHaveURL(/\/replace-action\/page1/);

    // Browser back from page1 should go to home, NOT page1 again.
    // If replace creates duplicates, browser history would be:
    // [home, page1, page1] (page1 at its original slot + page1 replacing page3)
    await page.goBack();
    await page.waitForTimeout(500);

    const url = page.url();
    expect(url).not.toContain('/replace-action');
    await ionPageVisible(page, 'home');
  });

  /**
   * Regression test: revisiting a Navigate-replace redirect route after the pop-preserve
   * path kept the target view alive must not unmount that view mid-transition.
   *
   * Flow: home -> /replace-action (redirects to page1) -> page2 -> page3 -> back -> back (home) -> revisit /replace-action
   *
   * Without the re-entry guard on the delayed unmount, page1 is removed from the DOM
   * after the second redirect completes, leaving a blank outlet.
   */
  test('revisiting a navigate-replace redirect after back should keep target page mounted', async ({ page }) => {
    await page.goto(withTestingMode('/'));
    await ionPageVisible(page, 'home');

    await ionNav(page, 'ion-item', 'Replace Action');
    await ionPageVisible(page, 'page1');

    await page.locator('#go-to-page2').click();
    await ionPageVisible(page, 'page2');

    await page.locator('#go-to-page3').click();
    await ionPageVisible(page, 'page3');

    await ionBackClick(page, 'page3');
    await ionPageVisible(page, 'page1');

    await ionBackClick(page, 'page1');
    await ionPageVisible(page, 'home');

    // Revisit the replace-action route. page1 was kept alive by pop-preserve and must
    // survive the push-cleanup path once the Navigate replace re-enters it.
    await ionNav(page, 'ion-item', 'Replace Action');
    await ionPageVisible(page, 'page1');

    // Wait past the 250ms unmount delay and assert page1 is still present.
    await page.waitForTimeout(500);
    await ionPageVisible(page, 'page1');
  });

  /**
   * Tests replace with animations enabled (no ionic:_testing=true).
   * Animation timing can affect how history entries are processed.
   */
  test('replace should not create duplicate history entries with animations', async ({ page }) => {
    await page.goto('/');
    await ionPageVisible(page, 'home');

    await ionNav(page, 'ion-item', 'Replace Action');
    await ionPageVisible(page, 'page1');

    await page.locator('#go-to-page2').click();
    await ionPageVisible(page, 'page2');

    await page.locator('#go-to-page3').click();
    await ionPageVisible(page, 'page3');

    // Wait for replace animation and cleanup
    await page.waitForTimeout(500);
    await ionPageDoesNotExist(page, 'page2');

    // Browser back from page3 -> page1
    await page.goBack();
    await page.waitForTimeout(500);
    await ionPageVisible(page, 'page1');

    // Browser back from page1 -> home (not page1 again)
    await page.goBack();
    await page.waitForTimeout(500);
    await ionPageVisible(page, 'home');
  });
});
