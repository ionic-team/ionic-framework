import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('input: basic', () => {
  test.describe('input with overflow', () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(`
        <ion-content>
          <ion-list>
            <ion-item>
              <ion-input value="reallylonglonglonginputtoseetheedgesreallylonglonglonginputtoseetheedges" legacy="true"></ion-input>
            </ion-item>
          </ion-list>
        </ion-content>
      `);
      const item = page.locator('ion-item');
      // Validates the display of an input where text extends off the edge of the component.
      expect(await item.screenshot()).toMatchSnapshot(`input-with-text-overflow-${page.getSnapshotSettings()}.png`);
    });
  });

  test.describe('input with placeholder', () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(`
      <ion-content>
        <ion-list>
          <ion-item>
            <ion-input placeholder="Placeholder" legacy="true"></ion-input>
          </ion-item>
        </ion-list>
      </ion-content>
      `);
      const item = page.locator('ion-item');
      // Validates the display of an input with a placeholder.
      expect(await item.screenshot()).toMatchSnapshot(`input-with-placeholder-${page.getSnapshotSettings()}.png`);
    });
  });

  test.describe('input disabled', () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(`
      <ion-content>
        <ion-list>
          <ion-item>
            <ion-input value="Input disabled" disabled legacy="true"></ion-input>
          </ion-item>
        </ion-list>
      </ion-content>
      `);
      const item = page.locator('ion-item');
      // Validates the display of an input in a disabled state.
      expect(await item.screenshot()).toMatchSnapshot(`input-disabled-${page.getSnapshotSettings()}.png`);
    });
  });

  test.describe('input with lines="full"', () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(`
      <ion-content>
        <ion-list>
          <ion-item lines="full">
            <ion-input placeholder="Full" legacy="true"></ion-input>
          </ion-item>
        </ion-list>
      </ion-content>
      `);
      const item = page.locator('ion-item');
      const input = page.locator('ion-input');
      // Validates the display of an input with an ion-item using lines="full".
      expect(await item.screenshot({ animations: 'disabled' })).toMatchSnapshot(
        `input-with-lines-full-${page.getSnapshotSettings()}.png`
      );

      await input.click();

      // Verifies that the parent item receives .item-has-focus when the input is focused.
      await expect(item).toHaveClass(/item-has-focus/);
      // Validates the display of an input with an ion-item using lines="full" when focused.
      expect(await item.screenshot({ animations: 'disabled' })).toMatchSnapshot(
        `input-with-lines-full-focused-${page.getSnapshotSettings()}.png`
      );
    });
  });

  test.describe('input with lines="inset"', () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(`
      <ion-content>
        <ion-list>
          <ion-item lines="inset">
            <ion-input placeholder="Inset" legacy="true"></ion-input>
          </ion-item>
        </ion-list>
      </ion-content>
      `);
      const item = page.locator('ion-item');
      const input = page.locator('ion-input');
      // Validates the display of an input with an ion-item using lines="inset".
      expect(await item.screenshot({ animations: 'disabled' })).toMatchSnapshot(
        `input-with-lines-inset-${page.getSnapshotSettings()}.png`
      );

      await input.click();

      // Verifies that the parent item receives .item-has-focus when the input is focused.
      await expect(item).toHaveClass(/item-has-focus/);

      // Validates the display of an input with an ion-item using lines="inset" when focused.
      expect(await item.screenshot({ animations: 'disabled' })).toMatchSnapshot(
        `input-with-lines-inset-focused-${page.getSnapshotSettings()}.png`
      );
    });
  });

  test.describe('input with lines="none"', () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(`
      <ion-content>
        <ion-list>
          <ion-item lines="none">
            <ion-input placeholder="None" legacy="true"></ion-input>
          </ion-item>
        </ion-list>
      </ion-content>
      `);
      const item = page.locator('ion-item');
      const input = page.locator('ion-input');
      // Validates the display of an input with an ion-item using lines="none".
      expect(await item.screenshot({ animations: 'disabled' })).toMatchSnapshot(
        `input-with-lines-none-${page.getSnapshotSettings()}.png`
      );

      await input.click();

      // Verifies that the parent item receives .item-has-focus when the input is focused.
      await expect(item).toHaveClass(/item-has-focus/);

      // Validates the display of an input with an ion-item using lines="none" when focused.
      expect(await item.screenshot({ animations: 'disabled' })).toMatchSnapshot(
        `input-with-lines-none-focused-${page.getSnapshotSettings()}.png`
      );
    });
  });

  test.describe('input with clear button', () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(`
      <ion-content>
        <ion-list>
          <ion-item>
            <ion-label>Clear Input</ion-label>
            <ion-input
              clear-input
              value="reallylonglonglonginputtoseetheedgesreallylonglonglonginputtoseetheedges"
              legacy="true"
            ></ion-input>
          </ion-item>
        </ion-list>
      </ion-content>
      `);
      const item = page.locator('ion-item');
      // Validates the display of an input with a clear button.
      expect(await item.screenshot()).toMatchSnapshot(`input-with-clear-button-${page.getSnapshotSettings()}.png`);
    });
  });
});

test.describe('input: clear button', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
  });
  test('should clear the input when pressed', async ({ page }) => {
    await page.setContent(`
      <ion-input value="abc" clear-input="true" legacy="true"></ion-input>
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
      <ion-input value="abc" clear-input="true" legacy="true"></ion-input>
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
