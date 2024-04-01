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
      title('note: font scaling'),
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

        <ion-note>Note</ion-note>
      `,
            config
          );

          const note =
            page.locator('ion-note');

          await expect(
            note
          ).toHaveScreenshot(
            screenshot(`note-scale`)
          );
        });
        test('should scale text in an item on larger font sizes', async ({
          page,
        }) => {
          await page.setContent(
            `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-item>
          <ion-note slot="end">Note</ion-note>
        </ion-item>
      `,
            config
          );

          const note =
            page.locator('ion-note');

          await expect(
            note
          ).toHaveScreenshot(
            screenshot(
              `note-item-scale`
            )
          );
        });
        test('should scale text in an item divider on larger font sizes', async ({
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
          <ion-note slot="end">Note</ion-note>
        </ion-item-divider>
      `,
            config
          );

          const note =
            page.locator('ion-note');

          await expect(
            note
          ).toHaveScreenshot(
            screenshot(
              `note-item-divider-scale`
            )
          );
        });
        test('should wrap label to the next line without truncating', async ({
          page,
        }) => {
          await page.setContent(
            `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-list>
          <ion-item>
            <ion-note slot="start">123</ion-note>
            <ion-label>Label</ion-label>
          </ion-item>

          <ion-item>
            <ion-label>Label</ion-label>
            <ion-note slot="end">123</ion-note>
          </ion-item>

          <ion-item>
            <ion-note slot="start">123</ion-note>
            <ion-label>Really really long label</ion-label>
          </ion-item>

          <ion-item>
            <ion-label>Really really long label</ion-label>
            <ion-note slot="end">123</ion-note>
          </ion-item>

          <ion-item>
            <ion-note slot="start">123</ion-note>
            <ion-label>Really really long label</ion-label>
          </ion-item>

          <ion-item>
            <ion-label>Really really long label</ion-label>
            <ion-note slot="end">123</ion-note>
          </ion-item>
        </ion-list>
      `,
            config
          );

          const list =
            page.locator('ion-list');

          await expect(
            list
          ).toHaveScreenshot(
            screenshot(
              `note-wrapping-label-scale`
            )
          );
        });
      }
    );
  }
);
