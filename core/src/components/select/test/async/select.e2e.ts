import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe('select: async', () => {
    test(title('should correctly set the value after a delay'), async ({ page }) => {
      await page.goto(`/src/components/select/test/async`, config);
      const selectValueSet = await page.spyOnEvent('selectValueSet');

      const select = await page.locator('#default');

      await selectValueSet.next();

      await expect(select).toHaveJSProperty('value', 'bird');
    });
  });
});
