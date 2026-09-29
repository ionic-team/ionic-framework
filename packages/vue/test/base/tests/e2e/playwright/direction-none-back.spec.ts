import { test, expect } from './utils/test-base';
import { ionPageVisible, ionPageDoesNotExist, ionBackClick } from './utils/test-utils';

/**
 * Tests that ion-back-button works correctly after navigating with
 * router-direction="none". The back button should use history to determine
 * the previous page, not fall back to defaultHref.
 *
 * @see https://github.com/ionic-team/ionic-framework/issues/24074
 */
test.describe('router-direction="none" Back Button', () => {
  test('back button should return to Page A after navigating with direction "forward"', async ({ page }) => {
    await page.goto('/direction-none-back/a');
    await ionPageVisible(page, 'direction-none-page-a');

    await page.locator('ion-button#go-forward').click();
    await ionPageVisible(page, 'direction-none-page-b');

    await ionBackClick(page, 'direction-none-page-b');
    await ionPageDoesNotExist(page, 'direction-none-page-fallback');
    await ionPageVisible(page, 'direction-none-page-a');
    expect(new URL(page.url()).pathname).toBe('/direction-none-back/a');
  });

  test('back button should return to Page A after navigating with direction "none"', async ({ page }) => {
    await page.goto('/direction-none-back/a');
    await ionPageVisible(page, 'direction-none-page-a');

    await page.locator('ion-button#go-none').click();
    await ionPageVisible(page, 'direction-none-page-b');

    await ionBackClick(page, 'direction-none-page-b');
    await ionPageDoesNotExist(page, 'direction-none-page-fallback');
    await ionPageVisible(page, 'direction-none-page-a');
    expect(new URL(page.url()).pathname).toBe('/direction-none-back/a');
  });
});
