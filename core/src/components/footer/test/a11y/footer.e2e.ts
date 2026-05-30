import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Footer does not have mode-specific styling
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('footer: a11y'), () => {
    test('should have the contentinfo role', async ({ page }) => {
      await page.setContent(
        `
        <ion-footer></ion-footer>
      `,
        config
      );
      const footer = page.locator('ion-footer');

      await expect(footer).toHaveAttribute('role', 'contentinfo');
    });

    test('should allow for custom role', async ({ page }) => {
      await page.setContent(
        `
        <ion-footer role="complementary"></ion-footer>
      `,
        config
      );
      const footer = page.locator('ion-footer');

      await expect(footer).toHaveAttribute('role', 'complementary');
    });
  });
});
