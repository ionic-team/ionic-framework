import { expect } from '@playwright/test';
import { test, Viewports } from '@utils/test/playwright';

test.describe('split-pane: basic', () => {
  test('should render on the correct side', async ({ page }) => {
    await page.setViewportSize(Viewports.large);
    await page.goto(`/src/components/split-pane/test/basic`);

    await expect(await page.screenshot({ animations: 'disabled' })).toHaveScreenshot(
      `split-pane-${page.getSnapshotSettings()}.png`
    );
  });
  test('should collapse on smaller viewports', async ({ page, skip }) => {
    skip.rtl();
    await page.goto(`/src/components/split-pane/test/basic`);

    const menu = page.locator('ion-menu');
    await expect(menu).toBeHidden();
  });
  test('should expand on larger viewports', async ({ page, skip }) => {
    skip.rtl();
    await page.setViewportSize(Viewports.large);
    await page.goto(`/src/components/split-pane/test/basic`);

    const menu = page.locator('ion-menu');
    await expect(menu).toBeVisible();
  });
});
