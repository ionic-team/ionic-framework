import { expect } from '@playwright/test';
import type { EventSpy } from '@utils/test/playwright';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('img: basic'), () => {
    test.describe('image successfully loads', () => {
      let ionImgWillLoad: EventSpy;
      let ionImgDidLoad: EventSpy;

      test.beforeEach(async ({ page }) => {
        await page.route('**/*', (route) => {
          if (route.request().resourceType() === 'image') {
            return route.fulfill({
              status: 200,
              contentType: 'image/png',
              body: Buffer.from(
                'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
                'base64'
              ),
            });
          }
          return route.continue();
        });

        /**
         * We render the img intentionally without providing a source,
         * to allow the event spies to be set-up before the events
         * can be emitted.
         *
         * Later we will assign an image source to load.
         */
        await page.setContent('<ion-img></ion-img>', config);

        ionImgDidLoad = await page.spyOnEvent('ionImgDidLoad');
        ionImgWillLoad = await page.spyOnEvent('ionImgWillLoad');

        const ionImg = page.locator('ion-img');
        await ionImg.evaluate((el: HTMLIonImgElement) => {
          el.src = 'https://via.placeholder.com/150';
          return el;
        });
      });

      test('should emit ionImgWillLoad', async () => {
        await ionImgWillLoad.next();

        expect(ionImgWillLoad).toHaveReceivedEventTimes(1);
      });

      test('should emit ionImgDidLoad', async () => {
        await ionImgDidLoad.next();

        expect(ionImgDidLoad).toHaveReceivedEventTimes(1);
      });
    });

    test.describe('image fails to load', () => {
      let ionError: EventSpy;

      test.beforeEach(async ({ page }) => {
        await page.route('**/*', (route) =>
          route.request().resourceType() === 'image' ? route.abort() : route.continue()
        );

        /**
         * We render the img intentionally without providing a source,
         * to allow the event spies to be set-up before the events
         * can be emitted.
         *
         * Later we will assign an image source to load.
         */
        await page.setContent('<ion-img></ion-img>', config);

        ionError = await page.spyOnEvent('ionError');

        const ionImg = page.locator('ion-img');
        await ionImg.evaluate((el: HTMLIonImgElement) => {
          el.src = 'https://via.placeholder.com/150';
          return el;
        });
      });

      test('should emit ionError', async () => {
        await ionError.next();

        expect(ionError).toHaveReceivedEventTimes(1);
      });
    });
  });
});
