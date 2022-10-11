import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('infinite-scroll: scroll-target', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
    skip.mode('ios');
  });
  test('should load more items when scroll target is scrolled to the bottom', async ({ page }) => {
    await page.goto('/src/components/infinite-scroll/test/scroll-target');

    const ionInfiniteComplete = await page.spyOnEvent('ionInfiniteComplete');
    const content = page.locator('#scroll-target');
    const items = page.locator('ion-item');
    expect(await items.count()).toBe(30);

    await content.evaluate((el: HTMLElement) => (el.scrollTop = el.scrollHeight));
    await ionInfiniteComplete.next();

    expect(await items.count()).toBe(60);
  });
});
