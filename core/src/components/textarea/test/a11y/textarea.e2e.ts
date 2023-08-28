import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, config, screenshot }) => {
  test.describe(title('textarea: a11y'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      await page.goto(`/src/components/textarea/test/a11y`, config);

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  });

  test.describe(title('textarea: font scaling'), () => {
    test('should scale text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>
        <ion-textarea label="Email" helper-text="Enter your email"></ion-textarea>
      `,
        config
      );

      const textarea = page.locator('ion-textarea');

      await expect(textarea).toHaveScreenshot(screenshot('textarea-scale'));
    });
  });
});
