import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('select: custom', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto(`/src/components/select/test/custom`, config);

      expect(await page.screenshot()).toMatchSnapshot(`select-custom-diff-${page.getSnapshotSettings()}.png`);
    });
  });
});
