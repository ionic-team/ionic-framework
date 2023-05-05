import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('range: events:'), () => {
    test.describe(' ionChange', () => {
      test('should not emit if the value is set programmatically', async ({ page }) => {
        await page.setContent(`<ion-range></ion-range>`, config);

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

      // TODO(FW-2873)
      test.skip('should emit when the knob is released', async ({ page }) => {
        await page.setContent(`<ion-range></ion-range>`, config);

        const rangeHandle = page.locator('ion-range .range-knob-handle');
        const ionChangeSpy = await page.spyOnEvent('ionChange');

        const boundingBox = await rangeHandle.boundingBox();

        await rangeHandle.hover();
        await page.mouse.down();
        await page.mouse.move(boundingBox!.x + 100, boundingBox!.y);

        await page.mouse.up();

        await ionChangeSpy.next();

        expect(ionChangeSpy).toHaveReceivedEventTimes(1);
      });

      test('should emit when the knob is moved with the keyboard', async ({ page }) => {
        await page.setContent(`<ion-range value="50"></ion-range>`, config);

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
        await page.setContent(`<ion-range></ion-range>`, config);

        const rangeHandle = page.locator('ion-range .range-knob-handle');
        const ionInputSpy = await page.spyOnEvent('ionInput');

        const boundingBox = await rangeHandle.boundingBox();

        await rangeHandle.hover();
        await page.mouse.down();
        await page.mouse.move(boundingBox!.x + 100, boundingBox!.y);

        await ionInputSpy.next();

        expect(ionInputSpy).toHaveReceivedEvent();
      });

      test('should emit when the knob is moved with the keyboard', async ({ page }) => {
        await page.setContent(`<ion-range value="50"></ion-range>`, config);

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
