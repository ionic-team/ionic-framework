import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('list: lines', () => {
  test('lines="full" should render correctly', async ({ page }) => {
    await page.goto(`/src/components/list/test/lines`);

    const list = page.locator('ion-list[lines="full"]');

    await expect(list).toHaveScreenshot(`list-lines-full-${page.getSnapshotSettings()}.png`);
  });
  test('lines="inset" should render correctly', async ({ page }) => {
    await page.goto(`/src/components/list/test/lines`);

    const list = page.locator('ion-list[lines="inset"]');

    await expect(list).toHaveScreenshot(`list-lines-inset-${page.getSnapshotSettings()}.png`);
  });
  test('lines="none" should render correctly', async ({ page }) => {
    await page.goto(`/src/components/list/test/lines`);

    const list = page.locator('ion-list[lines="none"]');

    await expect(list).toHaveScreenshot(`list-lines-none-${page.getSnapshotSettings()}.png`);
  });
});
