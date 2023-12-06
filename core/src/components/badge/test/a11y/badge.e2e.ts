import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('badge: font scaling'), () => {
    test('should scale text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 36px;
          }
        </style>

        <ion-badge>123</ion-badge>
      `,
        config
      );

      const badge = page.locator('ion-badge');

      await expect(badge).toHaveScreenshot(screenshot(`badge-scale`));
    });
  });
});

configs({ directions: ['ltr'] }).forEach(({ config, title }) => {
  test.describe(title('badge: a11y (light mode)'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      /**
       * All page content should be contained by landmarks (main, nav, etc.)
       * By containing the badge in a main element, we can avoid this violation.
       */
      await page.setContent(
        `
        <main>
          <ion-badge>123</ion-badge>
          <ion-badge class="ion-color">123</ion-badge>
        </main>
      `,
        config
      );

      const results = await new AxeBuilder({ page }).analyze();

      expect(results.violations).toEqual([]);
    });
  });
});

configs({ directions: ['ltr'], themes: ['dark'] }).forEach(({ config, title }) => {
  test.describe(title('badge: a11y (dark mode)'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      /**
       * All page content should be contained by landmarks (main, nav, etc.)
       * By containing the badge in a main element, we can avoid this violation.
       */
      await page.setContent(
        `
        <main>
          <ion-badge>123</ion-badge>
          <ion-badge class="ion-color">123</ion-badge>
        </main>
      `,
        config
      );

      const results = await new AxeBuilder({ page }).analyze();

      expect(results.violations).toEqual([]);
    });
  });
});
