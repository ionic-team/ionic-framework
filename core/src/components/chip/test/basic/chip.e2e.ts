import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('chip: rendering', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto('/src/components/chip/test/basic', config);

      await page.setIonViewport();

      expect(await page.screenshot()).toMatchSnapshot(`chip-basic-${page.getSnapshotSettings()}.png`);
    });
  });
});
