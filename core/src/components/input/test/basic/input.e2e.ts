import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('input: basic'), () => {
    test.describe('input with overflow', () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.setContent(
          `
          <ion-input aria-label="Long Input" value="reallylonglonglonginputtoseetheedgesreallylonglonglonginputtoseetheedges"></ion-input>
        `,
          config
        );
        const input = page.locator('ion-input');
        // Validates the display of an input where text extends off the edge of the component.
        await expect(input).toHaveScreenshot(screenshot(`input-with-text-overflow`));
      });
    });
    test.describe('input with placeholder', () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.setContent(
          `
          <ion-input aria-label="Input with Placeholder" placeholder="Placeholder"></ion-input>
        `,
          config
        );
        const input = page.locator('ion-input');
        // Validates the display of an input with a placeholder.
        await expect(input).toHaveScreenshot(screenshot(`input-with-placeholder`));
      });
    });
    test.describe('input with clear button', () => {
      test('should not have visual regressions with default label', async ({ page }) => {
        await page.setContent(
          `
          <ion-input
            label="Label"
            clear-input="true"
            value="Text"
          ></ion-input>
        `,
          config
        );
        const input = page.locator('ion-input');
        // Validates the display of an input with a clear button.
        await expect(input).toHaveScreenshot(screenshot(`input-with-clear-button`));
      });
      test('should not have visual regressions with stacked label', async ({ page }) => {
        await page.setContent(
          `
          <ion-input
            label="Label"
            label-placement="stacked"
            clear-input="true"
            value="Text"
          ></ion-input>
        `,
          config
        );
        const input = page.locator('ion-input');
        // Validates the display of an input with a clear button.
        await expect(input).toHaveScreenshot(screenshot(`input-with-clear-button-stacked`));
      });
    });
    test.describe('input click behaviors', () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.setContent(
          `
          <ion-input
            label="Label"
            clear-input="true"
            value="Text"
          ></ion-input>
        `,
          config
        );
        const input = page.locator('ion-input');
        input.dblclick();
        // Validates the display of an input with a clear button.
        await expect(input).toHaveScreenshot(screenshot(`input-dbclick`));
      });
      test('should not have visual regressions with stacked label', async ({ page, browserName }) => {
        if (browserName === 'firefox') {
          //TODO: Figure out why it's not working for firefox
          test.skip();
        }
        await page.setContent(
          `
          <ion-input
            label="Label"
            label-placement="stacked"
            clear-input="true"
            value="Text"
          ></ion-input>
        `,
          config
        );
        const input = page.locator('ion-input');
        input.dblclick();
        // Validates the display of an input with a clear button.
        await expect(input).toHaveScreenshot(screenshot(`input-dbclick-stacked`));
      });
    });
  });
});

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('input: clear button'), () => {
    test('should clear the input when pressed', async ({ page }) => {
      await page.setContent(
        `
        <ion-input label="my label" value="abc" clear-input="true"></ion-input>
      `,
        config
      );

      const input = page.locator('ion-input');
      const clearButton = input.locator('.input-clear-icon');

      await expect(input).toHaveJSProperty('value', 'abc');

      await clearButton.click();
      await page.waitForChanges();

      await expect(input).toHaveJSProperty('value', '');
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
        <ion-input label="my label" value="abc" clear-input="true"></ion-input>
      `,
        config
      );

      const input = page.locator('ion-input');
      const nativeInput = input.locator('input');
      const clearButton = input.locator('.input-clear-icon');

      await input.click();
      await expect(nativeInput).toBeFocused();

      await clearButton.click();
      await page.waitForChanges();

      await expect(nativeInput).toBeFocused();
    });

    test('should inherit color when used in item with color property', async ({ page }) => {
      await page.setContent(
        `
        <ion-item color="primary">
          <ion-input aria-label="my label" value="Text" clear-input="true"></ion-input>
        </ion-item>
      `,
        config
      );

      const item = page.locator('ion-item');
      await expect(item).toHaveScreenshot(screenshot(`input-with-clear-button-item-color`));
    });
  });
});

configs({ modes: ['ionic-md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('input: clear button in ionic theme, visual checks'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `
          <ion-input
            label="Label"
            label-placement="stacked"
            clear-input="true"
            value="Text"
          ></ion-input>
        `,
        config
      );

      const input = page.locator('ion-input');
      await input.evaluate((el: HTMLIonInputElement) => el.setFocus());
      await page.waitForChanges();

      await expect(input).toHaveScreenshot(screenshot(`input-with-clear-button`));
    });

    test('should not have visual regressions when clear button is focused', async ({ page, pageUtils }) => {
      // extra padding around input ensures focus ring doesn't get cut off at screenshot edges
      await page.setContent(
        `
          <style>
            #container {
              padding: 10px;
            }
          </style>

          <div id="container">
            <ion-input
              label="Label"
              label-placement="stacked"
              clear-input="true"
              value="Text"
            ></ion-input>
          </div>
        `,
        config
      );

      const input = page.locator('ion-input');
      await input.evaluate((el: HTMLIonInputElement) => el.setFocus());
      await page.waitForChanges();

      await pageUtils.pressKeys('Tab');

      const container = page.locator('#container');
      await expect(container).toHaveScreenshot(screenshot(`input-clear-button-focused`));
    });

    test('should not have visual regressions when user dbclicks', async ({ page, browserName }) => {
      if (browserName === 'firefox' || browserName === 'webkit') {
        //TODO: Figure out why it's not working for webkit & firefox
        test.skip();
      }
      await page.setContent(
        `
          <ion-input
            label="Label"
            label-placement="stacked"
            clear-input="true"
            value="Text"
          ></ion-input>
      `,
        config
      );
      const input = page.locator('ion-input');
      await input.dblclick();
      await page.waitForChanges();
      await expect(input).toHaveScreenshot(screenshot(`input-dbclick`));
    });
  });
});

configs({ modes: ['ionic-md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('input: clear button in ionic theme, functionality checks'), () => {
    test('should show clear button when any part of input is focused', async ({ page, pageUtils }) => {
      await page.setContent(
        `
          <ion-input
            label="Label"
            label-placement="stacked"
            clear-input="true"
            value="Text"
          ></ion-input>
        `,
        config
      );

      const input = page.locator('ion-input');
      const clearButton = input.locator('.input-clear-icon');

      await expect(clearButton).not.toBeVisible();

      await input.evaluate((el: HTMLIonInputElement) => el.setFocus());
      await expect(clearButton).toBeVisible();

      // ensure blurring native input doesn't immediately hide clear button
      await pageUtils.pressKeys('Tab');
      await expect(clearButton).toBeFocused();
      await expect(clearButton).toBeVisible();
    });
  });
});
