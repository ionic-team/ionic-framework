import { expect } from '@playwright/test';
import { configs, dragElementBy, moveElement, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('range: events:'), () => {
    test.describe('range: knob events', () => {
      test.only('should emit start/end events', async ({ page }) => {
        /**
         * Requires padding to prevent the knob from being clipped.
         * If it's clipped, then the value might be one off.
         * For example, if the knob is clipped on the right, then the value
         * will be 99 instead of 100.
         */
        await page.setContent(
          `
          <div style="padding: 0 20px">
            <ion-range value="20"></ion-range>
          </div>
        `,
          config
        );

        const rangeStart = await page.spyOnEvent('ionKnobMoveStart');
        const rangeEnd = await page.spyOnEvent('ionKnobMoveEnd');

        const rangeEl = page.locator('ion-range');
        const boundingBox = await rangeEl.boundingBox();

        if (!boundingBox) {
          throw new Error(
            'Cannot get a bounding box for an element that is not visible. See https://playwright.dev/docs/api/class-locator#locator-bounding-box for more information'
          );
        }

        const startX = boundingBox.x + boundingBox.width / 2;
        const startY = boundingBox.y + boundingBox.height / 2;

        // Navigate to the center of the element.
        await page.mouse.move(startX, startY);
        await page.mouse.down();

        await rangeStart.next();
        /**
         * Since the mouse moved to the center of the element, the start value will be 50.
         */
        expect(rangeStart).toHaveReceivedEventDetail({ value: 50 });

        // Drag the element.
        await moveElement(page, startX, startY, 185, 0);

        await page.mouse.up();

        await rangeEnd.next();
        expect(rangeEnd).toHaveReceivedEventDetail({ value: 100 });

        /**
         * Verify both events fire if range is clicked without dragging.
         */
        await page.mouse.move(startX, startY);
        await page.mouse.down();

        await rangeStart.next();
        expect(rangeStart).toHaveReceivedEventDetail({ value: 50 });

        await page.mouse.up();

        await rangeEnd.next();
        expect(rangeEnd).toHaveReceivedEventDetail({ value: 50 });
      });

      test('should emit start/end events, keyboard', async ({ page }) => {
        await page.setContent(`<ion-range value="20"></ion-range>`, config);

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

        await page.goto(`/src/components/range/test/legacy/basic`, config);

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
