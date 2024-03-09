import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Only ios mode uses ion-color() for the back button
 */
configs({ directions: ['ltr'], modes: ['ios'], themeModes: ['light', 'dark'] }).forEach(({ title, config }) => {
  test.describe(title('back-button: a11y for ion-color()'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      await page.setContent(
        `
        <style>
          ion-back-button {
            display: inline-block !important;
            vertical-align: middle;
          }
        </style>
        <ion-back-button text="Back" aria-label="back button"></ion-back-button>
      `,
        config
      );

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  });
});

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('back-button: font scaling'), () => {
    test('should scale text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 36px;
          }
        </style>

        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button default-href="/" text="Back"></ion-back-button>
          </ion-buttons>
        </ion-toolbar>
      `,
        config
      );

      const backButton = page.locator('ion-back-button');

      await expect(backButton).toHaveScreenshot(screenshot(`back-button-scale`));
    });
  });
});
