import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('picker-column'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/picker-column/test/basic', config);
    });

    test('should render 6 empty picker items', async ({ page }) => {
      const columns = page.locator('ion-picker-column .picker-item-empty');
      await expect(columns).toHaveCount(6);
    });

    test('should not have an active item when value is not set', async ({ page }) => {
      const activeColumn = page.locator('ion-picker-column .option-active');
      await expect(activeColumn).toHaveCount(0);
    });

    test('should have an active item when value is set', async ({ page }) => {
      await page.locator('#default').evaluate((el: HTMLIonPickerColumnElement) => {
        el.value = '12';
      });
      await page.waitForChanges();

      const activeColumn = page.locator('ion-picker-column .option-active');

      expect(activeColumn).not.toBeNull();
    });

    // TODO FW-3616
    test.skip('scrolling should change the active item', async ({ page, skip }) => {
      skip.browser('firefox', 'https://bugzilla.mozilla.org/show_bug.cgi?id=1766890');

      await page.locator('#default').evaluate((el: HTMLIonPickerColumnElement) => {
        el.scrollTop = 801;
      });
      await page.waitForChanges();

      const activeColumn = page.locator('ion-picker-column .option-active');

      await expect(activeColumn).toHaveJSProperty('value', 23);
    });

    test('should not emit ionChange when the value is modified externally', async ({ page, skip }) => {
      skip.browser('firefox', 'https://bugzilla.mozilla.org/show_bug.cgi?id=1766890');

      const ionChangeSpy = await page.spyOnEvent('ionChange');

      await page.locator('#default').evaluate((el: HTMLIonPickerColumnElement) => {
        el.value = '12';
      });

      expect(ionChangeSpy).not.toHaveReceivedEvent();
    });

    // TODO FW-3616
    test.skip('should emit ionChange when the picker is scrolled', async ({ page, skip }) => {
      skip.browser('firefox', 'https://bugzilla.mozilla.org/show_bug.cgi?id=1766890');

      const ionChangeSpy = await page.spyOnEvent('ionChange');

      await page.locator('#default').evaluate((el: HTMLIonPickerColumnElement) => {
        el.scrollTo(0, el.scrollHeight);
      });
      await page.waitForChanges();

      await ionChangeSpy.next();

      expect(ionChangeSpy).toHaveReceivedEvent();
    });
  });
});
