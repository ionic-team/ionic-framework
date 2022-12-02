import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

import { pullToRefresh } from '../test.utils';

configs().forEach(({ title, config }) => {
  // TODO FW-2795: Enable this test when touch events/gestures are better supported in Playwright
  test.describe.skip('refresher: basic', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/refresher/test/basic', config);
    });

    test.describe('legacy refresher', () => {
      test(title('should load more items when performing a pull-to-refresh'), async ({ page }) => {
        const items = page.locator('ion-item');

        expect(await items.count()).toBe(30);

        await pullToRefresh(page);

        expect(await items.count()).toBe(60);
      });
    });

    test.describe('native refresher', () => {
      test(title('should load more items when performing a pull-to-refresh'), async ({ page }) => {
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
});
