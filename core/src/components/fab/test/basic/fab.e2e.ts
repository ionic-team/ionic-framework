import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('fab: basic', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/fab/test/basic`);

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`fab-basic-${page.getSnapshotSettings()}.png`);
  });

  test('should not have visual regressions when open', async ({ page }) => {
    await page.goto(`/src/components/fab/test/basic`);
    const fab = page.locator('#fab5');

    await fab.click();
    await page.waitForChanges();

    // this fab has multiple buttons on each side, so it covers all the bases
    expect(await fab.screenshot()).toMatchSnapshot(`fab-open-${page.getSnapshotSettings()}.png`);
  });

  test('should toggle active state when clicked', async ({ page, skip }) => {
    skip.rtl();
    skip.mode('ios');

    await page.goto(`/src/components/fab/test/basic`);
    const fab = page.locator('#fab1');
    const fabList = fab.locator('ion-fab-list');

    expect(fabList).not.toHaveClass(/fab-list-active/);

    // open fab
    await fab.click();
    await page.waitForChanges();
    expect(fabList).toHaveClass(/fab-list-active/);

    // close fab
    await fab.click();
    await page.waitForChanges();
    expect(fabList).not.toHaveClass(/fab-list-active/);
  });

  test('should not open when disabled', async ({ page, skip }) => {
    skip.rtl();
    skip.mode('ios');

    await page.goto(`/src/components/fab/test/basic`);
    const fab = page.locator('#fab2');
    const fabList = fab.locator('ion-fab-list');

    expect(fabList).not.toHaveClass(/fab-list-active/);

    // attempt to open fab
    await fab.click();
    await page.waitForChanges();
    expect(fabList).not.toHaveClass(/fab-list-active/);
  });
});
