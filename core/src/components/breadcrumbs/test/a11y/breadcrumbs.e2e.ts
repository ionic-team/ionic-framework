import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ config, title }) => {
  test.describe(title('breadcrumbs: axe'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      await page.goto(`/src/components/breadcrumbs/test/a11y`, config);

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  });
});
