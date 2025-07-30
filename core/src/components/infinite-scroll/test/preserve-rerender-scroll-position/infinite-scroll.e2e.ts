import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

test.setTimeout(100000);

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('infinite-scroll: preserve rerender scroll position'), () => {
    test('should load more items when scrolled to the bottom', async ({ page }) => {
      await page.goto('/src/components/infinite-scroll/test/preserve-rerender-scroll-position', config);

      const ionInfiniteComplete = await page.spyOnEvent('ionInfiniteComplete');
      const content = page.locator('ion-content');
      const items = page.locator('ion-item');
      const innerScroll = page.locator('.inner-scroll');
      expect(await items.count()).toBe(50);

      let previousScrollTop = 0;
      for (let i = 0; i < 30; i++) {
        await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));
        const currentScrollTop = await innerScroll.evaluate((el: HTMLIonContentElement) => el.scrollTop);
        expect(currentScrollTop).toBeGreaterThan(previousScrollTop);
        await ionInfiniteComplete.next();
        const newScrollTop = await innerScroll.evaluate((el: HTMLIonContentElement) => el.scrollTop);
        console.log(`Scroll position should be preserved after ${i + 1} iterations`, newScrollTop, previousScrollTop);
        expect(newScrollTop, `Scroll position should be preserved after ${i + 1} iterations`).toBeGreaterThanOrEqual(
          previousScrollTop
        );
        previousScrollTop = currentScrollTop;
      }
    });
  });
});
