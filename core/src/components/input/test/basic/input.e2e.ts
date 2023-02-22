import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('input: basic', () => {
  test.describe('input with overflow', () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(`
        <ion-input value="reallylonglonglonginputtoseetheedgesreallylonglonglonginputtoseetheedges"></ion-input>
      `);
      const input = page.locator('ion-input');
      // Validates the display of an input where text extends off the edge of the component.
      await expect(input).toHaveScreenshot(`input-with-text-overflow-${page.getSnapshotSettings()}.png`);
    });
  });
  test.describe('input with placeholder', () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(`
        <ion-input placeholder="Placeholder"></ion-input>
      `);
      const input = page.locator('ion-input');
      // Validates the display of an input with a placeholder.
      await expect(input).toHaveScreenshot(`input-with-placeholder-${page.getSnapshotSettings()}.png`);
    });
  });

  test.describe('input with clear button', () => {
    test('should not have visual regressions with default label', async ({ page }) => {
      await page.setContent(`
        <ion-input
          label="Label"
          clear-input="true"
          value="Text"
        ></ion-input>
      `);
      const input = page.locator('ion-input');
      // Validates the display of an input with a clear button.
      await expect(input).toHaveScreenshot(`input-with-clear-button-${page.getSnapshotSettings()}.png`);
    });
    test('should not have visual regressions with stacked label', async ({ page }) => {
      await page.setContent(`
        <ion-input
          label="Label"
          label-placement="stacked"
          clear-input="true"
          value="Text"
        ></ion-input>
      `);
      const input = page.locator('ion-input');
      // Validates the display of an input with a clear button.
      await expect(input).toHaveScreenshot(`input-with-clear-button-stacked-${page.getSnapshotSettings()}.png`);
    });
  });
});

test.describe('input: clear button', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
  });
  test('should clear the input when pressed', async ({ page }) => {
    await page.setContent(`
      <ion-input label="my label" value="abc" clear-input="true"></ion-input>
    `);

    const input = page.locator('ion-input');
    const clearButton = input.locator('.input-clear-icon');

    await expect(input).toHaveJSProperty('value', 'abc');

    await clearButton.click();
    await page.waitForChanges();

    await expect(input).toHaveJSProperty('value', '');
  });
  /**
   * Note: This only tests the desktop focus behavior.
   * Mobile browsers have different restrictions around
   * focusing inputs, so these platforms should always
   * be tested when making changes to the focus behavior.
   */
  test('should keep the input focused when the clear button is pressed', async ({ page }) => {
    await page.setContent(`
      <ion-input label="my label" value="abc" clear-input="true"></ion-input>
    `);

    const input = page.locator('ion-input');
    const nativeInput = input.locator('input');
    const clearButton = input.locator('.input-clear-icon');

    await input.click();
    await expect(nativeInput).toBeFocused();

    await clearButton.click();
    await page.waitForChanges();

    await expect(nativeInput).toBeFocused();
  });

  test('should inherit color when used in item with color property', async ({ page }) => {
    await page.setContent(`
      <ion-item color="primary">
        <ion-input aria-label="my label" value="Text" clear-input="true"></ion-input>
      </ion-item>
    `);

    const item = page.locator('ion-item');
    await expect(item).toHaveScreenshot(`input-with-clear-button-item-color-${page.getSnapshotSettings()}.png`);
  });
});
