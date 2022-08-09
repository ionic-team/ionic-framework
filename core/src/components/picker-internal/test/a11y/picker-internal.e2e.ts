import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('picker-internal: a11y', () => {
  test('should not have accessibility violations', async ({ page }) => {
    await page.goto(`/src/components/picker-internal/test/a11y`);

    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations).toEqual([]);
  });
  test('should set the aria-label, aria-valuenow, and aria-valuetext attributes', async ({ page }, testInfo) => {
    test.skip(testInfo.project.metadata.rtl === true, 'This does not test LTR vs RTL layouts.');
    test.skip(testInfo.project.metadata.mode === 'md', 'This does not have mode specific logic.');

    await page.goto(`/src/components/picker-internal/test/a11y`);

    const column = page.locator('ion-picker-column-internal');
    await expect(column).toHaveAttribute('aria-label', 'Picker Item');

    await expect(column).toHaveAttribute('aria-valuenow', '3');
    await expect(column).toHaveAttribute('aria-valuetext', 'Third');

    await column.evaluate((el: HTMLIonPickerColumnInternalElement) => (el.value = '6'));
    await page.waitForChanges();

    await expect(column).toHaveAttribute('aria-valuenow', '6');
    await expect(column).toHaveAttribute('aria-valuetext', 'Sixth');

    await column.evaluate((el: HTMLIonPickerColumnInternalElement) => (el.value = '7'));
    await page.waitForChanges();

    // Item 7 is disabled, so the picker will reset to the first item
    await expect(column).toHaveAttribute('aria-valuenow', '1');
    await expect(column).toHaveAttribute('aria-valuetext', 'First');
  });
  test('custom aria-label should be set', async ({ page }, testInfo) => {
    test.skip(testInfo.project.metadata.rtl === true, 'This does not test LTR vs RTL layouts.');
    test.skip(testInfo.project.metadata.mode === 'md', 'This does not have mode specific logic.');

    await page.setContent(`
      <ion-picker-column-internal value="5" aria-label="Custom label"></ion-picker-column-internal>

      <script>
        const column = document.querySelector('ion-picker-column-internal');
        column.items = [
          { text: '01', value: 1 },
          { text: '02', value: 2 },
          { text: '03', value: 3 },
          { text: '04', value: 4 },
          { text: '05', value: 5 }
        ];
      </script>
    `);

    const column = page.locator('ion-picker-column-internal');
    await expect(column).toHaveAttribute('aria-label', 'Custom label');
  });
});
