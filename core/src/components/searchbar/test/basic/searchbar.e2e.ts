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

    await searchbar.evaluate((el: HTMLIonSearchbarElement) => el.setFocus());
    await page.waitForChanges();

    expect(searchbar).toHaveClass(/searchbar-has-focus/);
    expect(await searchbar.screenshot()).toMatchSnapshot(
      `searchbar-show-cancel-focus-${page.getSnapshotSettings()}.png`
    );
  });

  test('should not show cancel button on focus if show-cancel-button=never', async ({ page }) => {
    const searchbar = page.locator('#noCancel');

    await searchbar.evaluate((el: HTMLIonSearchbarElement) => el.setFocus());
    await page.waitForChanges();

    expect(searchbar).toHaveClass(/searchbar-has-focus/);
    expect(await searchbar.screenshot()).toMatchSnapshot(
      `searchbar-show-cancel-never-${page.getSnapshotSettings()}.png`
    );
  });
});
