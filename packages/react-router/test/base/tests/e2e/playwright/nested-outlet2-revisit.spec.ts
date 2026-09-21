import { test, expect } from '@playwright/test';
import { ionPageVisible, ionNav, ionGoBack, withTestingMode } from './utils/test-utils';

/**
 * Regression tests for navigating from a nested outlet child page to a different
 * nested outlet's child page, going back, then navigating forward again.
 *
 * Bug: navigating from /nested-outlet2/home/welcome to /nested-outlet2/list/1,
 * going back, then clicking "Go to first item" again would show the Item page
 * but without the back button (can-go-back class missing on the IonPage wrapper).
 *
 * Root cause: when entering === leaving view (same parameterized route re-navigated),
 * handleReadyEnteringView skipped transitionPage/commit, so can-go-back was never set.
 */
test.describe('Nested outlet 2: revisit cross-outlet navigation', () => {
  test('back button should appear on second forward navigation (no animations)', async ({ page }) => {
    await page.goto(withTestingMode('/nested-outlet2/home/welcome'));
    await ionPageVisible(page, 'welcome');

    // First navigation: Welcome -> Item #1
    await ionNav(page, 'ion-item', 'Go to first item');
    await ionPageVisible(page, 'item');
    await expect(page).toHaveURL(/nested-outlet2\/list\/1/);

    // Back button should be visible the first time
    const backBtn = page.locator('[data-pageid="item"] ion-back-button');
    await expect(backBtn).toBeVisible();

    // Go back to Welcome
    await ionGoBack(page, 'nested-outlet2/home/welcome');
    await ionPageVisible(page, 'welcome');

    // Second navigation: Welcome -> Item #1 again
    await ionNav(page, 'ion-item', 'Go to first item');
    await ionPageVisible(page, 'item');
    await expect(page).toHaveURL(/nested-outlet2\/list\/1/);

    // Back button must still be visible the second time
    await expect(backBtn).toBeVisible();
  });

  test('back button should appear on second forward navigation (with animations)', async ({ page }) => {
    await page.goto('/nested-outlet2/home/welcome');
    await ionPageVisible(page, 'welcome');

    // First navigation: Welcome -> Item #1
    await ionNav(page, 'ion-item', 'Go to first item');
    await page.waitForTimeout(500);
    await ionPageVisible(page, 'item');
    await expect(page).toHaveURL(/nested-outlet2\/list\/1/);

    // Back button should be visible the first time
    const backBtn = page.locator('[data-pageid="item"] ion-back-button');
    await expect(backBtn).toBeVisible();

    // Go back to Welcome via browser back
    await page.goBack();
    await page.waitForTimeout(500);
    await ionPageVisible(page, 'welcome');

    // Second navigation: Welcome -> Item #1 again
    await ionNav(page, 'ion-item', 'Go to first item');
    await page.waitForTimeout(500);
    await ionPageVisible(page, 'item');
    await expect(page).toHaveURL(/nested-outlet2\/list\/1/);

    // Back button must still be visible the second time
    await expect(backBtn).toBeVisible();
  });

  test('should load list page on second forward navigation from welcome', async ({ page }) => {
    await page.goto(withTestingMode('/nested-outlet2/home/welcome'));
    await ionPageVisible(page, 'welcome');

    // First navigation: Welcome -> List
    await ionNav(page, 'ion-item', 'Go to list from Welcome');
    await ionPageVisible(page, 'list');
    await expect(page).toHaveURL(/nested-outlet2\/list/);

    // Go back to Welcome
    await ionGoBack(page, 'nested-outlet2/home/welcome');
    await ionPageVisible(page, 'welcome');

    // Second navigation: Welcome -> List again
    await ionNav(page, 'ion-item', 'Go to list from Welcome');
    await ionPageVisible(page, 'list');
    await expect(page).toHaveURL(/nested-outlet2\/list/);
  });
});
