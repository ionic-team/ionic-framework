import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('infinite-scroll: top'), () => {
    test('should load more items when scrolled to the top', async ({ page }) => {
      await page.goto('/src/components/infinite-scroll/test/top', config);

      const ionInfiniteComplete = await page.spyOnEvent('ionInfiniteComplete');
      const content = page.locator('ion-content');
      const items = page.locator('ion-item');
      expect(await items.count()).toBe(30);

      /**
       * Wait for infinite scroll to move the content to the bottom
       * on load. The scroll must start outside the trigger zone
       * (infinite scroll height + 100px threshold), otherwise the
       * load fires from that initial scroll instead of from
       * scrolling to the top.
       */
      await expect
        .poll(() =>
          content.evaluate(async (el: HTMLIonContentElement) => {
            const scrollEl = await el.getScrollElement();
            return scrollEl.scrollTop;
          })
        )
        .toBeGreaterThan(200);

      await content.evaluate((el: HTMLIonContentElement) => el.scrollToTop(0));
      await ionInfiniteComplete.next();

      expect(await items.count()).toBe(60);
    });
  });
});
