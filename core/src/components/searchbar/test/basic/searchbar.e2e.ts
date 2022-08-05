import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('searchbar: basic', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/src/components/searchbar/test/basic`);
  });

  test('should not have visual regressions', async ({ page }) => {
    await page.setIonViewport();
    expect(await page.screenshot()).toMatchSnapshot(`searchbar-diff-${page.getSnapshotSettings()}.png`);
  });

  test('should show cancel button on focus if show-cancel-button=focus', async ({ page }) => {
    const searchbar = page.locator('#basic');
    const cancelButton = searchbar.locator('.searchbar-cancel-button');

    await searchbar.evaluate((el: HTMLIonSearchbarElement) => el.setFocus());
    await page.waitForChanges();

    await expect(searchbar).toHaveClass(/searchbar-has-focus/);
    await expect(cancelButton).toBeVisible();
  });

  test('should not show cancel button on focus if show-cancel-button=never', async ({ page }) => {
    const searchbar = page.locator('#noCancel');
    const cancelButton = searchbar.locator('.searchbar-cancel-button');

    await searchbar.evaluate((el: HTMLIonSearchbarElement) => el.setFocus());
    await page.waitForChanges();

    await expect(searchbar).toHaveClass(/searchbar-has-focus/);
    await expect(cancelButton).toHaveCount(0);
  });
});
