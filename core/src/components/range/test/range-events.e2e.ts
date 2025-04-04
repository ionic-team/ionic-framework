import { expect } from '@playwright/test';
import { configs, dragElementBy, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('range: events:'), () => {
    test.describe('range: knob events', () => {
      test('should emit start/end events', async ({ page }) => {
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

        /**
         * Verify both events fire if range is dragged.
         */
        await dragElementBy(rangeEl, page, 180);

        await rangeStart.next();
        await rangeEnd.next();

        // Once the knob is dragged, the start event should fire with
        // the initial value.
        expect(rangeStart).toHaveReceivedEventDetail({ value: 20 });
        // Once the knob is released, the end event should fire with
        // the final value.
        expect(rangeEnd).toHaveReceivedEventDetail({ value: 100 });

        /**
         * Verify both events fire if range is tapped without dragging.
         */
        await dragElementBy(rangeEl, page, 0, 0);

        await rangeStart.next();
        await rangeEnd.next();

        // Once the tap is released, the start event should fire with
        // the initial value.
        expect(rangeStart).toHaveReceivedEventDetail({ value: 100 });
        // Once the tap is released, the end event should fire with
        // the final value.
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

      test('should emit end event on tap', async ({ page }, testInfo) => {
        testInfo.annotations.push({
          type: 'issue',
          description: 'https://github.com/ionic-team/ionic-framework/issues/28487',
        });

        await page.setContent(`<ion-range aria-label="Range" value="20"></ion-range>`, config);

        const range = page.locator('ion-range');
        const rangeEndSpy = await page.spyOnEvent('ionKnobMoveEnd');
        const rangeBoundingBox = await range.boundingBox();
        /**
         * Coordinates for the click event.
         * These need to be near the end of the range
         * (or anything that isn't the current value).
         *
         * The number 50 is arbitrary, but it should be
         * less than the width of the range.
         */
        const x = rangeBoundingBox!.width - 50;
        // The y coordinate is the middle of the range.
        const y = rangeBoundingBox!.height / 2;

        // Click near the end of the range.
        await range.click({
          position: { x, y },
        });

        await rangeEndSpy.next();

        expect(rangeEndSpy.length).toBe(1);
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

      test('should emit when the knob is released', async ({ page }) => {
        /**
         * Requires padding to prevent the knob from being clipped.
         * If it's clipped, then the value might be one off.
         * For example, if the knob is clipped on the right, then the value
         * will be 99 instead of 100.
         */
        await page.setContent(
          `
          <div style="padding: 0 20px">
            <ion-range aria-label="Range"></ion-range>
          </div>
        `,
          config
        );

        const rangeEl = page.locator('ion-range');
        const ionChangeSpy = await page.spyOnEvent('ionChange');

        await dragElementBy(rangeEl, page, 100);

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
      test('should emit when the knob is dragged', async ({ page }) => {
        /**
         * Requires padding to prevent the knob from being clipped.
         * If it's clipped, then the value might be one off.
         * For example, if the knob is clipped on the right, then the value
         * will be 99 instead of 100.
         */
        await page.setContent(
          `
          <div style="padding: 0 20px">
            <ion-range aria-label="range"></ion-range>
          </div>
        `,
          config
        );

        const rangeEl = page.locator('ion-range');
        const ionInputSpy = await page.spyOnEvent('ionInput');

        await dragElementBy(rangeEl, page, 100);

        await ionInputSpy.next();

        expect(ionInputSpy).toHaveReceivedEvent();
      });

      test('should not emit when the value does not change', async ({ page }, testInfo) => {
        testInfo.annotations.push({
          type: 'issue',
          description: 'https://github.com/ionic-team/ionic-framework/issues/29619',
        });

        /**
         * Requires padding to prevent the knob from being clipped.
         * If it's clipped, then the value might be one off.
         * For example, if the knob is clipped on the right, then the value
         * will be 99 instead of 100.
         */
        await page.setContent(
          `
          <div style="padding: 0 20px">
            <ion-range aria-label="range"></ion-range>
          </div>
        `,
          config
        );

        const rangeHandle = page.locator('ion-range .range-knob-handle');
        const ionInputSpy = await page.spyOnEvent('ionInput');

        const rangeHandleBoundingBox = await rangeHandle.boundingBox();
        const x = rangeHandleBoundingBox!.width / 2;
        const y = rangeHandleBoundingBox!.height / 2;

        // Click in the middle of the knob to prevent the knob from moving.
        await rangeHandle.click({
          position: { x, y },
        });

        expect(ionInputSpy).not.toHaveReceivedEvent();
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
