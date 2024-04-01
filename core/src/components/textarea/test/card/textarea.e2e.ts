import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

configs({
  modes: ['md'],
  directions: ['ltr'],
}).forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('textarea: card'),
      () => {
        test('should render correctly in card', async ({
          page,
        }) => {
          await page.setContent(
            `
        <ion-card>
          <ion-card-content>
            <ion-item style="border: 1px solid grey" lines="none">
              <ion-textarea label="textarea" label-placement="stacked"></ion-textarea>
            </ion-item>
          </ion-card-content>
        </ion-card>
      `,
            config
          );

          const card =
            page.locator('ion-card');
          await expect(
            card
          ).toHaveScreenshot(
            screenshot(`textarea-card`)
          );
        });
      }
    );
  }
);
