import { test, expect } from '@playwright/test';

import { ionBackClick, ionPageHidden, ionPageVisible, withTestingMode } from './utils/test-utils';

/**
 * An index route and an empty-path route carry no path of their own, so like a splat they
 * can be handed a pathname that a more specific sibling owns. The home page must stay
 * mounted behind the pushed sibling either way.
 *
 * https://github.com/ionic-team/ionic-framework/issues/31477
 */
const shapes = [
  {
    name: 'index route',
    base: '/index-sibling',
    home: 'index-sibling-home',
    detail: 'index-sibling-detail',
  },
  {
    name: 'empty path route',
    base: '/empty-path-sibling',
    home: 'empty-path-sibling-home',
    detail: 'empty-path-sibling-detail',
  },
];

for (const { name, base, home, detail } of shapes) {
  test.describe(`${name} with a more specific sibling`, () => {
    test('keeps the home page mounted behind a pushed sibling', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/31477',
      });

      await page.goto(withTestingMode(base));
      await ionPageVisible(page, home);

      await page.locator('[data-testid="open-detail"]').click();

      await ionPageVisible(page, detail);
      await expect(page.locator('[data-testid="detail-id"]')).toHaveText('12');
      await ionPageHidden(page, home);
    });

    test('restores the same home page with its state on back', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/31477',
      });

      await page.goto(withTestingMode(base));
      await ionPageVisible(page, home);

      await page.locator('[data-testid="increment"]').click();
      await page.locator('[data-testid="increment"]').click();
      await page.locator('[data-testid="increment"]').click();
      await expect(page.locator('[data-testid="count"]')).toHaveText('3');

      await page.locator('[data-testid="open-detail"]').click();
      await ionPageVisible(page, detail);

      await ionBackClick(page, detail);

      await ionPageVisible(page, home);
      await expect(page.locator('[data-testid="count"]')).toHaveText('3');
    });
  });
}
