import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('breadcrumbs: axe', () => {
  test('should not have accessibility violations', async ({ page }) => {
    await page.goto(`/src/components/breadcrumbs/test/a11y`);

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
