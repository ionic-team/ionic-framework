import { test, expect } from '@playwright/test';
import { ionPageVisible, withTestingMode } from './utils/test-utils';

test.describe('Nested Params', () => {

  /**
   * Regression: navigating to a parameterized route, back to landing,
   * then to a different param, back, and to the same param again caused
   * an infinite loop that locked up the browser.
   *
   * Steps: user 99 -> landing -> user 42 -> landing -> user 42 (loop)
   */
  test('should not infinite loop when revisiting a parameterized route after visiting a different param', async ({ page }) => {
    // Use a tight timeout -- if the infinite loop fires, the browser locks up
    // and this test would hang forever without it.
    test.setTimeout(15_000);

    await page.goto(withTestingMode('/nested-params'));
    await ionPageVisible(page, 'nested-params-landing');

    // Step 1: Navigate to user 99 details
    await page.locator('#go-to-user-99').click();
    await expect(page.getByText('Details view user: 99')).toBeVisible();

    // Step 2: Back to landing via routerLink (push).
    // Scope to user 99's layout page -- the details page inside it doesn't get
    // .ion-page-hidden (only the parent UserLayout does), so filtering by the
    // nearest .ion-page ancestor is insufficient when multiple user layouts exist.
    await page.locator('[data-pageid="nested-params-user-99"]:not(.ion-page-hidden) #back-to-landing').click();
    await ionPageVisible(page, 'nested-params-landing');

    // Step 3: Navigate to user 42 details
    await page.locator('#go-to-user-42').click();
    await expect(page.getByText('Details view user: 42')).toBeVisible();

    // Step 4: Back to landing via routerLink (push).
    // Scope to user 42's layout page (same rationale as step 2).
    await page.locator('[data-pageid="nested-params-user-42"]:not(.ion-page-hidden) #back-to-landing').click();
    await ionPageVisible(page, 'nested-params-landing');

    // Step 5: Navigate to user 42 details AGAIN -- this triggered the infinite loop
    await page.locator('#go-to-user-42').click();
    await expect(page.getByText('Details view user: 42')).toBeVisible();
    await expect(page.getByText('Layout sees user: 42')).toBeVisible();
  });

});
