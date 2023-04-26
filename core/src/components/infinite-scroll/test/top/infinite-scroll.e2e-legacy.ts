import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('infinite-scroll: top', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
    skip.mode('ios');
  });
  test('should load more items when scrolled to the top', async ({ page }) => {
    await page.goto('/src/components/infinite-scroll/test/top');

    const ionInfiniteComplete = await page.spyOnEvent('ionInfiniteComplete');
    const content = page.locator('ion-content');
    const items = page.locator('ion-item');
    expect(await items.count()).toBe(30);

    await content.evaluate((el: HTMLIonContentElement) => el.scrollToTop(0));
    await ionInfiniteComplete.next();

    expect(await items.count()).toBe(60);
  });
});
