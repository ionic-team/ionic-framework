import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

configs({
  directions: ['ltr'],
}).forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title(
        'item-divider: font scaling'
      ),
      () => {
        test('should scale text on larger font sizes', async ({
          page,
        }) => {
          await page.setContent(
            `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-item-divider>
          <ion-label>Item Divider</ion-label>
        </ion-item-divider>
      `,
            config
          );

          const itemDivider =
            page.locator(
              'ion-item-divider'
            );

          await expect(
            itemDivider
          ).toHaveScreenshot(
            screenshot(
              `item-divider-scale`
            )
          );
        });
        test('should scale text on larger font sizes when item divider contains headings and paragraphs', async ({
          page,
        }) => {
          await page.setContent(
            `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-item-divider>
          <ion-label>
            <h1>Heading 1</h1>
            <h2>Heading 2</h2>
            <h3>Heading 3</h3>
            <p>Paragraph</p>
          </ion-label>
        </ion-item-divider>
      `,
            config
          );

          const itemDivider =
            page.locator(
              'ion-item-divider'
            );

          await expect(
            itemDivider
          ).toHaveScreenshot(
            screenshot(
              `item-divider-headings-scale`
            )
          );
        });
      }
    );
  }
);
