import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('textarea: bottom content', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
    skip.mode('ios', 'Rendering is the same across modes');
  });
  test('should not render bottom content if no hint or counter is enabled', async ({ page }) => {
    await page.setContent(`<ion-textarea label="my textarea"></ion-textarea>`);

    const bottomEl = page.locator('ion-textarea .textarea-bottom');
    await expect(bottomEl).toHaveCount(0);
  });
});

test.describe('textarea: hint text', () => {
  test.describe('textarea: hint text functionality', () => {
    test.beforeEach(({ skip }) => {
      skip.rtl();
      skip.mode('ios', 'Rendering is the same across modes');
    });
    test('helper text should be visible initially', async ({ page }) => {
      await page.setContent(
        `<ion-textarea helper-text="my helper" error-text="my error" label="my textarea"></ion-textarea>`
      );

      const helperText = page.locator('ion-textarea .helper-text');
      const errorText = page.locator('ion-textarea .error-text');
      await expect(helperText).toBeVisible();
      await expect(helperText).toHaveText('my helper');
      await expect(errorText).toBeHidden();
    });
    test('error text should be visible when textarea is invalid', async ({ page }) => {
      await page.setContent(
        `<ion-textarea class="ion-invalid" helper-text="my helper" error-text="my error" label="my textarea"></ion-textarea>`
      );

      const helperText = page.locator('ion-textarea .helper-text');
      const errorText = page.locator('ion-textarea .error-text');
      await expect(helperText).toBeHidden();
      await expect(errorText).toBeVisible();
      await expect(errorText).toHaveText('my error');
    });
    test('error text should change when variable is customized', async ({ page }) => {
      await page.setContent(`
        <style>
          ion-textarea.custom-textarea {
            --highlight-color-invalid: purple;
          }
        </style>
        <ion-textarea class="ion-invalid custom-textarea" label="my label" error-text="my error"></ion-textarea>
      `);

      const errorText = page.locator('ion-textarea .error-text');
      expect(await errorText.screenshot()).toMatchSnapshot(
        `textarea-error-custom-color-${page.getSnapshotSettings()}.png`
      );
    });
  });
  test.describe('textarea: hint text rendering', () => {
    test.describe('regular textareas', () => {
      test('should not have visual regressions when rendering helper text', async ({ page }) => {
        await page.setContent(`<ion-textarea helper-text="my helper" label="my textarea"></ion-textarea>`);

        const bottomEl = page.locator('ion-textarea .textarea-bottom');
        expect(await bottomEl.screenshot()).toMatchSnapshot(
          `textarea-bottom-content-helper-${page.getSnapshotSettings()}.png`
        );
      });
      test('should not have visual regressions when rendering error text', async ({ page }) => {
        await page.setContent(
          `<ion-textarea class="ion-invalid" error-text="my helper" label="my textarea"></ion-textarea>`
        );

        const bottomEl = page.locator('ion-textarea .textarea-bottom');
        expect(await bottomEl.screenshot()).toMatchSnapshot(
          `textarea-bottom-content-error-${page.getSnapshotSettings()}.png`
        );
      });
    });
  });
});
