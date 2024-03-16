import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('select: wrapping'), () => {
    test('should not wrap text by default', async ({ page }) => {
      await page.setContent(
        `
        <ion-select value="nowrap" legacy="true">
          <ion-select-option value="nowrap">Should not wrap when no label exists and no class is added to make the text wrap</ion-select-option>
        </ion-select>
      `,
        config
      );

      const select = page.locator('ion-select');
      await expect(select).toHaveScreenshot(screenshot(`select-nowrap`));
    });

    test('should wrap text with class', async ({ page }) => {
      await page.setContent(
        `
        <ion-select value="wrap" legacy="true" class="ion-text-wrap">
          <ion-select-option value="wrap">Should wrap when no label exists and really long text exists to make it wrap the text</ion-select-option>
        </ion-select>
      `,
        config
      );

      const select = page.locator('ion-select');
      await expect(select).toHaveScreenshot(screenshot(`select-wrap`));
    });

    test('should not wrap label while wrapping text with class', async ({ page }) => {
      await page.setContent(
        `
        <ion-item>
          <ion-label>Really long label should not wrap</ion-label>
          <ion-select value="wrap" legacy="true" class="ion-text-wrap">
            <ion-select-option value="wrap">Should wrap value only when label exists and really long text exists to make it wrap the text</ion-select-option>
          </ion-select>
        </ion-item>
      `,
        config
      );

      const select = page.locator('ion-item');
      await expect(select).toHaveScreenshot(screenshot(`select-wrap-with-label`));
    });
  });
});
