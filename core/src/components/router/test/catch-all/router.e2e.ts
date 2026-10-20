import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('router: catch-all'), () => {
    test('should render the matching route over the catch-all', async ({ page }) => {
      await page.goto(`/src/components/router/test/catch-all#/docs`, config);

      await expect(page.locator('docs-index')).toBeVisible();
      await expect(page.locator('docs-not-found')).toHaveCount(0);
      await expect(page.locator('not-found-page')).toHaveCount(0);
    });

    test('should render the catch-all for an unknown path', async ({ page }) => {
      await page.goto(`/src/components/router/test/catch-all#/unknown/deep/path`, config);

      const notFound = page.locator('not-found-page');
      await expect(notFound).toBeVisible();
      await expect(notFound.locator('.path-match')).toHaveText('unknown/deep/path');
    });

    test('should prefer the catch-all with the most fixed segments', async ({ page }) => {
      await page.goto(`/src/components/router/test/catch-all#/docs/missing/page`, config);

      const notFound = page.locator('docs-not-found');
      await expect(notFound).toBeVisible();
      await expect(notFound.locator('.path-match')).toHaveText('missing/page');
      await expect(page.locator('not-found-page')).toHaveCount(0);
    });

    test('should render the catch-all over a route that ignores trailing segments', async ({ page }) => {
      await page.goto(`/src/components/router/test/catch-all#/docs/intro/extra`, config);

      const notFound = page.locator('docs-not-found');
      await expect(notFound).toBeVisible();
      await expect(notFound.locator('.path-match')).toHaveText('intro/extra');
      await expect(page.locator('docs-intro')).toHaveCount(0);
    });

    test('should update the matched path when navigating between unknown paths', async ({ page }) => {
      await page.goto(`/src/components/router/test/catch-all#/unknown/one`, config);
      await expect(page.locator('not-found-page .path-match')).toHaveText('unknown/one');

      await page.evaluate(() => document.querySelector('ion-router')!.push('/another/two'));

      await expect(page.locator('not-found-page .path-match')).toHaveText('another/two');
      await expect(page).toHaveURL(/#\/another\/two$/);
    });

    test('should restore the unknown path when switching back to the tab', async ({ page }) => {
      await page.goto(`/src/components/router/test/catch-all#/docs/missing/page`, config);
      await expect(page.locator('docs-not-found')).toBeVisible();

      await page.click('ion-tab-button[tab="tab-home"]');
      await expect(page.locator('tab-home')).toBeVisible();
      await expect(page).toHaveURL(/#\/$/);

      await page.click('ion-tab-button[tab="tab-docs"]');
      await expect(page.locator('docs-not-found')).toBeVisible();
      await expect(page).toHaveURL(/#\/docs\/missing\/page$/);
    });
  });
});
