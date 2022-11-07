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
      expect(await input.screenshot()).toMatchSnapshot(`input-with-text-overflow-${page.getSnapshotSettings()}.png`);
    });
  });
  test.describe('input with placeholder', () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(`
        <ion-input placeholder="Placeholder"></ion-input>
      `);
      const input = page.locator('ion-input');
      // Validates the display of an input with a placeholder.
      expect(await input.screenshot()).toMatchSnapshot(`input-with-placeholder-${page.getSnapshotSettings()}.png`);
    });
  });
  test.describe('input with lines="full"', () => {
    test.skip('should not have visual regressions', async ({ page }) => {
      await page.setContent(`
      <ion-content>
        <ion-list>
          <ion-item lines="full">
            <ion-input placeholder="Full"></ion-input>
          </ion-item>
        </ion-list>
      </ion-content>
      `);
      const item = page.locator('ion-item');
      const input = page.locator('ion-input');
      // Validates the display of an input with an ion-item using lines="full".
      expect(await item.screenshot()).toMatchSnapshot(`input-with-lines-full-${page.getSnapshotSettings()}.png`);

      await input.click();

      // Verifies that the parent item receives .item-has-focus when the input is focused.
      await expect(item).toHaveClass(/item-has-focus/);
      // Validates the display of an input with an ion-item using lines="full" when focused.
      expect(await item.screenshot()).toMatchSnapshot(
        `input-with-lines-full-focused-${page.getSnapshotSettings()}.png`
      );
    });
  });

  test.describe('input with lines="inset"', () => {
    test.skip('should not have visual regressions', async ({ page }) => {
      await page.setContent(`
      <ion-content>
        <ion-list>
          <ion-item lines="inset">
            <ion-input placeholder="Inset"></ion-input>
          </ion-item>
        </ion-list>
      </ion-content>
      `);
      const item = page.locator('ion-item');
      const input = page.locator('ion-input');
      // Validates the display of an input with an ion-item using lines="inset".
      expect(await item.screenshot()).toMatchSnapshot(`input-with-lines-inset-${page.getSnapshotSettings()}.png`);

      await input.click();

      // Verifies that the parent item receives .item-has-focus when the input is focused.
      await expect(item).toHaveClass(/item-has-focus/);

      // Validates the display of an input with an ion-item using lines="inset" when focused.
      expect(await item.screenshot()).toMatchSnapshot(
        `input-with-lines-inset-focused-${page.getSnapshotSettings()}.png`
      );
    });
  });

  test.describe('input with lines="none"', () => {
    test.skip('should not have visual regressions', async ({ page }) => {
      await page.setContent(`
      <ion-content>
        <ion-list>
          <ion-item lines="none">
            <ion-input placeholder="None"></ion-input>
          </ion-item>
        </ion-list>
      </ion-content>
      `);
      const item = page.locator('ion-item');
      const input = page.locator('ion-input');
      // Validates the display of an input with an ion-item using lines="none".
      expect(await item.screenshot()).toMatchSnapshot(`input-with-lines-none-${page.getSnapshotSettings()}.png`);

      await input.click();

      // Verifies that the parent item receives .item-has-focus when the input is focused.
      await expect(item).toHaveClass(/item-has-focus/);

      // Validates the display of an input with an ion-item using lines="none" when focused.
      expect(await item.screenshot()).toMatchSnapshot(
        `input-with-lines-none-focused-${page.getSnapshotSettings()}.png`
      );
    });
  });

  test.describe('input with clear button', () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(`
        <ion-input
          clear-input="true"
          value="Text"
        ></ion-input>
      `);
      const input = page.locator('ion-input');
      // Validates the display of an input with a clear button.
      expect(await input.screenshot()).toMatchSnapshot(`input-with-clear-button-${page.getSnapshotSettings()}.png`);
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
      <ion-input label="my label" value="abc" clear-input="true"></ion-searchbar>
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
});
