import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe('footer: with tabs', () => {
    test(title('should not have extra padding when near a tab bar'), async ({ page }) => {
      await page.goto('/src/components/footer/test/with-tabs', config);

      const footer = page.locator('[tab="tab-one"] ion-footer');
      expect(await footer.screenshot()).toMatchSnapshot(`footer-with-tabs-${page.getSnapshotSettings()}.png`);
    });
  });
});
