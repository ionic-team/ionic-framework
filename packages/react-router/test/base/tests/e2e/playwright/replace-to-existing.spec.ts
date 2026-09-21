import { test, expect } from '@playwright/test';
import { ionPageVisible, ionPageDoesNotExist } from './utils/test-utils';

test.describe('Replace to Existing Page', () => {
  /**
   * Regression test for #30086:
   * Replace navigate to a page already in the Ionic location history silently
   * fails when using Ionic's handleNavigate() (useIonRouter.push with routeAction='replace').
   *
   * Route sequence: /page1 --(push)--> /page2 --(replace)--> /page3
   * From /page3, replace back to /page1 should succeed.
   *
   * Note: This test intentionally does NOT use withTestingMode() because
   * `?ionic:_testing=true` in the URL would cause a search param mismatch that
   * prevents the bug scenario from triggering.
   */
  test('replace navigate to a page already in location history should succeed', async ({ page }) => {
    // Navigate WITHOUT ionic:_testing=true — search params must be empty to match
    // the replace destination exactly and reproduce the bug scenario.
    await page.goto('/replace-action/page1');
    await ionPageVisible(page, 'page1');

    // 1. Push to page2
    await page.locator('#go-to-page2').click();
    await ionPageVisible(page, 'page2');

    // 2. Replace page2 with page3
    await page.locator('#go-to-page3').click();
    await ionPageVisible(page, 'page3');
    await ionPageDoesNotExist(page, 'page2');

    // 3. Replace page3 back to page1 — destination matches the previous() entry,
    //    which was the bug trigger (#30086).
    await page.locator('#replace-to-page1').click();
    await ionPageVisible(page, 'page1');
    await expect(page).toHaveURL(/\/replace-action\/page1/);
    await ionPageDoesNotExist(page, 'page3');
  });
});
