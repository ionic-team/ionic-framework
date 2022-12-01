import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe('button: expand', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto(`/src/components/button/test/expand`, config);

      await page.setIonViewport();

      expect(await page.screenshot()).toMatchSnapshot(`button-expand-${page.getSnapshotSettings()}.png`);
    });
  });
});
