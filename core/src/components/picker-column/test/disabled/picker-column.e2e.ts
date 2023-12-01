import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('picker-column: disabled items'), () => {
    // TODO FW-5580 move this to a spec test in picker-column-option
    test('all picker items should be enabled by default', async ({ page }) => {
      await page.setContent(
        `
        <ion-picker>
          <ion-picker-column>
            <ion-picker-column-option value="a">A</ion-picker-column-option>
            <ion-picker-column-option value="b">B</ion-picker-column-option>
            <ion-picker-column-option value="c">C</ion-picker-column-option>
          </ion-picker-column>
        </ion-picker>
      `,
        config
      );

      const pickerItems = page.locator('ion-picker-column ion-picker-column-option button:not([disabled])');

      expect(await pickerItems.count()).toBe(3);
    });
    // TODO FW-5580 move this to a spec test in picker-column-option
    test('disabled picker item should not be interactive', async ({ page }) => {
      await page.setContent(
        `
        <ion-picker>
          <ion-picker-column>
            <ion-picker-column-option value="a">A</ion-picker-column-option>
            <ion-picker-column-option value="b" disabled="true">B</ion-picker-column-option>
            <ion-picker-column-option value="c">C</ion-picker-column-option>
          </ion-picker-column>
        </ion-picker>
      `,
        config
      );

      const disabledItem = page.locator('ion-picker-column ion-picker-column-option button').nth(1);
      await expect(disabledItem).not.toBeEnabled();
    });
    test('disabled picker item should not be considered active', async ({ page }) => {
      await page.setContent(
        `
        <ion-picker>
          <ion-picker-column value="b">
            <ion-picker-column-option value="a">A</ion-picker-column-option>
            <ion-picker-column-option value="b" disabled="true">B</ion-picker-column-option>
            <ion-picker-column-option value="c">C</ion-picker-column-option>
          </ion-picker-column>
        </ion-picker>
      `,
        config
      );

      const disabledItem = page.locator('ion-picker-column-option').nth(1);
      await expect(disabledItem).not.toHaveClass(/option-active/);
    });
    test('setting the value to a disabled item should not cause that item to be active', async ({ page }) => {
      await page.setContent(
        `
        <ion-picker>
          <ion-picker-column>
            <ion-picker-column-option value="a">A</ion-picker-column-option>
            <ion-picker-column-option value="b" disabled="true">B</ion-picker-column-option>
            <ion-picker-column-option value="c">C</ion-picker-column-option>
          </ion-picker-column>
        </ion-picker>
      `,
        config
      );

      const pickerColumn = page.locator('ion-picker-column');
      await pickerColumn.evaluate((el: HTMLIonPickerColumnElement) => (el.value = 'b'));

      await page.waitForChanges();

      const disabledItem = page.locator('ion-picker-column ion-picker-column-option').nth(1);
      await expect(disabledItem).not.toHaveClass(/option-active/);
    });
    test('defaulting the value to a disabled item should not cause that item to be active', async ({ page }) => {
      await page.setContent(
        `
        <ion-picker>
          <ion-picker-column value="b">
            <ion-picker-column-option value="a">A</ion-picker-column-option>
            <ion-picker-column-option value="b" disabled="true">B</ion-picker-column-option>
            <ion-picker-column-option value="c">C</ion-picker-column-option>
          </ion-picker-column>
        </ion-picker>
      `,
        config
      );

      const disabledItem = page.locator('ion-picker-column ion-picker-column-option').nth(1);
      await expect(disabledItem).not.toHaveClass(/option-active/);
    });
  });
});

/**
 * This behavior does not vary across directions.
 */
// TODO FW-5580 fix this
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe.skip(title('picker-column: disabled column rendering'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/picker-column/test/disabled', config);
    });

    test('disabled column should not have visual regressions', async ({ page }) => {
      const disabledColumn = page.locator('#column-disabled');
      await page.waitForChanges();

      await expect(disabledColumn).toHaveScreenshot(screenshot('picker-disabled-column'));
    });
  });
});

/**
 * This behavior does not vary across modes/directions.
 */
// TODO FW-5580 fix this
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe.skip(title('picker-column: disabled column'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/picker-column/test/disabled', config);
    });

    test('item in disabled column should not be interactive', async ({ page }) => {
      const secondItem = page.locator('#column-disabled .picker-item:not(.picker-item-empty)').nth(1);
      await expect(secondItem).toBeDisabled();
    });
  });
});
