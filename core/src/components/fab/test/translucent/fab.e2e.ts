import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test(title('should not have visual regressions'), async ({ page }) => {
    await page.goto(`/src/components/fab/test/translucent`, config);

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

    expect(await page.screenshot({ animations: 'disabled' })).toMatchSnapshot(
      `fab-translucent-${page.getSnapshotSettings()}.png`
    );
  });
});
