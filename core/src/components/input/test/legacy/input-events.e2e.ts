import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('input: events: ionChange'), () => {
    test.describe('when the input is blurred', () => {
      test.describe('should emit', () => {
        test('if the value has changed', async ({ page }) => {
          await page.setContent(`<ion-input></ion-input>`, config);

          const nativeInput = page.locator('ion-input input');
          const ionChangeSpy = await page.spyOnEvent('ionChange');

          await nativeInput.type('new value', { delay: 100 });
          // Value change is not emitted until the control is blurred.
          await nativeInput.evaluate((e) => e.blur());

          await ionChangeSpy.next();

          expect(ionChangeSpy).toHaveReceivedEventDetail({ value: 'new value', event: { isTrusted: true } });
        });
      });

      test.describe('should not emit', () => {
        test('if the value has not changed', async ({ page }) => {
          await page.setContent(`<ion-input value="" clear-input="true"></ion-input>`, config);

          const ionChangeSpy = await page.spyOnEvent('ionChange');
          const nativeInput = page.locator('ion-input input');

          await nativeInput.type('new value', { delay: 100 });

          await page.click('ion-input .input-clear-icon');

          await nativeInput.evaluate((e) => e.blur());

          expect(ionChangeSpy.events.length).toBe(0);
        });

        test('if the value is set programmatically', async ({ page }) => {
          await page.setContent(`<ion-input></ion-input>`, config);

          const input = page.locator('ion-input');
          const ionChangeSpy = await page.spyOnEvent('ionChange');

          await input.evaluate((el: HTMLIonInputElement) => {
            el.value = 'new value';
          });

          expect(ionChangeSpy.events.length).toBe(0);

          // Update the value again to make sure it doesn't emit a second time
          await input.evaluate((el: HTMLIonInputElement) => {
            el.value = 'new value 2';
          });

          expect(ionChangeSpy.events.length).toBe(0);
        });
      });
    });
  });
});

/**
 * This behavior does not vary across modes/directions
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('input: events: ionInput'), () => {
    test('should emit when the input is cleared', async ({ page }) => {
      await page.setContent(`<ion-input value="some value" clear-input="true"></ion-input>`, config);

      const ionInputSpy = await page.spyOnEvent('ionInput');

      await page.click('ion-input .input-clear-icon');

      expect(ionInputSpy).toHaveReceivedEventDetail({ value: '', event: { isTrusted: true } });
    });

    test('should emit when the input is cleared from the keyboard', async ({ page }) => {
      await page.setContent(`<ion-input value="some value" clear-on-edit="true"></ion-input>`, config);

      const input = page.locator('ion-input');
      const ionInputSpy = await page.spyOnEvent('ionInput');

      await input.click();
      await page.keyboard.press('Backspace');

      expect(await input.evaluate((el: HTMLIonInputElement) => el.value)).toBe('');

      expect(ionInputSpy).toHaveReceivedEventTimes(1);
      expect(ionInputSpy).toHaveReceivedEventDetail({ value: '', event: { isTrusted: true } });
    });
  });
});
