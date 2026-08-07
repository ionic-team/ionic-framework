import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import type { E2EPage, EventSpy } from '@utils/test/playwright';
import { configs, test } from '@utils/test/playwright';

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
    test('should set datetime ready state and keep calendar interactive when reopening modal', async ({
      page,
    }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30706',
      });

      const openAndInteract = async () => {
        await page.click('#date-button');
        await ionModalDidPresent.next();

        await page.locator('ion-datetime.datetime-ready').waitFor();

        const calendarBody = datetime.locator('.calendar-body');
        await expect(calendarBody).toBeVisible();
      };

      await openAndInteract();

      const firstEnabledDay = datetime.locator('.calendar-day:not([disabled])').first();
      await firstEnabledDay.click();
      await page.waitForChanges();

      await modal.evaluate((el: HTMLIonModalElement) => el.dismiss());
      await ionModalDidDismiss.next();

      await openAndInteract();
    });
  });
});

/**
 * This behavior does not vary across modes/directions
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('datetime-button: reopening modal'), () => {
    let datetime: Locator;
    let modal: Locator;
    let monthYear: Locator;
    let ionModalDidPresent: EventSpy;
    let ionModalDidDismiss: EventSpy;

    test.beforeEach(async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime-button datetime="datetime"></ion-datetime-button>

        <ion-modal>
          <ion-datetime id="datetime" locale="en-US" value="2022-03-15T16:30:00"></ion-datetime>
        </ion-modal>
      `,
        config
      );

      datetime = page.locator('ion-datetime');
      modal = page.locator('ion-modal');
      monthYear = datetime.locator('.calendar-month-year');
      ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');
    });

    const openModal = async (page: E2EPage) => {
      await page.click('#date-button');
      await ionModalDidPresent.next();
      await page.locator('ion-datetime.datetime-ready').waitFor();
      await page.waitForChanges();
    };

    const dismissModal = async () => {
      await modal.evaluate((el: HTMLIonModalElement) => el.dismiss());
      await ionModalDidDismiss.next();
    };

    test('should keep the selected day in view when reopened', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/31155',
      });

      const selectedDay = datetime.locator('.calendar-day-active');

      await openModal(page);
      await expect(selectedDay).toBeInViewport();

      await dismissModal();
      await openModal(page);

      await expect(selectedDay).toBeInViewport();
    });

    test('should navigate to the previous month when reopened', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/31155',
      });

      await openModal(page);
      await dismissModal();
      await openModal(page);

      await expect(monthYear).toHaveText('March 2022');

      await datetime.locator('.calendar-next-prev ion-button').first().click();

      await expect(monthYear).toHaveText('February 2022');
    });

    test('should select a day from the month shown in the header when reopened', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/31155',
      });

      await openModal(page);
      await dismissModal();
      await openModal(page);

      await expect(monthYear).toHaveText('March 2022');

      const ionChange = await page.spyOnEvent('ionChange');

      /**
       * Click the middle of the calendar instead of a day by name so Playwright
       * doesn't scroll the target into view and hide a wrong scroll position.
       */
      const calendarBody = (await datetime.locator('.calendar-body').boundingBox())!;
      await page.mouse.click(calendarBody.x + calendarBody.width / 2, calendarBody.y + calendarBody.height / 2);
      await ionChange.next();

      const value = await datetime.evaluate((el: HTMLIonDatetimeElement) => el.value as string);
      expect(value).toMatch(/^2022-03-/);
      await expect(monthYear).toHaveText('March 2022');
    });
  });
});
