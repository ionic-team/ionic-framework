import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('textarea: events: ionChange'), () => {
    test.describe('when the textarea is blurred', () => {
      test('should emit if the value has changed', async ({ page }) => {
        await page.setContent(`<ion-textarea aria-label="textarea"></ion-textarea>`, config);

        const nativeTextarea = page.locator('ion-textarea textarea');
        const ionChangeSpy = await page.spyOnEvent('ionChange');

        await nativeTextarea.type('new value', { delay: 100 });
        // Value change is not emitted until the control is blurred.
        await nativeTextarea.evaluate((e) => e.blur());

        await ionChangeSpy.next();

        expect(ionChangeSpy).toHaveReceivedEventDetail({ value: 'new value', event: { isTrusted: true } });
        expect(ionChangeSpy).toHaveReceivedEventTimes(1);
      });

      test('should emit if the textarea is cleared with an initial value', async ({ page }) => {
        await page.setContent(
          `<ion-textarea aria-label="textarea" clear-on-edit="true" value="123"></ion-textarea>`,
          config
        );

        const textarea = page.locator('ion-textarea');
        const nativeTextarea = textarea.locator('textarea');
        const ionChangeSpy = await page.spyOnEvent('ionChange');

        await nativeTextarea.type('new value');

        await nativeTextarea.evaluate((e) => e.blur());

        await ionChangeSpy.next();

        expect(ionChangeSpy).toHaveReceivedEventDetail({ value: 'new value', event: { isTrusted: true } });
        expect(ionChangeSpy).toHaveReceivedEventTimes(1);
      });

      test('should not emit if the value is set programmatically', async ({ page }) => {
        await page.setContent(`<ion-textarea aria-label="textarea"></ion-textarea>`, config);

        const textarea = page.locator('ion-textarea');
        const ionChangeSpy = await page.spyOnEvent('ionChange');

        await textarea.evaluate((el: HTMLIonTextareaElement) => {
          el.value = 'new value';
        });

        await page.waitForChanges();

        expect(ionChangeSpy).toHaveReceivedEventTimes(0);

        // Update the value again to make sure it doesn't emit a second time
        await textarea.evaluate((el: HTMLIonTextareaElement) => {
          el.value = 'new value 2';
        });

        await page.waitForChanges();

        expect(ionChangeSpy).toHaveReceivedEventTimes(0);
      });
    });
  });
  test.describe(title('textarea: events: ionInput'), () => {
    test('should emit when the user types', async ({ page }) => {
      await page.setContent(`<ion-textarea aria-label="textarea" value="some value"></ion-textarea>`, config);

      const ionInputSpy = await page.spyOnEvent('ionInput');

      const nativeTextarea = page.locator('ion-textarea textarea');
      await nativeTextarea.type('new value', { delay: 100 });

      expect(ionInputSpy).toHaveReceivedEventDetail({ value: 'new valuesome value', event: { isTrusted: true } });
    });

    test('should emit when the textarea is cleared on edit', async ({ page }) => {
      await page.setContent(`<ion-textarea clear-on-edit="true" value="some value"></ion-textarea>`, config);

      const ionInputSpy = await page.spyOnEvent('ionInput');
      const textarea = page.locator('ion-textarea');

      await textarea.click();
      await textarea.press('Backspace');

      expect(ionInputSpy).toHaveReceivedEventTimes(1);
      expect(ionInputSpy).toHaveReceivedEventDetail({ value: '', event: { isTrusted: true } });
    });
  });
});
