import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('searchbar: events (ionChange)', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
  });

  test('should emit when blurred after value change', async ({ page }) => {
    await page.setContent(`<ion-searchbar></ion-searchbar>`);
    const nativeInput = page.locator('ion-searchbar input');
    const ionChange = await page.spyOnEvent('ionChange');

    await nativeInput.type('new value', { delay: 100 });
    await nativeInput.evaluate((e) => e.blur());

    await ionChange.next();
    expect(ionChange).toHaveReceivedEventDetail({ value: 'new value', event: { isTrusted: true } });
    expect(ionChange).toHaveReceivedEventTimes(1);
  });

  test('should emit when blurred after clicking clear with default value', async ({ page }) => {
    await page.setContent(`<ion-searchbar show-clear-button="always" value="default value"></ion-searchbar>`);
    const nativeInput = page.locator('ion-searchbar input');
    const ionChange = await page.spyOnEvent('ionChange');

    await page.click('.searchbar-clear-button');
    await page.waitForChanges();
    await nativeInput.evaluate((e) => e.blur());

    await ionChange.next();
    expect(ionChange).toHaveReceivedEventDetail({ value: '', event: { isTrusted: true } });
    expect(ionChange).toHaveReceivedEventTimes(1);
  });

  test('should emit after clicking cancel with default value', async ({ page }) => {
    await page.setContent(`<ion-searchbar show-cancel-button="always" value="default value"></ion-searchbar>`);
    const ionChange = await page.spyOnEvent('ionChange');

    await page.click('.searchbar-cancel-button');
    await page.waitForChanges();

    await ionChange.next();
    expect(ionChange).toHaveReceivedEventDetail({ value: '', event: { isTrusted: true } });
    expect(ionChange).toHaveReceivedEventTimes(1);
  });

  test('should not emit if the value is set programmatically', async ({ page }) => {
    await page.setContent(`<ion-searchbar></ion-searchbar>`);
    const searchbar = page.locator('ion-searchbar');
    const ionChange = await page.spyOnEvent('ionChange');

    await searchbar.evaluate((el: HTMLIonSearchbarElement) => {
      el.value = 'new value';
    });

    await page.waitForChanges();
    expect(ionChange).toHaveReceivedEventTimes(0);

    // Update the value again to make sure it doesn't emit a second time
    await searchbar.evaluate((el: HTMLIonSearchbarElement) => {
      el.value = 'new value 2';
    });

    await page.waitForChanges();
    expect(ionChange).toHaveReceivedEventTimes(0);
  });
});

test.describe('searchbar: events (ionInput)', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
  });

  test('should emit when the user types', async ({ page }) => {
    await page.setContent(`<ion-searchbar debounce="0"></ion-searchbar>`);
    const nativeInput = page.locator('ion-searchbar input');
    const ionInput = await page.spyOnEvent('ionInput');

    await nativeInput.type('new value', { delay: 100 });
    expect(ionInput).toHaveReceivedEventTimes(9);
  });
});
