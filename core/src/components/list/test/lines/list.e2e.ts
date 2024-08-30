import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios', 'md', 'ionic-md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('list: lines'), () => {
    test.describe('default', () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.setContent(
          `
          <ion-list>
            <ion-list-header>
              <ion-label>Lines: default</ion-label>
            </ion-list-header>
            <ion-item>
              <ion-label>Item</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Item</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Item</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Item</ion-label>
            </ion-item>
          </ion-list>
        `,
          config
        );

        const list = page.locator('ion-list');

        await expect(list).toHaveScreenshot(screenshot(`list-lines-default`));
      });

      test('should not have visual regressions with item lines set', async ({ page }) => {
        await page.setContent(
          `
          <ion-list>
            <ion-list-header>
              <ion-label>Lines: default</ion-label>
            </ion-list-header>
            <ion-item>
              <ion-label>Item</ion-label>
            </ion-item>
            <ion-item lines="inset">
              <ion-label>Item Inset</ion-label>
            </ion-item>
            <ion-item lines="full">
              <ion-label>Item Full</ion-label>
            </ion-item>
            <ion-item lines="none">
              <ion-label>Item None</ion-label>
            </ion-item>
          </ion-list>
        `,
          config
        );

        const list = page.locator('ion-list');

        await expect(list).toHaveScreenshot(screenshot(`list-lines-default-item-lines`));
      });

      test('should not have visual regressions with item lines and color set', async ({ page }) => {
        await page.setContent(
          `
          <ion-list>
            <ion-list-header>
              <ion-label>Lines: default</ion-label>
            </ion-list-header>
            <ion-item color="danger">
              <ion-label>Item</ion-label>
            </ion-item>
            <ion-item color="danger" lines="inset">
              <ion-label>Item Inset</ion-label>
            </ion-item>
            <ion-item color="danger" lines="full">
              <ion-label>Item Full</ion-label>
            </ion-item>
            <ion-item color="danger" lines="none">
              <ion-label>Item None</ion-label>
            </ion-item>
          </ion-list>
        `,
          config
        );

        const list = page.locator('ion-list');

        await expect(list).toHaveScreenshot(screenshot(`list-lines-default-item-lines-colors`));
      });
    });

    test.describe('inset', () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.setContent(
          `
          <ion-list lines="inset">
            <ion-list-header>
              <ion-label>Lines: inset</ion-label>
            </ion-list-header>
            <ion-item>
              <ion-label>Item</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Item</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Item</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Item</ion-label>
            </ion-item>
          </ion-list>
        `,
          config
        );

        const list = page.locator('ion-list');

        await expect(list).toHaveScreenshot(screenshot(`list-lines-inset`));
      });

      test('should not have visual regressions with item lines set', async ({ page }) => {
        await page.setContent(
          `
          <ion-list lines="inset">
            <ion-list-header>
              <ion-label>Lines: inset</ion-label>
            </ion-list-header>
            <ion-item>
              <ion-label>Item</ion-label>
            </ion-item>
            <ion-item lines="inset">
              <ion-label>Item Inset</ion-label>
            </ion-item>
            <ion-item lines="full">
              <ion-label>Item Full</ion-label>
            </ion-item>
            <ion-item lines="none">
              <ion-label>Item None</ion-label>
            </ion-item>
          </ion-list>
        `,
          config
        );

        const list = page.locator('ion-list');

        await expect(list).toHaveScreenshot(screenshot(`list-lines-inset-item-lines`));
      });

      test('should not have visual regressions with item lines and color set', async ({ page }) => {
        await page.setContent(
          `
          <ion-list lines="inset">
            <ion-list-header>
              <ion-label>Lines: inset</ion-label>
            </ion-list-header>
            <ion-item color="danger">
              <ion-label>Item</ion-label>
            </ion-item>
            <ion-item color="danger" lines="inset">
              <ion-label>Item Inset</ion-label>
            </ion-item>
            <ion-item color="danger" lines="full">
              <ion-label>Item Full</ion-label>
            </ion-item>
            <ion-item color="danger" lines="none">
              <ion-label>Item None</ion-label>
            </ion-item>
          </ion-list>
        `,
          config
        );

        const list = page.locator('ion-list');

        await expect(list).toHaveScreenshot(screenshot(`list-lines-inset-item-lines-colors`));
      });
    });

    test.describe('full', () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.setContent(
          `
          <ion-list lines="full">
            <ion-list-header>
              <ion-label>Lines: full</ion-label>
            </ion-list-header>
            <ion-item>
              <ion-label>Item</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Item</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Item</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Item</ion-label>
            </ion-item>
          </ion-list>
        `,
          config
        );

        const list = page.locator('ion-list');

        await expect(list).toHaveScreenshot(screenshot(`list-lines-full`));
      });

      test('should not have visual regressions with item lines set', async ({ page }) => {
        await page.setContent(
          `
          <ion-list lines="full">
            <ion-list-header>
              <ion-label>Lines: full</ion-label>
            </ion-list-header>
            <ion-item>
              <ion-label>Item</ion-label>
            </ion-item>
            <ion-item lines="inset">
              <ion-label>Item Inset</ion-label>
            </ion-item>
            <ion-item lines="full">
              <ion-label>Item Full</ion-label>
            </ion-item>
            <ion-item lines="none">
              <ion-label>Item None</ion-label>
            </ion-item>
          </ion-list>
        `,
          config
        );

        const list = page.locator('ion-list');

        await expect(list).toHaveScreenshot(screenshot(`list-lines-full-item-lines`));
      });

      test('should not have visual regressions with item lines and color set', async ({ page }) => {
        await page.setContent(
          `
          <ion-list lines="full">
            <ion-list-header>
              <ion-label>Lines: full</ion-label>
            </ion-list-header>
            <ion-item color="danger">
              <ion-label>Item</ion-label>
            </ion-item>
            <ion-item color="danger" lines="inset">
              <ion-label>Item Inset</ion-label>
            </ion-item>
            <ion-item color="danger" lines="full">
              <ion-label>Item Full</ion-label>
            </ion-item>
            <ion-item color="danger" lines="none">
              <ion-label>Item None</ion-label>
            </ion-item>
          </ion-list>
        `,
          config
        );

        const list = page.locator('ion-list');

        await expect(list).toHaveScreenshot(screenshot(`list-lines-full-item-lines-colors`));
      });
    });

    test.describe('none', () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.setContent(
          `
          <ion-list lines="none">
            <ion-list-header>
              <ion-label>Lines: none</ion-label>
            </ion-list-header>
            <ion-item>
              <ion-label>Item</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Item</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Item</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Item</ion-label>
            </ion-item>
          </ion-list>
        `,
          config
        );

        const list = page.locator('ion-list');

        await expect(list).toHaveScreenshot(screenshot(`list-lines-none`));
      });

      test('should not have visual regressions with item lines set', async ({ page }) => {
        await page.setContent(
          `
          <ion-list lines="none">
            <ion-list-header>
              <ion-label>Lines: none</ion-label>
            </ion-list-header>
            <ion-item>
              <ion-label>Item</ion-label>
            </ion-item>
            <ion-item lines="inset">
              <ion-label>Item Inset</ion-label>
            </ion-item>
            <ion-item lines="full">
              <ion-label>Item Full</ion-label>
            </ion-item>
            <ion-item lines="none">
              <ion-label>Item None</ion-label>
            </ion-item>
          </ion-list>
        `,
          config
        );

        const list = page.locator('ion-list');

        await expect(list).toHaveScreenshot(screenshot(`list-lines-none-item-lines`));
      });

      test('should not have visual regressions with item lines and color set', async ({ page }) => {
        await page.setContent(
          `
          <ion-list lines="none">
            <ion-list-header>
              <ion-label>Lines: none</ion-label>
            </ion-list-header>
            <ion-item color="danger">
              <ion-label>Item</ion-label>
            </ion-item>
            <ion-item color="danger" lines="inset">
              <ion-label>Item Inset</ion-label>
            </ion-item>
            <ion-item color="danger" lines="full">
              <ion-label>Item Full</ion-label>
            </ion-item>
            <ion-item color="danger" lines="none">
              <ion-label>Item None</ion-label>
            </ion-item>
          </ion-list>
        `,
          config
        );

        const list = page.locator('ion-list');

        await expect(list).toHaveScreenshot(screenshot(`list-lines-none-item-lines-colors`));
      });
    });
  });
});

