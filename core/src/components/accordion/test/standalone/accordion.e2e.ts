import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

test.describe('accordion: standalone', () => {
  configs().forEach(({ config, title }) => {
    test(title('should not have accessibility violations'), async ({ page }) => {
      await page.goto(`/src/components/accordion/test/standalone`, config);

      const results = await new AxeBuilder({ page }).analyze();

      expect(results.violations).toEqual([]);
    });
  });
});
