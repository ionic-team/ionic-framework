import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Content does not have mode-specific styling
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('content: a11y'), () => {
    test('should have the main role', async ({ page }) => {
      await page.setContent(
        `
        <ion-content></ion-content>
      `,
        config
      );
      const content = page.locator('ion-content');

      await expect(content).toHaveAttribute('role', 'main');
    });

    test('should have no role in popover', async ({ page }) => {
      await page.setContent(
        `
        <ion-popover>
          <ion-content></ion-content>
        </ion-popover>
      `,
        config
      );

      const content = page.locator('ion-content');

      /**
       * Playwright can't do .not.toHaveAttribute() because a value is expected,
       * and toHaveAttribute can't accept a value of type null.
       */
      const role = await content.getAttribute('role');
      expect(role).toBeNull();
    });

    test('should allow for custom role', async ({ page }) => {
      await page.setContent(
        `
        <ion-content role="complementary"></ion-content>
      `,
        config
      );
      const content = page.locator('ion-content');

      await expect(content).toHaveAttribute('role', 'complementary');
    });

    test('should allow for custom role in popover', async ({ page }) => {
      await page.setContent(
        `
        <ion-popover>
          <ion-content role="complementary"></ion-content>
        </ion-popover>
      `,
        config
      );
      const content = page.locator('ion-content');

      await expect(content).toHaveAttribute('role', 'complementary');
    });
  });
});
