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

    test('should allow for custom role', async ({ page }) => {
      /**
       * Note: This example should not be used in production.
       * This only serves to check that `role` can be customized.
       */
      await page.setContent(
        `
        <ion-header role="heading"></ion-header>
      `,
        config
      );
      const header = page.locator('ion-header');

      await expect(header).toHaveAttribute('role', 'heading');
    });
  });
});
