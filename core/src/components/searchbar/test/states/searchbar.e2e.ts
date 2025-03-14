import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions.
 */
configs({ modes: ['md', 'ios', 'ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('searchbar: disabled'), () => {
    test('should render disabled searchbar', async ({ page }) => {
      await page.setContent(
        `
        <ion-searchbar disabled="true"></ion-searchbar>
      `,
        config
      );

      const searchbar = page.locator('ion-searchbar');

      await expect(searchbar).toHaveScreenshot(screenshot(`searchbar-state-disabled`));
    });
  });
});

/**
 * This behavior is only applicable to the `ionic-md` mode.
 * This behavior does not vary across directions.
 */
configs({ modes: ['ionic-md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('searchbar: disabled'), () => {
    test('should not show clear button', async ({ page }) => {
      await page.setContent(
        `
        <ion-searchbar disabled="true" value="Some text"></ion-searchbar>
      `,
        config
      );

      const clearButton = page.locator('.searchbar-clear-button');

      await expect(clearButton).toBeHidden();
    });
  });
});

/**
 * This behavior is only applicable to the `ionic-md` mode.
 * This behavior does not vary across directions.
 */
configs({ modes: ['ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('searchbar: focused'), () => {
    test('should render focus ring on the component', async ({ page, pageUtils }) => {
      await page.setContent(
        `
        <style>
          /* Add padding to the container to prevent the focus ring from being clipped */
          #container {
            padding: 5px;
          }
        </style>

        <div id="container">
          <ion-searchbar></ion-searchbar>
        </div>
      `,
        config
      );

      await pageUtils.pressKeys('Tab'); // Focused on the input

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot(`searchbar-state-focused`));
    });

    test('should render focus ring on the cancel button', async ({ page, pageUtils }) => {
      await page.setContent(
        `
        <ion-searchbar show-cancel-button="always"></ion-searchbar>
      `,
        config
      );

      await pageUtils.pressKeys('Tab'); // Focused on the input
      await pageUtils.pressKeys('Tab'); // Focused on the cancel button

      const searchbar = page.locator('ion-searchbar');

      await expect(searchbar).toHaveScreenshot(screenshot(`searchbar-state-focused-cancel-button`));
    });

    test('should render focus ring on the clear button', async ({ page, pageUtils }) => {
      await page.setContent(
        `
        <ion-searchbar show-clear-button="always" value="Filled text"></ion-searchbar>
      `,
        config
      );

      await pageUtils.pressKeys('Tab'); // Focused on the input
      await pageUtils.pressKeys('Tab'); // Focused on the clear button

      const searchbar = page.locator('ion-searchbar');

      await expect(searchbar).toHaveScreenshot(screenshot(`searchbar-state-focused-clear-button`));
    });
  });
});
