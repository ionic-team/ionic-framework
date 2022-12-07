import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('range: a11y', () => {
  test.beforeEach(async ({ skip }) => {
    skip.rtl();
    skip.mode('md');
  });

  test('should not have accessibility violations', async ({ page }) => {
    await page.goto(`/src/components/range/test/a11y`);

    /**
     * Axe does not take <slot> elements into account
     * when checking color-contrast. As a result, it will
     * incorrectly report color-contrast issues: https://github.com/dequelabs/axe-core/issues/3329
     */
    const results = await new AxeBuilder({ page }).disableRules('color-contrast').analyze();
    expect(results.violations).toEqual([]);
  });
});
