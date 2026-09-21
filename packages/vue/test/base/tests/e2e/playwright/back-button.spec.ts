import { test, expect } from './utils/test-base';
import { ionPageVisible } from './utils/test-utils';

/**
 * Regression coverage for ion-back-button inside an ion-nav (e.g. a modal),
 * where clicking back must pop the ion-nav stack only and leave the outer
 * router untouched.
 *
 * Animations are disabled by default via the test-base fixture so the tests
 * are deterministic.
 */

test.describe('IonBackButton', () => {
  // ion-back-button inside an ion-nav (e.g. inside a modal) should pop the
  // ion-nav stack only and leave the underlying router untouched. Regression
  // test for the case where clicking back on a NavChild inside a modal would
  // also fire router.back() and leave the user at '/' once the modal dismissed.
  test('back button inside ion-nav does not affect outer router', async ({ page }) => {
    await page.goto('/navigation');
    await ionPageVisible(page, 'navigation');
    expect(new URL(page.url()).pathname).toBe('/navigation');

    await page.locator('#open-nav-modal').click();
    await expect(page.locator('ion-modal ion-nav')).toBeVisible();
    await expect(page.locator('ion-modal #nav-root-params')).toBeVisible();

    await page.locator('#push-nav-child').click();
    await expect(page.locator('ion-modal #nav-child-content')).toBeVisible();

    await page.locator('ion-modal ion-back-button').click();
    await expect(page.locator('ion-modal #nav-root-params')).toBeVisible();
    await expect(page.locator('ion-modal #nav-child-content')).toHaveCount(0);

    // The router must not have moved off /navigation. Before the fix in
    // IonBackButton, the click also fired router.back(), so dismissing the
    // modal here would have left the user at '/'.
    expect(new URL(page.url()).pathname).toBe('/navigation');
  });
});
