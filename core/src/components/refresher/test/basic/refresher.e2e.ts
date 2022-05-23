import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

import { pullToRefresh } from '../test.utils';

test.describe('refresher: basic', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/components/refresher/test/basic');
  });

  test.describe('legacy refresher', () => {
    test('should load more items when performing a pull-to-refresh', async ({ page }) => {
      const items = page.locator('ion-item');

      expect(await items.count()).toBe(30);

      await pullToRefresh(page);

      expect(await items.count()).toBe(60);
    });
  });

  test.describe('native refresher', () => {
    test('should load more items when performing a pull-to-refresh', async ({ page }) => {
      const refresherContent = page.locator('ion-refresher-content');
      refresherContent.evaluateHandle((el: any) => {
        // Resets the pullingIcon to enable the native refresher
        el.pullingIcon = undefined;
      });

      await page.waitForChanges();

      const items = page.locator('ion-item');
      expect(await items.count()).toBe(30);

      await pullToRefresh(page);

      expect(await items.count()).toBe(60);
    });
  });
});
