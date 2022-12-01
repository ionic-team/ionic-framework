import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

test.describe('accordion: standalone', () => {
  configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
    test(title('should not have accessibility violations'), async ({ page }) => {
      await page.goto(`/src/components/accordion/test/standalone`, config);

      const results = await new AxeBuilder({ page }).analyze();

      expect(results.violations).toEqual([]);
    });
  });
});
