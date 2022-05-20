import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { extendPageFixture, dragElementBy, test } from '@utils/test/playwright';

const pullToRefresh = async (page: E2EPage) => {
  const target = page.locator('body');

  const ev = await page.spyOnEvent('ionRefreshComplete');
  await dragElementBy(target, page, 0, 400);
  await ev.next();
}

test.describe('refresher: basic', () => {

  let context: any;
  let page: E2EPage;

  test.beforeEach(async ({ browser }) => {
    context = await browser.newContext({
      recordVideo: {
        dir: 'playwright-recordings/refresher/basic/'
      }
    });
    page = await extendPageFixture(await context.newPage());
    await page.goto('/src/components/refresher/test/basic', { waitUntil: 'networkidle' });
  });

  test.afterEach(async () => {
    await context.close();
  })

  test.describe('legacy refresher', () => {
    test('should load more items when performing a pull-to-refresh', async () => {
      const items = page.locator('ion-item');

      expect(await items.count()).toBe(30);

      await pullToRefresh(page);

      expect(await items.count()).toBe(60);
    });
  });

  test.describe('native refresher', () => {

    test('should load more items when performing a pull-to-refresh', async () => {
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
