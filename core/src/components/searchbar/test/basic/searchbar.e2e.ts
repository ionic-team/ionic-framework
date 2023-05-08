import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('searchbar: cancel button'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/searchbar/test/basic`, config);
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

  test.describe(title('searchbar: clear button'), () => {
    test('should clear the input when pressed', async ({ page }) => {
      await page.setContent(
        `
        <ion-searchbar value="abc" show-clear-button="always"></ion-searchbar>
      `,
        config
      );

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
      await page.setContent(
        `
        <ion-searchbar value="abc"></ion-searchbar>
      `,
        config
      );

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

  test.describe(title('searchbar: placeholder'), () => {
    test('should set placeholder', async ({ page }) => {
      await page.setContent(
        `
        <ion-searchbar placeholder="My Placeholder"></ion-searchbar>
      `,
        config
      );

      const nativeInput = page.locator('ion-searchbar input');
      await expect(nativeInput).toHaveAttribute('placeholder', 'My Placeholder');
    });
  });
});

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('searchbar: rendering'), () => {
    test('should render searchbar', async ({ page }) => {
      await page.setContent(
        `
        <ion-searchbar></ion-searchbar>
      `,
        config
      );

      const searchbar = page.locator('ion-searchbar');

      await expect(searchbar).toHaveScreenshot(screenshot(`searchbar`));
    });

    test('should render cancel and clear buttons', async ({ page }) => {
      await page.setContent(
        `
        <ion-searchbar show-cancel-button="always" show-clear-button="always"></ion-searchbar>
      `,
        config
      );

      const searchbar = page.locator('ion-searchbar');

      await expect(searchbar).toHaveScreenshot(screenshot(`searchbar-buttons`));
    });
  });
});

/**
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('searchbar: feature rendering'), () => {
    test('should render searchbar with color', async ({ page }) => {
      await page.setContent(
        `
        <ion-searchbar color="danger" show-cancel-button="always" show-clear-button="always"></ion-searchbar>
      `,
        config
      );

      const searchbar = page.locator('ion-searchbar');

      await expect(searchbar).toHaveScreenshot(screenshot(`searchbar-color`));
    });

    test('should render disabled searchbar', async ({ page }) => {
      await page.setContent(
        `
        <ion-searchbar disabled="true"></ion-searchbar>
      `,
        config
      );

      const searchbar = page.locator('ion-searchbar');

      await expect(searchbar).toHaveScreenshot(screenshot(`searchbar-disabled`));
    });

    test('should render custom search icon', async ({ page }) => {
      await page.setContent(
        `
        <ion-searchbar search-icon="home"></ion-searchbar>
      `,
        config
      );

      const icon = page.locator('ion-searchbar ion-icon.searchbar-search-icon');

      await expect(icon).toHaveScreenshot(screenshot(`searchbar-search-icon`));
    });
  });
});
