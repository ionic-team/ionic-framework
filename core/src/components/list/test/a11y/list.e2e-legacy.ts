import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('list: a11y', () => {
  test('should not have accessibility violations', async ({ page }) => {
    await page.goto(`/src/components/list/test/a11y`);

    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations).toEqual([]);
  });
});
