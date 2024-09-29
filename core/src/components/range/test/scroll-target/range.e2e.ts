import { expect } from '@playwright/test';
import { configs, test, dragElementBy } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('range: scroll-target'), () => {
    test('should not scroll when the knob is swiped in custom scroll target', async ({ page, skip }) => {
      /**
       * The Playwright team has stated that they will not implement this feature:
       * https://github.com/microsoft/playwright/issues/28755
       */
      skip.browser('webkit', 'mouse.wheel is not available in WebKit');

      await page.goto(`/src/components/range/test/scroll-target`, config);

      const rangeEl = page.locator('ion-range');
      const scrollEl = page.locator('.ion-content-scroll-host');

      expect(await scrollEl.evaluate((el: HTMLElement) => el.scrollTop)).toEqual(0);

      await dragElementBy(rangeEl, page, 100, 0, undefined, undefined, false);

      /**
       * Do not use scrollToBottom() or other scrolling methods
       * on ion-content as those will update the scroll position.
       * Setting scrollTop still works even with overflow-y: hidden.
       * However, simulating a user gesture should not scroll the content.
       */
      await page.mouse.wheel(0, 100);
      await page.waitForChanges();

      expect(await scrollEl.evaluate((el: HTMLElement) => el.scrollTop)).toEqual(0);
    });
  });
});
