import { test, expect } from '@playwright/test';
import { ionPageVisible, ionGoBack, ionGoForward, withTestingMode } from './utils/test-utils';

/**
 * Regression tests for browser forward navigation to routes that use
 * IonRouterOutlet with ionPage prop (OutletPageManager).
 *
 * Bug: navigating forward to a route with an ionPage outlet, going back,
 * then using browser forward would leave the ionPage outlet stuck with
 * ion-page-invisible (opacity: 0), rendering a blank page.
 *
 * Root cause: React strict mode (or createRoot) double-fires componentDidMount.
 * Each call scheduled an async componentOnReady callback. The second callback
 * re-added ion-page-invisible after the first callback's transition removed it.
 * registerIonPage returned early (same element), so no transition re-ran.
 */
test.describe('Browser forward: ionPage outlet visibility', () => {
  test('modal-aria-hidden page should be visible after back then forward (no animations)', async ({ page }) => {
    await page.goto(withTestingMode('/'));
    await ionPageVisible(page, 'home');

    // Navigate to modal-aria-hidden (has ionPage outlets)
    await page.locator('ion-item').filter({ hasText: 'Modal Aria Hidden' }).click();
    await page.waitForTimeout(300);
    await expect(page).toHaveURL(/modal-aria-hidden\/section-a/);

    // Verify Page A is visible
    await ionPageVisible(page, 'modal-page-a');

    // Go back to home
    await ionGoBack(page, '/');
    await ionPageVisible(page, 'home');

    // Browser forward
    await ionGoForward(page, 'modal-aria-hidden/section-a');

    // Page A must be visible (not stuck with ion-page-invisible)
    await ionPageVisible(page, 'modal-page-a');
  });

  test('nested-outlet2 home should be visible after back then forward (no animations)', async ({ page }) => {
    await page.goto(withTestingMode('/'));
    await ionPageVisible(page, 'home');

    // Navigate to nested-outlet2 (has ionPage outlets)
    await page.locator('ion-item').filter({ hasText: 'Nested Outlet 2' }).click();
    await page.waitForTimeout(300);
    await expect(page).toHaveURL(/nested-outlet2\/home/);

    // Go back to home
    await ionGoBack(page, '/');
    await ionPageVisible(page, 'home');

    // Browser forward
    await ionGoForward(page, 'nested-outlet2/home');

    // Nested outlet page must be visible
    const homePage = page.locator('div.ion-page[data-pageid="home"]').filter({
      has: page.locator('ion-title:has-text("Home")'),
    });
    await expect(homePage).toBeVisible();
    await expect(homePage).not.toHaveClass(/ion-page-invisible/);
    await expect(homePage).not.toHaveClass(/ion-page-hidden/);
  });

  test('modal-aria-hidden page should be visible after back then forward (with animations)', async ({ page }) => {
    await page.goto('/');
    await ionPageVisible(page, 'home');

    // Navigate to modal-aria-hidden
    await page.locator('ion-item').filter({ hasText: 'Modal Aria Hidden' }).click();
    await page.waitForTimeout(500);
    await expect(page).toHaveURL(/modal-aria-hidden\/section-a/);
    await ionPageVisible(page, 'modal-page-a');

    // Go back
    await page.goBack();
    await page.waitForTimeout(500);
    await ionPageVisible(page, 'home');

    // Browser forward
    await page.goForward();
    await page.waitForTimeout(500);
    await expect(page).toHaveURL(/modal-aria-hidden\/section-a/);

    // Page A must be visible
    await ionPageVisible(page, 'modal-page-a');
  });
});
