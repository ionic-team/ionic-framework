import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('searchbar: cancel button', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/src/components/searchbar/test/basic`);
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

test.describe('searchbar: rendering', () => {
  test('should render searchbar', async ({ page }) => {
    await page.setContent(`
      <ion-searchbar></ion-searchbar>
    `);

    const searchbar = page.locator('ion-searchbar');

    await expect(searchbar).toHaveScreenshot(`searchbar-${page.getSnapshotSettings()}.png`);
  });

  test('should render cancel and clear buttons', async ({ page }) => {
    await page.setContent(`
      <ion-searchbar show-cancel-button="always" show-clear-button="always"></ion-searchbar>
    `);

    const searchbar = page.locator('ion-searchbar');

    await expect(searchbar).toHaveScreenshot(`searchbar-buttons-${page.getSnapshotSettings()}.png`);
  });

  test('should render searchbar with color', async ({ page, skip }) => {
    skip.rtl();

    await page.setContent(`
      <ion-searchbar color="danger" show-cancel-button="always" show-clear-button="always"></ion-searchbar>
    `);

    const searchbar = page.locator('ion-searchbar');

    await expect(searchbar).toHaveScreenshot(`searchbar-color-${page.getSnapshotSettings()}.png`);
  });

  test('should render disabled searchbar', async ({ page, skip }) => {
    skip.rtl();

    await page.setContent(`
      <ion-searchbar disabled="true"></ion-searchbar>
    `);

    const searchbar = page.locator('ion-searchbar');

    await expect(searchbar).toHaveScreenshot(`searchbar-disabled-${page.getSnapshotSettings()}.png`);
  });

  test('should render custom search icon', async ({ page, skip }) => {
    skip.rtl();

    await page.setContent(`
      <ion-searchbar search-icon="home"></ion-searchbar>
    `);

    const icon = page.locator('ion-searchbar ion-icon.searchbar-search-icon');

    await expect(icon).toHaveScreenshot(`searchbar-search-icon-${page.getSnapshotSettings()}.png`);
  });
});

test.describe('searchbar: placeholder', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
    skip.mode('ios');
  });
  test('should set placeholder', async ({ page }) => {
    await page.setContent(`
      <ion-searchbar placeholder="My Placeholder"></ion-searchbar>
    `);

    const nativeInput = page.locator('ion-searchbar input');
    await expect(nativeInput).toHaveAttribute('placeholder', 'My Placeholder');
  });
});
