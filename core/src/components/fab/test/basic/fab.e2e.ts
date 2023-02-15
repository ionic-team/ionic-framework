import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('fab: basic (visual checks)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/src/components/fab/test/basic`);
  });

  test('should not have visual regressions', async ({ page }) => {
    await page.setIonViewport();

    await expect(page).toHaveScreenshot(`fab-basic-${page.getSnapshotSettings()}.png`);
  });

  test('should not have visual regressions when open', async ({ page }) => {
    // this fab has multiple buttons on each side, so it covers all the bases
    const fab = page.locator('#fab5');

    await fab.click();
    await page.waitForChanges();

    /**
     * fab.screenshot doesn't work since ion-fab's bounding box only covers the
     * central button. This viewport size crops extra white space while also
     * containing all the buttons in the open fab.
     */
    await page.setViewportSize({
      width: 320,
      height: 415,
    });

    await expect(await page.screenshot({ animations: 'disabled' })).toHaveScreenshot(
      `fab-open-${page.getSnapshotSettings()}.png`
    );
  });
});

test.describe('fab: basic (functionality checks)', () => {
  test.beforeEach(async ({ page, skip }) => {
    skip.rtl();
    skip.mode('ios');

    await page.goto(`/src/components/fab/test/basic`);
  });

  test('should toggle active state when clicked', async ({ page }) => {
    const fab = page.locator('#fab1');
    const fabList = fab.locator('ion-fab-list');

    await expect(fabList).not.toHaveClass(/fab-list-active/);

    // open fab
    await fab.click();
    await page.waitForChanges();
    await expect(fabList).toHaveClass(/fab-list-active/);

    // close fab
    await fab.click();
    await page.waitForChanges();
    await expect(fabList).not.toHaveClass(/fab-list-active/);
  });

  test('should not open when disabled', async ({ page }) => {
    const fab = page.locator('#fab2');
    const fabList = fab.locator('ion-fab-list');

    await expect(fabList).not.toHaveClass(/fab-list-active/);

    // attempt to open fab
    await fab.click();
    await page.waitForChanges();
    await expect(fabList).not.toHaveClass(/fab-list-active/);
  });
});
