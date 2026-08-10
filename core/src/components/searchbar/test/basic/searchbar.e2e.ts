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

    test('should clear the value when the searchbar blurs between pointerdown and click', async ({ page }) => {
      await page.setContent(`<ion-searchbar value="abc" show-clear-button="focus"></ion-searchbar>`, config);

      const searchbar = page.locator('ion-searchbar');
      const nativeInput = searchbar.locator('input');
      const clearButton = searchbar.locator('.searchbar-clear-button');

      await searchbar.evaluate((el: HTMLIonSearchbarElement) => el.setFocus());
      await expect(clearButton).toBeVisible();

      const box = (await clearButton.boundingBox())!;
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();

      // Some browsers blur anyway, despite the `preventDefault` on `pointerdown`.
      await nativeInput.evaluate((el: HTMLInputElement) => el.blur());
      await page.waitForChanges();

      await page.mouse.up();
      await page.waitForChanges();

      await expect(searchbar).toHaveJSProperty('value', '');
    });

    test('should hide the clear button when the press is abandoned', async ({ page }) => {
      await page.setContent(`<ion-searchbar value="abc" show-clear-button="focus"></ion-searchbar>`, config);

      const searchbar = page.locator('ion-searchbar');
      const nativeInput = searchbar.locator('input');
      const clearButton = searchbar.locator('.searchbar-clear-button');

      await searchbar.evaluate((el: HTMLIonSearchbarElement) => el.setFocus());
      await expect(clearButton).toBeVisible();

      const box = (await clearButton.boundingBox())!;
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await nativeInput.evaluate((el: HTMLInputElement) => el.blur());
      await page.waitForChanges();

      // Releasing off the button sends the click to an ancestor, not the button.
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 + 200);
      await page.mouse.up();
      // A regression would clear via onClearInput's 64ms timer; outlast it.
      await page.waitForTimeout(100);

      await expect(searchbar).toHaveJSProperty('value', 'abc');
      await expect(clearButton).not.toBeVisible();
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

configs({ modes: ['md', 'ios', 'ionic-md'] }).forEach(({ title, screenshot, config }) => {
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

configs({ modes: ['ios', 'ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('searchbar: clear button text cut off'), () => {
    test('text should not be cut off when clear button is hidden', async ({ page }) => {
      await page.setContent(
        `
        <ion-searchbar show-clear-button="focus" value="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non metus vel velit sollicitudin suscipit quis sed lectus. "></ion-searchbar>
      `,
        config
      );

      const searchbar = page.locator('ion-searchbar');
      await expect(searchbar).toHaveScreenshot(screenshot(`searchbar-text-clear-hidden`));
    });

    test('text should be cut off when clear button is visible', async ({ page }) => {
      await page.setContent(
        `
        <ion-searchbar show-clear-button="always" value="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non metus vel velit sollicitudin suscipit quis sed lectus. "></ion-searchbar>
      `,
        config
      );

      const searchbar = page.locator('ion-searchbar');
      await expect(searchbar).toHaveScreenshot(screenshot(`searchbar-text-clear-visible`));
    });
  });
});

configs({ modes: ['md', 'ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('searchbar: cancel button alignment'), () => {
    test('should align with the back button when used in a toolbar', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/28468',
      });
      await page.setContent(
        `
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="#"></ion-back-button>
            </ion-buttons>
            <ion-title>Test</ion-title>
          </ion-toolbar>
          <ion-toolbar>
            <ion-searchbar show-cancel-button="always"></ion-searchbar>
          </ion-toolbar>
        </ion-header>
      `,
        config
      );

      const header = page.locator('ion-header');
      await expect(header).toHaveScreenshot(screenshot(`searchbar-back-button-align`));
    });
  });
});
