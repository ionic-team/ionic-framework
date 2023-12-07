import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, config, screenshot }) => {
  test.describe(title('input: a11y'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      await page.goto(`/src/components/input/test/a11y`, config);

      /**
       * The primary color against the focus background
       * when using fill="solid" does not meet AA
       * contrast guidelines so it excluded from the test.
       * The contrast here is a significant improvement
       * over what Ionic has had in the past, so the team
       * has decided that this tradeoff is acceptable since
       * the scope of the problem is limited to the focus
       * state with the primary color when fill="solid".
       */
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  });

  test.describe(title('input: font scaling'), () => {
    test('should scale text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
          <style>
            html {
              font-size: 310%;
            }
          </style>
          <ion-input label="Email" helper-text="Enter your email"></ion-input>
        `,
        config
      );

      const input = page.locator('ion-input');
      await expect(input).toHaveScreenshot(screenshot('input-scale'));
    });
  });
});
