import { expect } from '@playwright/test';
import { test, Viewports, configs } from '@utils/test/playwright';

test.describe('split-pane: basic', () => {
  configs().forEach(({ title, config }) => {
    test(title('should render on the correct side'), async ({ page }) => {
      await page.setViewportSize(Viewports.large);
      await page.goto(`/src/components/split-pane/test/basic`, config);

      expect(await page.screenshot({ animations: 'disabled' })).toMatchSnapshot(
        `split-pane-${page.getSnapshotSettings()}.png`
      );
    });
  });
  configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
    test(title('should collapse on smaller viewports'), async ({ page }) => {
      await page.goto(`/src/components/split-pane/test/basic`, config);

      const menu = page.locator('ion-menu');
      await expect(menu).toBeHidden();
    });
    test(title('should expand on larger viewports'), async ({ page }) => {
      await page.setViewportSize(Viewports.large);
      await page.goto(`/src/components/split-pane/test/basic`, config);

      const menu = page.locator('ion-menu');
      await expect(menu).toBeVisible();
    });
  });
});
