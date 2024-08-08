import { expect } from '@playwright/test';
import { configs, dragElementBy, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('range: scroll'), () => {
    test('should not scroll when the knob is being dragged', async ({ page, skip }) => {
      /**
       * The Playwright team has stated that they will not implement this feature:
       * https://github.com/microsoft/playwright/issues/28755
       */
      skip.browser('webkit', 'mouse.wheel is not available in WebKit');

      /**
       * Requires padding to prevent the knob from being clipped.
       * If it's clipped, then the value might be one off.
       * For example, if the knob is clipped on the right, then the value
       * will be 99 instead of 100.
       *
       * The ion-content is also required to be taller than the viewport
       * to allow for scrolling.
       */
      await page.goto(`/src/components/range/test/scroll`, config);

      const rangeEl = page.locator('ion-range');
      const scrollEl = page.locator('ion-content .inner-scroll');

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
