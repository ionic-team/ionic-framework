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

  test('helper text should be visible initially', async ({ page }) => {
    await page.setContent(`<ion-input helper-text="my helper" error-text="my error" label="my input"></ion-input>`);

    const helperText = page.locator('ion-input .helper-text');
    const errorText = page.locator('ion-input .error-text');
    await expect(helperText).toBeVisible();
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
  });
});

test.describe('input: bottom content rendering', () => {
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
      expect(await bottomEl.screenshot()).toMatchSnapshot(`input-bottom-content-error-${page.getSnapshotSettings()}.png`);
    });
  });
});
