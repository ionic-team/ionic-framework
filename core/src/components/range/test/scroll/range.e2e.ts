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

    test('should not scroll after tapping the range bar when scrollY is false', async ({ page, skip }) => {
      /**
       * The Playwright team has stated that they will not implement this feature:
       * https://github.com/microsoft/playwright/issues/28755
       */
      skip.browser('webkit', 'mouse.wheel is not available in WebKit');

      await page.goto(`/src/components/range/test/scroll/scroll-y-false.html`, config);

      const rangeSlider = page.locator('ion-range .range-slider');
      const scrollEl = page.locator('ion-content .inner-scroll');
      const contentEl = page.locator('ion-content');

      expect(await contentEl.evaluate((el: HTMLIonContentElement) => el.scrollY)).toBe(false);
      expect(await scrollEl.evaluate((el: HTMLElement) => el.scrollHeight > el.clientHeight)).toBe(true);
      expect(await scrollEl.evaluate((el: HTMLElement) => el.scrollTop)).toEqual(0);

      /**
       * Click the bar without dragging. A tap stays under the gesture
       * threshold, so it goes through pointerup rather than the drag path.
       */
      await rangeSlider.click();
      await page.waitForChanges();

      expect(await contentEl.evaluate((el: HTMLIonContentElement) => el.scrollY)).toBe(false);

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
