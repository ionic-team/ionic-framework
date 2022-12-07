import { expect } from '@playwright/test';
import type { EventSpy } from '@utils/test/playwright';
import { test } from '@utils/test/playwright';

test.describe('img: basic', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
    skip.mode('ios');
  });

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
              'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIwAAAABJRU5ErkJggg==',
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
      await page.setContent('<ion-img></ion-img>');

      ionImgDidLoad = await page.spyOnEvent('ionImgDidLoad');
      ionImgWillLoad = await page.spyOnEvent('ionImgWillLoad');

      const ionImg = await page.locator('ion-img');
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

      expect(ionImgWillLoad).toHaveReceivedEventTimes(1);
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
      await page.setContent('<ion-img></ion-img>');

      ionError = await page.spyOnEvent('ionError');

      const ionImg = await page.locator('ion-img');
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
