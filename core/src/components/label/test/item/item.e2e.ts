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
      title('label: in item'),
      () => {
        test('should render correctly in an item', async ({
          page,
        }) => {
          test.info().annotations.push({
            type: 'issue',
            description:
              'https://github.com/ionic-team/ionic-framework/issues/29033',
          });
          await page.setContent(
            `
        <ion-item>
          <ion-label slot="start">Start</ion-label>
          <ion-label>Default</ion-label>
          <ion-label slot="end">End</ion-label>
        </ion-item>
        `,
            config
          );

          const item =
            page.locator('ion-item');

          await expect(
            item
          ).toHaveScreenshot(
            screenshot(`label-item`)
          );
        });
      }
    );
  }
);
