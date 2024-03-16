import { expect } from '@playwright/test';
import type { Locator } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';
import type { EventSpy } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('datetime-button: rendering'), () => {
    test('should size the modal correctly', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime-button datetime="datetime"></ion-datetime-button>
        <ion-modal>
          <ion-datetime id="datetime" show-default-title="true" show-default-buttons="true" value="2022-01-01T16:30:00"></ion-datetime>
        </ion-modal>
      `,
        config
      );

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const dateButton = page.locator('ion-datetime-button #date-button');
      await dateButton.click();
      await ionModalDidPresent.next();

      await expect(page).toHaveScreenshot(screenshot(`datetime-overlay-modal`));
    });

    test('should size the popover correctly', async ({ page, skip }) => {
      skip.browser('firefox', 'Rendering is flaky in Firefox 107');
      await page.setContent(
        `
        <ion-datetime-button datetime="datetime"></ion-datetime-button>
        <ion-popover>
          <ion-datetime id="datetime" show-default-title="true" show-default-buttons="true" value="2022-01-01T16:30:00"></ion-datetime>
        </ion-popover>
      `,
        config
      );

      const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');
      const dateButton = page.locator('ion-datetime-button #date-button');
      await dateButton.click();
      await ionPopoverDidPresent.next();

      await expect(page).toHaveScreenshot(screenshot(`datetime-overlay-popover`));
    });
  });
});

/**
 * The tested behavior does not
 * vary across modes/directions
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('datetime-button: popover'), () => {
    let datetime: Locator;
    let popover: Locator;
    let ionPopoverDidPresent: EventSpy;
    let ionPopoverDidDismiss: EventSpy;
    test.beforeEach(async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime-button datetime="datetime"></ion-datetime-button>

        <ion-popover>
          <ion-datetime id="datetime" presentation="date-time"></ion-datetime>
        </ion-popover>
      `,
        config
      );

      datetime = page.locator('ion-datetime');
      popover = page.locator('ion-popover');
      ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');
      ionPopoverDidDismiss = await page.spyOnEvent('ionPopoverDidDismiss');
    });
    test('should open the date popover', async ({ page }) => {
      await page.click('#date-button');

      await ionPopoverDidPresent.next();

      await expect(datetime).toBeVisible();
    });
    test('should open the time popover', async ({ page }) => {
      await page.click('#time-button');

      await ionPopoverDidPresent.next();

      await expect(datetime).toBeVisible();
    });
    test('should open the date popover then the time popover', async ({ page }) => {
      await page.click('#date-button');
      await ionPopoverDidPresent.next();
      await expect(datetime).toBeVisible();

      await popover.evaluate((el: HTMLIonPopoverElement) => el.dismiss());
      await ionPopoverDidDismiss.next();

      await page.click('#time-button');
      await ionPopoverDidPresent.next();
      await expect(datetime).toBeVisible();
    });
    test('should open the time popover then the date popover', async ({ page }) => {
      await page.click('#time-button');
      await ionPopoverDidPresent.next();
      await expect(datetime).toBeVisible();

      await popover.evaluate((el: HTMLIonPopoverElement) => el.dismiss());
      await ionPopoverDidDismiss.next();

      await page.click('#date-button');
      await ionPopoverDidPresent.next();
      await expect(datetime).toBeVisible();
    });
  });

  test.describe(title('datetime-button: modal'), () => {
    let datetime: Locator;
    let modal: Locator;
    let ionModalDidPresent: EventSpy;
    let ionModalDidDismiss: EventSpy;
    test.beforeEach(async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime-button datetime="datetime"></ion-datetime-button>

        <ion-modal>
          <ion-datetime id="datetime" presentation="date-time"></ion-datetime>
        </ion-modal>
      `,
        config
      );

      datetime = page.locator('ion-datetime');
      modal = page.locator('ion-modal');
      ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');
    });
    test('should open the date modal', async ({ page }) => {
      await page.click('#date-button');

      await ionModalDidPresent.next();

      await expect(datetime).toBeVisible();
    });
    test('should open the time modal', async ({ page }) => {
      await page.click('#time-button');

      await ionModalDidPresent.next();

      await expect(datetime).toBeVisible();
    });
    test('should open the date modal then the time modal', async ({ page }) => {
      await page.click('#date-button');
      await ionModalDidPresent.next();
      await expect(datetime).toBeVisible();

      await modal.evaluate((el: HTMLIonModalElement) => el.dismiss());
      await ionModalDidDismiss.next();

      await page.click('#time-button');
      await ionModalDidPresent.next();
      await expect(datetime).toBeVisible();
    });
    test('should open the time modal then the date modal', async ({ page }) => {
      await page.click('#time-button');
      await ionModalDidPresent.next();
      await expect(datetime).toBeVisible();

      await modal.evaluate((el: HTMLIonModalElement) => el.dismiss());
      await ionModalDidDismiss.next();

      await page.click('#date-button');
      await ionModalDidPresent.next();
      await expect(datetime).toBeVisible();
    });
  });
});
