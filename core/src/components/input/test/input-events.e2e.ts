import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('input: events: ionChange', () => {

  test('should not emit ionChange when the value is updated dynamically', async ({ page }) => {
    await page.setContent(`<ion-input></ion-input>`);

    const input = page.locator('ion-input');
    const ionChangeSpy = await page.spyOnEvent('ionChange');

    await input.evaluate((el: HTMLIonInputElement) => {
      el.value = 'new value';
    });

    expect(ionChangeSpy.events.length).toBe(0);
  });

  test('should emit ionChange when the user types', async ({ page }) => {
    await page.setContent(`<ion-input></ion-input>`);

    const nativeInput = page.locator('ion-input input');
    const ionChangeSpy = await page.spyOnEvent('ionChange');

    await nativeInput.type('new value', { delay: 100 });
    // Value change is not emitted until the control is blurred.
    await nativeInput.evaluate(e => e.blur());

    await ionChangeSpy.next();

    expect(ionChangeSpy).toHaveReceivedEventDetail({ value: 'new value' });
  });

  test('should emit ionChange when the user clears the input', async ({ page }) => {
    await page.setContent(`<ion-input value="some value" clear-input="true"></ion-input>`);

    const ionChangeSpy = await page.spyOnEvent('ionChange');

    await page.click('ion-input .input-clear-icon');

    expect(ionChangeSpy).toHaveReceivedEventDetail({ value: '' });
  });

});
