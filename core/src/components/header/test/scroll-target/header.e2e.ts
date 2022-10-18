import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('header: scroll-target', () => {
  test.beforeEach(async ({ page, skip }) => {
    skip.mode('md', 'This test is only for iOS');
    skip.rtl();
    await page.goto('/src/components/header/test/scroll-target');
  });

  test('should not have visual regressions', async ({ page }) => {
    const scrollContainer = page.locator('#scroll-target');
    await scrollContainer.evaluate((el) => (el.scrollTop = el.scrollHeight));

    await page.waitForChanges();

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`header-scroll-target-${page.getSnapshotSettings()}.png`);
  });

  test('large header should collapse', async ({ page }) => {
    const largeHeader = page.locator('ion-header[collapse="condense"]');
    const collapseHeader = page.locator('ion-header[collapse="fade"]');

    await expect(largeHeader).not.toHaveClass(/header-collapse-condense-inactive/);
    await expect(collapseHeader).toHaveClass(/header-collapse-condense-inactive/);

    const scrollContainer = page.locator('#scroll-target');
    await scrollContainer.evaluate((el) => (el.scrollTop = el.scrollHeight));

    await page.waitForChanges();

    await expect(largeHeader).toHaveClass(/header-collapse-condense-inactive/);
    await expect(collapseHeader).not.toHaveClass(/header-collapse-condense-inactive/);
  });
});
