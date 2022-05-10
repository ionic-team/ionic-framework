import { expect } from '@playwright/test';
import { test, Viewports } from '@utils/test/playwright';

test.describe('breadcrumbs: standalone', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/breadcrumbs/test/standalone`);

    // avoid contents getting cut off
    await page.setViewportSize(Viewports.tablet.portrait);

    expect(await page.screenshot()).toMatchSnapshot(`breadcrumb-standalone-diff-${page.getSnapshotSettings()}.png`);
  });
});
