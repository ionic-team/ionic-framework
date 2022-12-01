import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe('button: round', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto(`/src/components/button/test/round`, config);

      await page.setIonViewport();

      expect(await page.screenshot()).toMatchSnapshot(`button-round-${page.getSnapshotSettings()}.png`);
    });
  });
});
