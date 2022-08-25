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

test.describe('searchbar: clear button', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
  });
  test('should clear the input when pressed', async ({ page }) => {
    await page.setContent(`
      <ion-searchbar value="abc" show-clear-button="always"></ion-searchbar>
    `);

    const searchbar = page.locator('ion-searchbar');
    const clearButton = searchbar.locator('.searchbar-clear-button');

    await expect(searchbar).toHaveJSProperty('value', 'abc');

    await clearButton.click();
    await page.waitForChanges();

    await expect(searchbar).toHaveJSProperty('value', '');
  });
  /**
   * Note: This only tests the desktop focus behavior.
   * Mobile browsers have different restrictions around
   * focusing inputs, so these platforms should always
   * be tested when making changes to the focus behavior.
   */
  test('should keep the input focused when the clear button is pressed', async ({ page }) => {
    await page.setContent(`
      <ion-searchbar value="abc"></ion-searchbar>
    `);

    const searchbar = page.locator('ion-searchbar');
    const nativeInput = searchbar.locator('input');
    const clearButton = searchbar.locator('.searchbar-clear-button');

    await searchbar.click();
    await expect(nativeInput).toBeFocused();

    await clearButton.click();
    await page.waitForChanges();

    await expect(nativeInput).toBeFocused();
  });
});
