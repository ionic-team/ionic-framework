import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('item: axe', () => {
  test('should not have accessibility violations', async ({ page }) => {
    await page.goto(`/src/components/item/test/a11y`);

    const results = await new AxeBuilder({ page })
      // TODO(FW-404): Re-enable rule once select is updated to avoid nested-interactive
      .disableRules('nested-interactive')
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
