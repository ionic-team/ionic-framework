import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('select: spec', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto(`/src/components/select/test/spec`, config);

      await page.setIonViewport();

      expect(await page.screenshot({ animations: 'disabled' })).toMatchSnapshot(
        `select-spec-diff-${page.getSnapshotSettings()}.png`
      );
    });
  });
});
