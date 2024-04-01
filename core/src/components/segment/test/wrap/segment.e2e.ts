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
      title('segment: wrap'),
      () => {
        test('should wrap long text', async ({
          page,
        }) => {
          await page.setContent(
            `
        <ion-segment>
          <ion-segment-button value="long">
            <ion-label>This is the button that never ends it just goes on and on my friends</ion-label>
          </ion-segment-button>
          <ion-segment-button value="free">
            <ion-label>Free</ion-label>
          </ion-segment-button>
          <ion-segment-button value="purchased">
            <ion-label>Purchased</ion-label>
          </ion-segment-button>
        </ion-segment>
      `,
            config
          );

          const segment = page.locator(
            'ion-segment'
          );

          await expect(
            segment
          ).toHaveScreenshot(
            screenshot(`segment-wrap`)
          );
        });
        test('should wrap long text with an icon', async ({
          page,
        }) => {
          await page.setContent(
            `
        <ion-segment>
          <ion-segment-button value="long">
            <ion-icon name="heart-outline"></ion-icon>
            <ion-label>This is the button that never ends it just goes on and on my friends</ion-label>
          </ion-segment-button>
          <ion-segment-button value="free">
            <ion-icon name="star-outline"></ion-icon>
            <ion-label>Free</ion-label>
          </ion-segment-button>
          <ion-segment-button value="purchased">
            <ion-icon name="square-outline"></ion-icon>
            <ion-label>Purchased</ion-label>
          </ion-segment-button>
        </ion-segment>
      `,
            config
          );

          const segment = page.locator(
            'ion-segment'
          );

          await expect(
            segment
          ).toHaveScreenshot(
            screenshot(
              `segment-wrap-icon`
            )
          );
        });
        test('should wrap long text with a start icon', async ({
          page,
        }) => {
          await page.setContent(
            `
        <ion-segment>
          <ion-segment-button layout="icon-start" value="long">
            <ion-icon name="heart-outline"></ion-icon>
            <ion-label>This is the button that never ends it just goes on and on my friends</ion-label>
          </ion-segment-button>
          <ion-segment-button layout="icon-start" value="free">
            <ion-icon name="star-outline"></ion-icon>
            <ion-label>Free</ion-label>
          </ion-segment-button>
          <ion-segment-button layout="icon-start" value="purchased">
            <ion-icon name="square-outline"></ion-icon>
            <ion-label>Purchased</ion-label>
          </ion-segment-button>
        </ion-segment>
      `,
            config
          );

          const segment = page.locator(
            'ion-segment'
          );

          await expect(
            segment
          ).toHaveScreenshot(
            screenshot(
              `segment-wrap-icon-start`
            )
          );
        });
        test('should wrap long text in a toolbar', async ({
          page,
        }) => {
          await page.setContent(
            `
        <ion-toolbar>
          <ion-segment>
            <ion-segment-button value="long">
              <ion-label>This is the button that never ends it just goes on and on my friends</ion-label>
            </ion-segment-button>
            <ion-segment-button value="free">
              <ion-label>Free</ion-label>
            </ion-segment-button>
            <ion-segment-button value="purchased">
              <ion-label>Purchased</ion-label>
            </ion-segment-button>
          </ion-segment>
        </ion-toolbar>
      `,
            config
          );

          const toolbar = page.locator(
            'ion-toolbar'
          );

          await expect(
            toolbar
          ).toHaveScreenshot(
            screenshot(
              `segment-wrap-toolbar`
            )
          );
        });
      }
    );
  }
);
