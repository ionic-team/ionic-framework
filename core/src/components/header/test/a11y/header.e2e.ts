import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('header: a11y'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      await page.goto(`/src/components/header/test/a11y`, config);

      const headers = page.locator('ion-header');
      await expect(headers.first()).toHaveAttribute('role', 'banner');
      await expect(headers.last()).toHaveAttribute('role', 'none');

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });

    test('should have the banner role', async ({ page }) => {
      await page.setContent(
        `
        <ion-header></ion-header>
      `,
        config
      );
      const header = page.locator('ion-header');

      await expect(header).toHaveAttribute('role', 'banner');
    });

    test('should have no role in menu', async ({ page }) => {
      await page.setContent(
        `
        <ion-menu>
          <ion-header></ion-header>
        </ion-menu>
      `,
        config
      );
      const header = page.locator('ion-header');

      await expect(header).toHaveAttribute('role', 'none');
    });

    test('should allow for custom role', async ({ page }) => {
      await page.setContent(
        `
        <ion-header role="complementary"></ion-header>
      `,
        config
      );
      const header = page.locator('ion-header');

      await expect(header).toHaveAttribute('role', 'complementary');
    });

    test('should allow for custom role in menu', async ({ page }) => {
      await page.setContent(
        `
        <ion-menu>
          <ion-header role="complementary"></ion-header>
        </ion-menu>
      `,
        config
      );
      const header = page.locator('ion-header');

      await expect(header).toHaveAttribute('role', 'complementary');
    });
  });
});
