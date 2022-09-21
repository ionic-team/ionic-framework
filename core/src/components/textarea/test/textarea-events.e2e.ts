import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('textarea: events: ionChange', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
  });

  test.describe('when the textarea is blurred', () => {
    test('should emit if the value has changed', async ({ page }) => {
      await page.setContent(`<ion-textarea></ion-textarea>`);

      const nativeTextarea = page.locator('ion-textarea textarea');
      const ionChangeSpy = await page.spyOnEvent('ionChange');

      await nativeTextarea.type('new value', { delay: 100 });
      // Value change is not emitted until the control is blurred.
      await nativeTextarea.evaluate((e) => e.blur());

      await ionChangeSpy.next();

      expect(ionChangeSpy).toHaveReceivedEventDetail({ value: 'new value' });
      expect(ionChangeSpy).toHaveReceivedEventTimes(1);
    });

    test('should emit if the textarea is cleared with an initial value', async ({ page }) => {
      await page.setContent(`<ion-textarea clear-on-edit="true" value="123"></ion-textarea>`);

      const textarea = page.locator('ion-textarea');
      const nativeTextarea = textarea.locator('textarea');
      const ionChangeSpy = await page.spyOnEvent('ionChange');

      await nativeTextarea.type('new value');

      await nativeTextarea.evaluate((e) => e.blur());

      await ionChangeSpy.next();

      expect(ionChangeSpy).toHaveReceivedEventDetail({ value: 'new value' });
      expect(ionChangeSpy).toHaveReceivedEventTimes(1);
    });

    test('should not emit if the value is set programmatically', async ({ page }) => {
      await page.setContent(`<ion-textarea></ion-textarea>`);

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

test.describe('textarea: events: ionInput', () => {
  test.describe('should emit', () => {
    test('when the user types', async ({ page }) => {
      await page.setContent(`<ion-textarea value="some value"></ion-textarea>`);

      const ionInputSpy = await page.spyOnEvent('ionInput');

      const nativeTextarea = page.locator('ion-textarea textarea');
      await nativeTextarea.type('new value', { delay: 100 });

      expect(ionInputSpy).toHaveReceivedEventDetail({ isTrusted: true });
    });
  });
});
