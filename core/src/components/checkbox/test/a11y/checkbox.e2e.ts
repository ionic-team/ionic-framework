import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], palettes: ['light', 'dark'] }).forEach(({ title, config }) => {
  test.describe(title('checkbox: a11y'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      await page.setContent(
        `
        <main>
          <ion-checkbox>Label</ion-checkbox>
          <ion-checkbox aria-label="my aria label"></ion-checkbox>
          <ion-checkbox checked="true">Checked</ion-checkbox>
          <ion-item>
            <ion-checkbox>Checkbox in item</ion-checkbox>
          </ion-item>
        </main>
      `,
        config
      );

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  });
});

configs({ directions: ['ltr'] }).forEach(({ title, config, screenshot }) => {
  test.describe(title('checkbox: a11y'), () => {
    test.describe(title('checkbox: font scaling'), () => {
      test('should scale text on larger font sizes', async ({ page }) => {
        await page.setContent(
          `
            <style>
              html {
                font-size: 310%;
              }
            </style>
            <ion-checkbox justify="start" checked>Checked</ion-checkbox>
          `,
          config
        );

        const checkbox = page.locator('ion-checkbox');
        await expect(checkbox).toHaveScreenshot(screenshot('checkbox-scale'));
      });
    });
  });
});
