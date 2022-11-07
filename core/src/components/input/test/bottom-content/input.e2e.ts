import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('input: bottom content', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
    skip.mode('ios', 'Rendering is the same across modes');
  });
  test('should not render bottom content if no hint or counter is enabled', async ({ page }) => {
    await page.setContent(`<ion-input label="my input"></ion-input>`);

    const bottomEl = page.locator('ion-input .item-bottom');
    await expect(bottomEl).toHaveCount(0);
  });
});

test.describe('input: hint text', () => {
  test.describe('input: hint text functionality', () => {
    test.beforeEach(({ skip }) => {
      skip.rtl();
      skip.mode('ios', 'Rendering is the same across modes');
    });
    test('helper text should be visible initially', async ({ page }) => {
      await page.setContent(`<ion-input helper-text="my helper" error-text="my error" label="my input"></ion-input>`);

      const helperText = page.locator('ion-input .helper-text');
      const errorText = page.locator('ion-input .error-text');
      await expect(helperText).toBeVisible();
      await expect(helperText).toHaveText('my helper');
      await expect(errorText).toBeHidden();
    });
    test('error text should be visible when input is invalid', async ({ page }) => {
      await page.setContent(
        `<ion-input class="ion-invalid" helper-text="my helper" error-text="my error" label="my input"></ion-input>`
      );

      const helperText = page.locator('ion-input .helper-text');
      const errorText = page.locator('ion-input .error-text');
      await expect(helperText).toBeHidden();
      await expect(errorText).toBeVisible();
      await expect(errorText).toHaveText('my error');
    });
    test('error text should change when variable is customized', async ({ page }) => {
      await page.setContent(`
        <style>
          ion-input.custom-input {
            --highlight-color-invalid: purple;
          }
        </style>
        <ion-input class="ion-invalid custom-input" label="my label" error-text="my error"></ion-input>
      `);

      const errorText = page.locator('ion-input .error-text');
      expect(await errorText.screenshot()).toMatchSnapshot(
        `input-error-custom-color-${page.getSnapshotSettings()}.png`
      );
    });
  });
  test.describe('input: hint text rendering', () => {
    test.describe('regular inputs', () => {
      test('should not have visual regressions when rendering helper text', async ({ page }) => {
        await page.setContent(`<ion-input helper-text="my helper" label="my input"></ion-input>`);

        const bottomEl = page.locator('ion-input .input-bottom');
        expect(await bottomEl.screenshot()).toMatchSnapshot(
          `input-bottom-content-helper-${page.getSnapshotSettings()}.png`
        );
      });
      test('should not have visual regressions when rendering error text', async ({ page }) => {
        await page.setContent(`<ion-input class="ion-invalid" error-text="my helper" label="my input"></ion-input>`);

        const bottomEl = page.locator('ion-input .input-bottom');
        expect(await bottomEl.screenshot()).toMatchSnapshot(
          `input-bottom-content-error-${page.getSnapshotSettings()}.png`
        );
      });
    });
  });
});
