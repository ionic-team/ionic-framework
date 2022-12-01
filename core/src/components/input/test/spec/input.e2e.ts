import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('input: spec', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/input/test/spec', config);
    });

    test(title('should not have visual regressions'), async ({ page }) => {
      await page.setIonViewport();

      expect(await page.screenshot()).toMatchSnapshot(`input-spec-diff-${page.getSnapshotSettings()}.png`);
    });
  });
});
