import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { dragElementBy, test } from '@utils/test/playwright';

const pullToRefresh = async (page: E2EPage, selector: string) => {
  const target = page.locator(selector);
  const ev = await page.spyOnEvent('ionRefreshComplete');

  await dragElementBy(target, page, 0, 300);

  await ev.next();
}

test.describe('refresher: custom scroll target', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/src/components/refresher/test/scroll-target');
  });

  test.describe('legacy refresher', () => {
    test('should load more items when performing a pull-to-refresh', async ({ page }) => {
      const items = page.locator('ion-item');

      expect(await items.count()).toBe(30);

      await pullToRefresh(page, '#inner-scroll');

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

      await pullToRefresh(page, '#inner-scroll');

      expect(await items.count()).toBe(60);
    });
  });
});
