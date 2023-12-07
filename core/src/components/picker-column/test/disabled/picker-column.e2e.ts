import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('picker-column: disabled items'), () => {
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
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('picker-column: disabled column rendering'), () => {
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
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('picker-column: disabled column'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/picker-column/test/disabled', config);
    });

    test('clicking option in disabled column should not change value', async ({ page }) => {
      const column = page.locator('#column-disabled');
      const option = column.locator('ion-picker-column-option').nth(1);

      await expect(column).toHaveJSProperty('value', 11);

      /**
       * Options do not receive pointer events
       * so we need to forcibly click the element.
       */
      await option.click({ force: true });
      await page.waitForChanges();

      await expect(column).toHaveJSProperty('value', 11);
    });
  });
});
