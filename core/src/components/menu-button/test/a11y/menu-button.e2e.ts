import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe('menu-button: a11y', () => {
    test(title('should not have accessibility violations'), async ({ page }) => {
      await page.goto('/src/components/menu-button/test/a11y', config);

      const results = await new AxeBuilder({ page }).analyze();

      expect(results.violations).toEqual([]);
    });
  });
});
