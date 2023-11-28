import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('picker-column-internal: disabled rendering'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `
        <ion-picker-internal>
          <ion-picker-column-internal value="b"></ion-picker-column-internal>
        </ion-picker-internal>

        <script>
          const column = document.querySelector('ion-picker-column-internal');
          column.items = [
            { text: 'A', value: 'a', disabled: true },
            { text: 'B', value: 'b' },
            { text: 'C', value: 'c', disabled: true }
          ]
        </script>
      `,
        config
      );

      const picker = page.locator('ion-picker-internal');
      await expect(picker).toHaveScreenshot(screenshot(`picker-disabled`));
    });
  });
});

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('picker-column-internal: disabled items'), () => {
    test('all picker items should be enabled by default', async ({ page }) => {
      await page.setContent(
        `
        <ion-picker-internal>
          <ion-picker-column-internal></ion-picker-column-internal>
        </ion-picker-internal>

        <script>
          const column = document.querySelector('ion-picker-column-internal');
          column.items = [
            { text: 'A', value: 'a' },
            { text: 'B', value: 'b' },
            { text: 'C', value: 'c' }
          ]
        </script>
      `,
        config
      );

      const pickerItems = page.locator('ion-picker-column-internal .picker-item:not(.picker-item-empty, [disabled])');

      expect(await pickerItems.count()).toBe(3);
    });
    test('disabled picker item should not be interactive', async ({ page }) => {
      await page.setContent(
        `
        <ion-picker-internal>
          <ion-picker-column-internal></ion-picker-column-internal>
        </ion-picker-internal>

        <script>
          const column = document.querySelector('ion-picker-column-internal');
          column.items = [
            { text: 'A', value: 'a' },
            { text: 'B', value: 'b', disabled: true },
            { text: 'C', value: 'c' }
          ]
        </script>
      `,
        config
      );

      const disabledItem = page.locator('ion-picker-column-internal .picker-item[disabled]');
      await expect(disabledItem).not.toBeEnabled();
    });
    test('disabled picker item should not be considered active', async ({ page }) => {
      await page.setContent(
        `
        <ion-picker-internal>
          <ion-picker-column-internal value="b"></ion-picker-column-internal>
        </ion-picker-internal>

        <script>
          const column = document.querySelector('ion-picker-column-internal');
          column.items = [
            { text: 'A', value: 'a' },
            { text: 'B', value: 'b', disabled: true },
            { text: 'C', value: 'c' }
          ]
        </script>
      `,
        config
      );

      const disabledItem = page.locator('ion-picker-column-internal .picker-item[data-value="b"]');
      await expect(disabledItem).not.toHaveClass(/picker-item-active/);
    });
    test('setting the value to a disabled item should not cause that item to be active', async ({ page }) => {
      await page.setContent(
        `
        <ion-picker-internal>
          <ion-picker-column-internal></ion-picker-column-internal>
        </ion-picker-internal>

        <script>
          const column = document.querySelector('ion-picker-column-internal');
          column.items = [
            { text: 'A', value: 'a' },
            { text: 'B', value: 'b', disabled: true },
            { text: 'C', value: 'c' }
          ]
        </script>
      `,
        config
      );

      const pickerColumn = page.locator('ion-picker-column-internal');
      await pickerColumn.evaluate((el: HTMLIonPickerColumnInternalElement) => (el.value = 'b'));

      await page.waitForChanges();

      const disabledItem = page.locator('ion-picker-column-internal .picker-item[data-value="b"]');
      await expect(disabledItem).toBeDisabled();
      await expect(disabledItem).not.toHaveClass(/picker-item-active/);
    });
    test('defaulting the value to a disabled item should not cause that item to be active', async ({ page }) => {
      await page.setContent(
        `
        <ion-picker-internal>
          <ion-picker-column-internal></ion-picker-column-internal>
        </ion-picker-internal>

        <script>
          const column = document.querySelector('ion-picker-column-internal');
          column.items = [
            { text: 'A', value: 'a' },
            { text: 'B', value: 'b', disabled: true },
            { text: 'C', value: 'c' }
          ]
          column.value = 'b'
        </script>
      `,
        config
      );

      const disabledItem = page.locator('ion-picker-column-internal .picker-item[data-value="b"]');
      await expect(disabledItem).toBeDisabled();
      await expect(disabledItem).not.toHaveClass(/picker-item-active/);
    });
  });
});

/**
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('picker-column-internal: disabled column rendering'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/picker-column-internal/test/disabled', config);
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
  test.describe(title('picker-column-internal: disabled column'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/picker-column-internal/test/disabled', config);
    });

    test('item in disabled column should not be interactive', async ({ page }) => {
      const secondItem = page.locator('#column-disabled .picker-item:not(.picker-item-empty)').nth(1);
      await expect(secondItem).toBeDisabled();
    });
  });
});
