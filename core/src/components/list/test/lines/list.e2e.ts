import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

configs().forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('list: lines'),
      () => {
        test('lines="full" should render correctly', async ({
          page,
        }) => {
          await page.goto(
            `/src/components/list/test/lines`,
            config
          );

          const list = page.locator(
            'ion-list[lines="full"]'
          );

          await expect(
            list
          ).toHaveScreenshot(
            screenshot(
              `list-lines-full`
            )
          );
        });
        test('lines="inset" should render correctly', async ({
          page,
        }) => {
          await page.goto(
            `/src/components/list/test/lines`,
            config
          );

          const list = page.locator(
            'ion-list[lines="inset"]'
          );

          await expect(
            list
          ).toHaveScreenshot(
            screenshot(
              `list-lines-inset`
            )
          );
        });
        test('lines="none" should render correctly', async ({
          page,
        }) => {
          await page.goto(
            `/src/components/list/test/lines`,
            config
          );

          const list = page.locator(
            'ion-list[lines="none"]'
          );

          await expect(
            list
          ).toHaveScreenshot(
            screenshot(
              `list-lines-none`
            )
          );
        });
      }
    );
  }
);

/**
 * Padding and border color ensures the bottom border can be easily seen if it regresses.
 * The background color ensures that any border radius values can be seen.
 */
configs({
  directions: ['ltr'],
}).forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title(
        'list: lines with children'
      ),
      () => {
        test('only item in inset list should not have line', async ({
          page,
        }) => {
          test.info().annotations.push({
            type: 'issue',
            description:
              'https://github.com/ionic-team/ionic-framework/issues/28435',
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

          const container =
            page.locator('#container');

          await expect(
            container
          ).toHaveScreenshot(
            screenshot(
              'inset-list-only-item-no-lines'
            )
          );
        });
        test('last item in inset list with end options should not have line', async ({
          page,
        }) => {
          test.info().annotations.push({
            type: 'issue',
            description:
              'https://github.com/ionic-team/ionic-framework/issues/28435',
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

          const container =
            page.locator('#container');

          await expect(
            container
          ).toHaveScreenshot(
            screenshot(
              'inset-list-end-options-no-lines'
            )
          );
        });
        test('last item in inset list with start options should not have line', async ({
          page,
        }) => {
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

          const container =
            page.locator('#container');

          await expect(
            container
          ).toHaveScreenshot(
            screenshot(
              'inset-list-start-options-no-lines'
            )
          );
        });
      }
    );
  }
);
