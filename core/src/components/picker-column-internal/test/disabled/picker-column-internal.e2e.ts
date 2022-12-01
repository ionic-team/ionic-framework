import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('picker-column-internal: disabled', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
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
      expect(await picker.screenshot()).toMatchSnapshot(`picker-internal-disabled-${page.getSnapshotSettings()}.png`);
    });
    test(title('all picker items should be enabled by default'), async ({ page }) => {
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

      const pickerItems = page.locator(
        'ion-picker-column-internal .picker-item:not(.picker-item-empty, .picker-item-disabled)'
      );

      expect(await pickerItems.count()).toBe(3);
    });
    test(title('disabled picker item should not be interactive'), async ({ page }) => {
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

      const disabledItem = page.locator('ion-picker-column-internal .picker-item.picker-item-disabled');
      expect(disabledItem).not.toBeEnabled();
    });
    test(title('disabled picker item should not be considered active'), async ({ page }) => {
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
      expect(disabledItem).not.toHaveClass(/picker-item-active/);
    });
    test(title('setting the value to a disabled item should not cause that item to be active'), async ({ page }) => {
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
      expect(disabledItem).toHaveClass(/picker-item-disabled/);
      expect(disabledItem).not.toHaveClass(/picker-item-active/);
    });
    test(title('defaulting the value to a disabled item should not cause that item to be active'), async ({ page }) => {
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
      expect(disabledItem).toHaveClass(/picker-item-disabled/);
      expect(disabledItem).not.toHaveClass(/picker-item-active/);
    });
  });
});
