import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('picker-column-internal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/components/picker-column-internal/test/basic');
  });

  test('should render a picker item for each item', async ({ page }) => {
    const columns = page.locator('ion-picker-column-internal .picker-item:not(.picker-item-empty)');
    await expect(columns).toHaveCount(24);
  });

  test('should render 6 empty picker items', async ({ page }) => {
    const columns = page.locator('ion-picker-column-internal .picker-item-empty');
    await expect(columns).toHaveCount(6);
  });

  test('should not have an active item when value is not set', async ({ page }) => {
    const activeColumn = page.locator('ion-picker-column-internal .picker-item-active');
    await expect(activeColumn).toHaveCount(0);
  });

  test('should have an active item when value is set', async ({ page }) => {
    await page.locator('#default').evaluate((el: HTMLIonPickerColumnInternalElement) => {
      el.value = '12';
    });
    await page.waitForChanges();

    const activeColumn = page.locator('ion-picker-column-internal .picker-item-active');

    expect(activeColumn).not.toBeNull();
  });

  // TODO FW-3616
  test.skip('scrolling should change the active item', async ({ page, skip }) => {
    skip.browser('firefox', 'https://bugzilla.mozilla.org/show_bug.cgi?id=1766890');

    await page.locator('#default').evaluate((el: HTMLIonPickerColumnInternalElement) => {
      el.scrollTop = 801;
    });
    await page.waitForChanges();

    const activeColumn = page.locator('ion-picker-column-internal .picker-item-active');

    expect(await activeColumn?.innerText()).toEqual('23');
  });

  test('should not emit ionChange when the value is modified externally', async ({ page, skip }) => {
    skip.browser('firefox', 'https://bugzilla.mozilla.org/show_bug.cgi?id=1766890');

    const ionChangeSpy = await page.spyOnEvent('ionChange');

    await page.locator('#default').evaluate((el: HTMLIonPickerColumnInternalElement) => {
      el.value = '12';
    });

    expect(ionChangeSpy).not.toHaveReceivedEvent();
  });

  test('should emit ionChange when the picker is scrolled', async ({ page, skip }) => {
    skip.browser('firefox', 'https://bugzilla.mozilla.org/show_bug.cgi?id=1766890');

    const ionChangeSpy = await page.spyOnEvent('ionChange');

    await page.locator('#default').evaluate((el: HTMLIonPickerColumnInternalElement) => {
      el.scrollTo(0, el.scrollHeight);
    });
    await page.waitForChanges();

    await ionChangeSpy.next();

    expect(ionChangeSpy).toHaveReceivedEvent();
  });
});
