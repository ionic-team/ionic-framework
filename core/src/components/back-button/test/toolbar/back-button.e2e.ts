import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('back-button: toolbar', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto(`/src/components/back-button/test/toolbar`, config);

      await page.setIonViewport();

      expect(await page.screenshot()).toMatchSnapshot(`back-button-toolbar-${page.getSnapshotSettings()}.png`);
    });
  });
});
