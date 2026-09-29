import { test, expect } from '@playwright/test';
import { ionPageVisible, ionGoBack, ionGoForward, withTestingMode } from './utils/test-utils';

/**
 * Verifies that StackManager preserves non-parameterized leaf views on
 * browser-back (pop) so React state survives forward-pop round-trips.
 * The test page deliberately changes its rendered content between navigations
 * (items -> empty) to prove the same view instance is reused.
 */
test.describe('Content Change Navigation', () => {

  test('clearing content then navigating away should preserve cleared state on revisit', async ({ page }) => {
    await page.goto(withTestingMode('/content-change-navigation'));
    await ionPageVisible(page, 'content-nav-home');

    // Navigate to list page - items should be visible
    await page.locator('[data-testid="go-to-list"]').click();
    await ionPageVisible(page, 'list-page');
    await expect(page.locator('ion-item')).toHaveCount(3);

    // Clear items and navigate to home
    await page.locator('[data-testid="clear-and-navigate"]').click();
    await ionPageVisible(page, 'content-nav-home');

    // Navigate to list page again -- the view was preserved (forward push does
    // not destroy the leaving view), so React state persists: items are still
    // empty and the empty-page variant renders.
    await page.locator('[data-testid="go-to-list"]').click();
    await ionPageVisible(page, 'list-empty-page');
    await expect(page.locator('[data-testid="empty-view"]')).toBeVisible();
  });

  test('browser back should preserve React state of the leaving view', async ({ page }) => {
    await page.goto(withTestingMode('/content-change-navigation'));
    await ionPageVisible(page, 'content-nav-home');

    // Navigate to list page
    await page.locator('[data-testid="go-to-list"]').click();
    await ionPageVisible(page, 'list-page');
    await expect(page.locator('ion-item')).toHaveCount(3);

    // Clear items, then use the routerLink to go home (forward push)
    await page.locator('[data-testid="clear-and-navigate"]').click();
    await ionPageVisible(page, 'content-nav-home');

    // Browser back to the list -- pop preserves the non-parameterized view,
    // so the cleared (empty) state survives the round-trip.
    await ionGoBack(page, '/content-change-navigation/list');
    await ionPageVisible(page, 'list-empty-page');
    await expect(page.locator('[data-testid="empty-view"]')).toBeVisible();
    await expect(page.locator('ion-item')).toHaveCount(0);
  });

  test('browser back on non-parameterized route with animations should show entering page', async ({ page }) => {
    // NO withTestingMode -- animations must run to test the real transition path
    await page.goto('/content-change-navigation');
    await ionPageVisible(page, 'content-nav-home');

    await page.locator('[data-testid="go-to-list"]').click();
    await ionPageVisible(page, 'list-page');

    // Browser back with animations enabled; ionPageVisible auto-retries until
    // the entering page finishes its transition.
    await page.goBack();
    await ionPageVisible(page, 'content-nav-home');
  });

  test('browser forward should restore list view after back', async ({ page }) => {
    await page.goto(withTestingMode('/content-change-navigation'));
    await ionPageVisible(page, 'content-nav-home');

    // Navigate to list page
    await page.locator('[data-testid="go-to-list"]').click();
    await ionPageVisible(page, 'list-page');
    await expect(page.locator('ion-item')).toHaveCount(3);

    // Browser back to home
    await ionGoBack(page, '/content-change-navigation/home');
    await ionPageVisible(page, 'content-nav-home');

    // Browser forward to list -- view preserved, items still present
    await ionGoForward(page, '/content-change-navigation/list');
    await ionPageVisible(page, 'list-page');
    await expect(page.locator('ion-item')).toHaveCount(3);
  });

});
