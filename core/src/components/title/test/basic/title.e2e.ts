import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('title: basic', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto('/src/components/title/test/basic', config);
      const wrapper = page.locator('#header-wrapper');

      // only screenshot the headers to avoid unnecessary blank space from ion-content
      expect(await wrapper.screenshot()).toMatchSnapshot(`title-basic-${page.getSnapshotSettings()}.png`);
    });
  });
});
