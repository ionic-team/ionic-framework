import { test, expect } from './utils/test-base';
import { ionPageVisible, tabClick } from './utils/test-utils';

/**
 * Tab navigation when the user lands directly on a tab child route
 * (e.g. browser refresh or back from an external URL). The tab's
 * locationHistory only contains the deep-loaded entry, so resetting or
 * pushing within the tab has to fall back to the tab's originalHref
 * instead of router.go on a non-existent prior entry.
 *
 * @see https://github.com/ionic-team/ionic-framework/issues/29705
 */
test.describe('Tabs: deep-loaded child', () => {
  test('child-to-child push from deep-loaded tab child renders the next page', async ({ page }) => {
    await page.goto('/tabs/tab1/childone');
    await ionPageVisible(page, 'tab1childone');

    await page.locator('.ion-page[data-pageid="tab1childone"] #child-two').click();

    await expect.poll(() => new URL(page.url()).pathname).toBe('/tabs/tab1/childtwo');
    await ionPageVisible(page, 'tab1childtwo');
  });

  test('clicking tab button on deep-loaded tab child returns to tab root', async ({ page }) => {
    await page.goto('/tabs/tab1/childone');
    await ionPageVisible(page, 'tab1childone');

    await tabClick(page, 'tab1');

    await expect.poll(() => new URL(page.url()).pathname).toBe('/tabs/tab1');
    await ionPageVisible(page, 'tab1');

    /**
     * The fallback uses replace semantics, so the deep-loaded child
     * is removed from history rather than stacked on top of the tab
     * root. A push fallback would leave an extra entry behind.
     */
    const historyLength = await page.evaluate(() => window.history.length);
    expect(historyLength).toBeLessThanOrEqual(2);
  });

  test('deep-load works on tabs other than tab1', async ({ page }) => {
    await page.goto('/tabs/tab2/childone');
    await ionPageVisible(page, 'tab2childone');

    await tabClick(page, 'tab2');

    await expect.poll(() => new URL(page.url()).pathname).toBe('/tabs/tab2');
    await ionPageVisible(page, 'tab2');
  });
});
