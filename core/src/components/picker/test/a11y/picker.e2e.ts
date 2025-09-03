import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe(title('picker: a11y'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      await page.goto(`/src/components/picker/test/a11y`, config);

      const results = await new AxeBuilder({ page }).disableRules('color-contrast').analyze();

      const hasKnownViolations = results.violations.filter((violation) => violation.id === 'color-contrast');
      const violations = results.violations.filter((violation) => !hasKnownViolations.includes(violation));

      if (hasKnownViolations.length > 0) {
        console.warn('A11Y: Known violation - contrast color.', hasKnownViolations);
      }

      expect(violations).toEqual([]);
    });
  });
});
