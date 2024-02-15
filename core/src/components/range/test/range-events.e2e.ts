import { expect } from '@playwright/test';
import { configs, dragElementBy, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('range: events:'), () => {
    test.describe('range: knob events', () => {
      /**
       * The mouse events are flaky on CI
       */
      test.fixme('should emit start/end events', async ({ page }) => {
        /**
         * Requires padding to prevent the knob from being clipped.
         * If it's clipped, then the value might be one off.
         * For example, if the knob is clipped on the right, then the value
         * will be 99 instead of 100.
         */
        await page.setContent(
          `
          <div style="padding: 0 20px">
            <ion-range aria-label="Range" value="20"></ion-range>
          </div>
        `,
          config
        );

        const rangeStart = await page.spyOnEvent('ionKnobMoveStart');
        const rangeEnd = await page.spyOnEvent('ionKnobMoveEnd');

        const rangeEl = page.locator('ion-range');

        await dragElementBy(rangeEl, page, 300, 0);
        await page.waitForChanges();

        /**
         * dragElementBy defaults to starting the drag from the middle of the el,
         * so the start value should jump to 50 despite the range defaulting to 20.
         */
        expect(rangeStart).toHaveReceivedEventDetail({ value: 50 });
        expect(rangeEnd).toHaveReceivedEventDetail({ value: 100 });

        /**
         * Verify both events fire if range is clicked without dragging.
         */
        await dragElementBy(rangeEl, page, 0, 0);
        await page.waitForChanges();

        expect(rangeStart).toHaveReceivedEventDetail({ value: 50 });
        expect(rangeEnd).toHaveReceivedEventDetail({ value: 50 });
      });

      test('should emit start/end events, keyboard', async ({ page }) => {
        await page.setContent(`<ion-range aria-label="Range" value="20"></ion-range>`, config);

        const rangeStart = await page.spyOnEvent('ionKnobMoveStart');
        const rangeEnd = await page.spyOnEvent('ionKnobMoveEnd');

        await page.keyboard.press('Tab'); // focus first range
        await page.keyboard.press('ArrowRight');

        await rangeStart.next();
        await rangeEnd.next();

        expect(rangeStart).toHaveReceivedEventDetail({ value: 20 });
        expect(rangeEnd).toHaveReceivedEventDetail({ value: 21 });
      });

      // TODO FW-2873
      test.skip('should not scroll when the knob is swiped', async ({ page, skip }) => {
        skip.browser('webkit', 'mouse.wheel is not available in WebKit');

        await page.goto(`/src/components/range/test/basic`, config);

        const knobEl = page.locator('ion-range#stacked-range .range-knob-handle');
        const scrollEl = page.locator('ion-content .inner-scroll');

        expect(await scrollEl.evaluate((el: HTMLElement) => el.scrollTop)).toEqual(0);

        await dragElementBy(knobEl, page, 30, 0, undefined, undefined, false);

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

    test.describe('ionChange', () => {
      test('should not emit if the value is set programmatically', async ({ page }) => {
        await page.setContent(`<ion-range aria-label="range"></ion-range>`, config);

        const range = page.locator('ion-range');
        const ionChangeSpy = await page.spyOnEvent('ionChange');

        await range.evaluate((el: HTMLIonRangeElement) => {
          el.value = 50;
        });

        await page.waitForChanges();

        expect(ionChangeSpy).toHaveReceivedEventTimes(0);

        // Update the value again to make sure it doesn't emit a second time
        await range.evaluate((el: HTMLIonRangeElement) => {
          el.value = 60;
        });

        await page.waitForChanges();

        expect(ionChangeSpy).toHaveReceivedEventTimes(0);
      });

      // TODO FW-2873
      test.skip('should emit when the knob is released', async ({ page }) => {
        await page.setContent(`<ion-range aria-label="range"></ion-range>`, config);

        const rangeHandle = page.locator('ion-range .range-knob-handle');
        const ionChangeSpy = await page.spyOnEvent('ionChange');

        await dragElementBy(rangeHandle, page, 100, 0);

        await ionChangeSpy.next();

        expect(ionChangeSpy).toHaveReceivedEventTimes(1);
      });

      test('should emit when the knob is moved with the keyboard', async ({ page }) => {
        await page.setContent(`<ion-range aria-label="range" value="50"></ion-range>`, config);

        const rangeHandle = page.locator('ion-range .range-knob-handle');
        const ionChangeSpy = await page.spyOnEvent('ionChange');

        await rangeHandle.click();

        await page.keyboard.press('ArrowLeft');
        await ionChangeSpy.next();

        expect(ionChangeSpy).toHaveReceivedEventDetail({ value: 49 });

        await page.keyboard.press('ArrowRight');
        await ionChangeSpy.next();

        expect(ionChangeSpy).toHaveReceivedEventDetail({ value: 50 });

        await page.keyboard.press('ArrowUp');
        await ionChangeSpy.next();

        expect(ionChangeSpy).toHaveReceivedEventDetail({ value: 51 });

        await page.keyboard.press('ArrowDown');
        await ionChangeSpy.next();

        expect(ionChangeSpy).toHaveReceivedEventDetail({ value: 50 });
      });
    });

    test.describe('ionInput', () => {
      // TODO(FW-2873) Enable this test when touch events/gestures are better supported in Playwright
      test.skip('should emit when the knob is dragged', async ({ page }) => {
        await page.setContent(`<ion-range aria-label="range"></ion-range>`, config);

        const rangeHandle = page.locator('ion-range .range-knob-handle');
        const ionInputSpy = await page.spyOnEvent('ionInput');

        await rangeHandle.hover();

        await dragElementBy(rangeHandle, page, 100, 0, undefined, undefined, false);

        await ionInputSpy.next();

        expect(ionInputSpy).toHaveReceivedEvent();
      });

      test('should emit when the knob is moved with the keyboard', async ({ page }) => {
        await page.setContent(`<ion-range aria-label="range" value="50"></ion-range>`, config);

        const rangeHandle = page.locator('ion-range .range-knob-handle');
        const ionInputSpy = await page.spyOnEvent('ionInput');

        await rangeHandle.click();

        await page.keyboard.press('ArrowLeft');
        await ionInputSpy.next();

        expect(ionInputSpy).toHaveReceivedEventDetail({ value: 49 });

        await page.keyboard.press('ArrowRight');
        await ionInputSpy.next();

        expect(ionInputSpy).toHaveReceivedEventDetail({ value: 50 });

        await page.keyboard.press('ArrowUp');
        await ionInputSpy.next();

        expect(ionInputSpy).toHaveReceivedEventDetail({ value: 51 });

        await page.keyboard.press('ArrowDown');
        await ionInputSpy.next();

        expect(ionInputSpy).toHaveReceivedEventDetail({ value: 50 });
      });
    });
  });
});
