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

      await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));
      await page.waitForFunction(async () => {
        const contentEl = document.querySelector('ion-content') as HTMLIonContentElement | null;
        if (contentEl == null) {
          return false;
        }

        const scrollEl = await contentEl.getScrollElement();
        return scrollEl.scrollTop > 0;
      });

      await content.evaluate((el: HTMLIonContentElement) => el.scrollToTop(0));
      await ionInfiniteComplete.next();
      await expect(items).toHaveCount(60);
    });
  });
});