/**
 * Padding and border color ensures the bottom border can be easily seen if it regresses.
 * The background color ensures that any border radius values can be seen.
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('list: lines with children'), () => {
    test('only item in inset list should not have line', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/28435',
      });
      await page.setContent(
        `
        <style>
          #container {
            padding: 10px;
            background: #0088cc;
          }

          ion-item {
            --border-color: red;
          }
        </style>
        <div id="container">
          <ion-list inset="true">
            <ion-item>
              <ion-label>Item 0</ion-label>
            </ion-item>
          </ion-list>
        </div>
      `,
        config
      );

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot('inset-list-only-item-no-lines'));
    });
    test('last item in inset list with end options should not have line', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/28435',
      });
      await page.setContent(
        `
        <style>
          #container {
            padding: 10px;
            background: #0088cc;
          }

          ion-item {
            --border-color: red;
          }
        </style>
        <div id="container">
          <ion-list inset="true">
            <ion-item-sliding>
              <ion-item>
                <ion-label>Item 0</ion-label>
              </ion-item>
              <ion-item-options slot="end">
                <ion-item-option color="warning">
                  <ion-icon slot="icon-only" name="pin"></ion-icon>
                </ion-item-option>
              </ion-item-options>
            </ion-item-sliding>

            <ion-item-sliding>
              <ion-item>
                <ion-label>Item 1</ion-label>
              </ion-item>
              <ion-item-options slot="end">
                <ion-item-option color="warning">
                  <ion-icon slot="icon-only" name="pin"></ion-icon>
                </ion-item-option>
              </ion-item-options>
            </ion-item-sliding>

            <ion-item-sliding>
              <ion-item>
                <ion-label>Item 2</ion-label>
              </ion-item>
              <ion-item-options slot="end">
                <ion-item-option color="warning">
                  <ion-icon slot="icon-only" name="pin"></ion-icon>
                </ion-item-option>
              </ion-item-options>
            </ion-item-sliding>
          </ion-list>
        </div>
      `,
        config
      );

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot('inset-list-end-options-no-lines'));
    });
    test('last item in inset list with start options should not have line', async ({ page }) => {
      await page.setContent(
        `
        <style>
          #container {
            padding: 10px;
            background: #0088cc;
          }

          ion-item {
            --border-color: red;
          }
        </style>
        <div id="container">
          <ion-list inset="true">
            <ion-item-sliding>
              <ion-item-options slot="start">
                <ion-item-option color="warning">
                  <ion-icon slot="icon-only" name="pin"></ion-icon>
                </ion-item-option>
              </ion-item-options>
              <ion-item>
                <ion-label>Item 0</ion-label>
              </ion-item>
            </ion-item-sliding>

            <ion-item-sliding>
              <ion-item-options slot="start">
                <ion-item-option color="warning">
                  <ion-icon slot="icon-only" name="pin"></ion-icon>
                </ion-item-option>
              </ion-item-options>
              <ion-item>
                <ion-label>Item 1</ion-label>
              </ion-item>
            </ion-item-sliding>

            <ion-item-sliding>
              <ion-item-options slot="start">
                <ion-item-option color="warning">
                  <ion-icon slot="icon-only" name="pin"></ion-icon>
                </ion-item-option>
              </ion-item-options>
              <ion-item>
                <ion-label>Item 2</ion-label>
              </ion-item>
            </ion-item-sliding>
          </ion-list>
        </div>
      `,
        config
      );

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot('inset-list-start-options-no-lines'));
    });
  });
});
