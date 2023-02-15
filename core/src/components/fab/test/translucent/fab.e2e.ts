import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test('should not have visual regressions', async ({ page, skip }) => {
  skip.rtl();
  skip.mode('md', 'Translucency is only available on ios mode');
  await page.goto(`/src/components/fab/test/translucent`);

  const fab = page.locator('#fab5');
  await fab.click();
  await page.waitForChanges();

  /**
   * fab.screenshot doesn't work since ion-fab's bounding box only covers the
   * central button. This viewport size crops extra white space while also
   * containing all the buttons in the open fab.
   */
  await page.setViewportSize({
    width: 235,
    height: 310,
  });

  await expect(await page.screenshot({ animations: 'disabled' })).toHaveScreenshot(
    `fab-translucent-${page.getSnapshotSettings()}.png`
  );
});
