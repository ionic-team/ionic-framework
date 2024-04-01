import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

configs().forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('segment: rendering'),
      () => {
        test('should not have visual regressions when no value is selected', async ({
          page,
        }) => {
          await page.setContent(
            `
        <ion-segment>
          <ion-segment-button value="a">
            <ion-label>First</ion-label>
          </ion-segment-button>
          <ion-segment-button value="b">
            <ion-label>Second</ion-label>
          </ion-segment-button>
          <ion-segment-button value="c">
            <ion-label>Third</ion-label>
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
              `segment-no-value`
            )
          );
        });
        test('should not have visual regressions when a value is selected', async ({
          page,
        }) => {
          await page.setContent(
            `
        <ion-segment value="a">
          <ion-segment-button value="a">
            <ion-label>First</ion-label>
          </ion-segment-button>
          <ion-segment-button value="b">
            <ion-label>Second</ion-label>
          </ion-segment-button>
          <ion-segment-button value="c">
            <ion-label>Third</ion-label>
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
            screenshot(`segment-value`)
          );
        });
      }
    );
  }
);

/**
 * This behavior does not vary across directions.
 */
configs({
  directions: ['ltr'],
}).forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title(
        'segment: feature rendering'
      ),
      () => {
        test('should not have visual regressions when an item is disabled', async ({
          page,
        }) => {
          await page.setContent(
            `
        <ion-segment value="b">
          <ion-segment-button value="a">
            <ion-label>First</ion-label>
          </ion-segment-button>
          <ion-segment-button value="b" disabled="true">
            <ion-label>Second</ion-label>
          </ion-segment-button>
          <ion-segment-button value="c">
            <ion-label>Third</ion-label>
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
              `segment-disabled`
            )
          );
        });

        test('should not have visual regressions with color', async ({
          page,
        }) => {
          await page.setContent(
            `
        <ion-segment value="b" color="danger">
          <ion-segment-button value="a">
            <ion-label>First</ion-label>
          </ion-segment-button>
          <ion-segment-button value="b">
            <ion-label>Second</ion-label>
          </ion-segment-button>
          <ion-segment-button value="c">
            <ion-label>Third</ion-label>
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
            screenshot(`segment-color`)
          );
        });
      }
    );
  }
);
