import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('picker-column-internal: updating items', () => {
  test('should select nearest neighbor when updating items', async ({ page }) => {
    await page.setContent(`
      <ion-picker-internal>
        <ion-picker-column-internal></ion-picker-column-internal>
      </ion-picker-internal>

      <script>
        const column = document.querySelector('ion-picker-column-internal');
        column.items = [
          { text: '1', value: 1 },
          { text: '2', value: 2 },
          { text: '3', value: 3 },
          { text: '4', value: 4 },
          { text: '5', value: 5 },
        ];
        column.value = 5;
      </script>
    `);

    const pickerColumn = page.locator('ion-picker-column-internal');
    await expect(pickerColumn).toHaveJSProperty('value', 5);

    await pickerColumn.evaluate((el: HTMLIonPickerColumnInternalElement) => {
      el.items = [
        { text: '1', value: 1 },
        { text: '2', value: 2 },
      ];
    });

    await page.waitForChanges();
    await expect(pickerColumn).toHaveJSProperty('value', 2);
  });
  test('should select same position item even if item value is different', async ({ page }) => {
    await page.setContent(`
      <ion-picker-internal>
        <ion-picker-column-internal></ion-picker-column-internal>
      </ion-picker-internal>

      <script>
        const column = document.querySelector('ion-picker-column-internal');
        column.items = [
          { text: '1', value: 1 },
          { text: '2', value: 2 },
          { text: '3', value: 3 },
          { text: '4', value: 4 },
          { text: '5', value: 5 },
        ];
        column.value = 5;
      </script>
    `);

    const pickerColumn = page.locator('ion-picker-column-internal');
    await expect(pickerColumn).toHaveJSProperty('value', 5);

    await pickerColumn.evaluate((el: HTMLIonPickerColumnInternalElement) => {
      el.items = [
        { text: '1', value: 1 },
        { text: '2', value: 2 },
        { text: '3', value: 3 },
        { text: '4', value: 4 },
        { text: '1000', value: 1000 },
      ];
    });

    await page.waitForChanges();
    await expect(pickerColumn).toHaveJSProperty('value', 1000);
  });
  test('should not select a disabled item', async ({ page }) => {
    await page.setContent(`
      <ion-picker-internal>
        <ion-picker-column-internal></ion-picker-column-internal>
      </ion-picker-internal>

      <script>
        const column = document.querySelector('ion-picker-column-internal');
        column.items = [
          { text: '1', value: 1 },
          { text: '2', value: 2 },
          { text: '3', value: 3 },
          { text: '4', value: 4 },
          { text: '5', value: 5 },
        ];
        column.value = 5;
      </script>
    `);

    const pickerColumn = page.locator('ion-picker-column-internal');
    await expect(pickerColumn).toHaveJSProperty('value', 5);

    await pickerColumn.evaluate((el: HTMLIonPickerColumnInternalElement) => {
      el.items = [
        { text: '1', value: 1 },
        { text: '2', value: 2 },
        { text: '3', value: 3, disabled: true },
      ];
    });

    await page.waitForChanges();
    await expect(pickerColumn).toHaveJSProperty('value', 2);
  });
  test('should reset to the first item if no good item was found', async ({ page }) => {
    await page.setContent(`
      <ion-picker-internal>
        <ion-picker-column-internal></ion-picker-column-internal>
      </ion-picker-internal>

      <script>
        const column = document.querySelector('ion-picker-column-internal');
        column.items = [
          { text: '1', value: 1 },
          { text: '2', value: 2 },
          { text: '3', value: 3 },
          { text: '4', value: 4 },
          { text: '5', value: 5 },
        ];
        column.value = 5;
      </script>
    `);

    const pickerColumn = page.locator('ion-picker-column-internal');
    await expect(pickerColumn).toHaveJSProperty('value', 5);

    await pickerColumn.evaluate((el: HTMLIonPickerColumnInternalElement) => {
      el.items = [
        { text: '1', value: 1 },
        { text: '2', value: 2, disabled: true },
        { text: '3', value: 3, disabled: true },
      ];
    });

    await page.waitForChanges();
    await expect(pickerColumn).toHaveJSProperty('value', 1);
  });
  test('should still select correct value if data was added', async ({ page }) => {
    await page.setContent(`
      <ion-picker-internal>
        <ion-picker-column-internal></ion-picker-column-internal>
      </ion-picker-internal>

      <script>
        const column = document.querySelector('ion-picker-column-internal');
        column.items = [
          { text: '1', value: 1 },
          { text: '2', value: 2 },
          { text: '3', value: 3 },
          { text: '4', value: 4 },
          { text: '5', value: 5 },
        ];
        column.value = 5;
      </script>
    `);

    const pickerColumn = page.locator('ion-picker-column-internal');
    await expect(pickerColumn).toHaveJSProperty('value', 5);

    await pickerColumn.evaluate((el: HTMLIonPickerColumnInternalElement) => {
      el.items = [
        { text: '1', value: 1 },
        { text: '2', value: 2 },
        { text: '3', value: 3 },
        { text: '4', value: 4 },
        { text: '6', value: 6 },
        { text: '7', value: 7 },
        { text: '5', value: 5 },
      ];
    });

    await page.waitForChanges();
    await expect(pickerColumn).toHaveJSProperty('value', 5);
  });
});
