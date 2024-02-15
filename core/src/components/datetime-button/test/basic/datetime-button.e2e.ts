import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ config, screenshot, title }) => {
  test.describe(title('datetime-button: basic'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime-button locale="en-US" datetime="datetime"></ion-datetime-button>
        <ion-datetime id="datetime" value="2022-01-01T06:30:00" presentation="date-time"></ion-datetime>
      `,
        config
      );
      const datetimeButton = page.locator('ion-datetime-button');

      await expect(datetimeButton).toHaveScreenshot(screenshot(`datetime-button-basic`));
    });
  });
});

/**
 * The tested behavior does not
 * vary across modes/directions
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('datetime-button: switching to correct view'), () => {
    test.beforeEach(async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime-button datetime="datetime"></ion-datetime-button>
        <ion-datetime id="datetime" presentation="date-time"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();
    });
    test('should switch to a date-only view when the date button is clicked', async ({ page }) => {
      const datetime = page.locator('ion-datetime');
      await expect(datetime).toHaveJSProperty('presentation', 'date-time');

      await page.click('#date-button');
      await page.waitForChanges();

      await expect(datetime).toHaveJSProperty('presentation', 'date');
    });
    test('should switch to a time-only view when the time button is clicked', async ({ page }) => {
      const datetime = page.locator('ion-datetime');
      await expect(datetime).toHaveJSProperty('presentation', 'date-time');

      await page.click('#time-button');
      await page.waitForChanges();

      await expect(datetime).toHaveJSProperty('presentation', 'time');
    });
  });
  test.describe(title('datetime-button: labels'), () => {
    test('should set date and time labels in separate buttons', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime-button locale="en-US" datetime="datetime"></ion-datetime-button>
        <ion-datetime id="datetime" value="2022-01-01T06:30:00" presentation="date-time"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      await expect(page.locator('#date-button')).toContainText('Jan 1, 2022');
      await expect(page.locator('#time-button')).toContainText('6:30 AM');
    });
    test('should set only month and year', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime-button locale="en-US" datetime="datetime"></ion-datetime-button>
        <ion-datetime id="datetime" value="2022-01-01T06:30:00" presentation="month-year"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      await expect(page.locator('#date-button')).toContainText('January 2022');
      await expect(page.locator('#time-button')).toBeHidden();
    });
    test('should set only year', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime-button locale="en-US" datetime="datetime"></ion-datetime-button>
        <ion-datetime id="datetime" value="2022-01-01T06:30:00" presentation="year"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      await expect(page.locator('#date-button')).toContainText('2022');
      await expect(page.locator('#time-button')).toBeHidden();
    });
    test('should set only month', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime-button locale="en-US" datetime="datetime"></ion-datetime-button>
        <ion-datetime id="datetime" value="2022-01-01T06:30:00" presentation="month"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      await expect(page.locator('#date-button')).toContainText('January');
      await expect(page.locator('#time-button')).toBeHidden();
    });
    test('should set only time', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime-button locale="en-US" datetime="datetime"></ion-datetime-button>
        <ion-datetime id="datetime" value="2022-01-01T06:30:00" presentation="time"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      await expect(page.locator('#time-button')).toContainText('6:30 AM');
      await expect(page.locator('#date-button')).toBeHidden();
    });
    test('should update the label when the value of the datetime changes', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime-button locale="en-US" datetime="datetime"></ion-datetime-button>
        <ion-datetime id="datetime" value="2022-01-01T06:30:00" presentation="date"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');
      const dateTarget = page.locator('#date-button');

      await expect(dateTarget).toContainText('Jan 1, 2022');

      await datetime.evaluate((el: HTMLIonDatetimeElement) => (el.value = '2023-05-10'));
      await page.waitForChanges();

      await expect(dateTarget).toContainText('May 10, 2023');
    });
    test('should set only month and year when only passing month and year', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/27797',
      });

      await page.setContent(
        `
        <ion-datetime-button locale="en-US" datetime="datetime"></ion-datetime-button>
        <ion-datetime id="datetime" value="2022-01" presentation="month-year"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      await expect(page.locator('#date-button')).toContainText('January 2022');
      await expect(page.locator('#time-button')).toBeHidden();
    });
    test('should set only year when passing only year', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/27797',
      });

      await page.setContent(
        `
        <ion-datetime-button locale="en-US" datetime="datetime"></ion-datetime-button>
        <ion-datetime id="datetime" value="2022" presentation="year"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      await expect(page.locator('#date-button')).toContainText('2022');
      await expect(page.locator('#time-button')).toBeHidden();
    });
  });

  test.describe(title('datetime-button: locale'), () => {
    test('should use the same locale as datetime', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime-button datetime="datetime"></ion-datetime-button>
        <ion-datetime locale="es-ES" id="datetime" value="2022-01-01T06:30:00" presentation="date-time"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      /**
       * The entire text reads 1 ene 2022, but some browsers will add
       * a period after "ene". Just checking ene allows us to verify the
       * behavior while avoiding these cross browser differences.
       */
      await expect(page.locator('#date-button')).toContainText(/ene/);
      await expect(page.locator('#time-button')).toContainText('6:30');
    });
    test('should respect hour cycle even if different from locale default', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime-button datetime="datetime"></ion-datetime-button>
        <ion-datetime hour-cycle="h23" locale="en-US" id="datetime" value="2022-01-01T16:30:00" presentation="date-time"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      await expect(page.locator('#time-button')).toContainText('16:30');
    });
    test('should ignore the timezone when selecting a date', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime-button datetime="datetime"></ion-datetime-button>
        <ion-datetime locale="en-US" id="datetime" value="2022-01-02T06:30:00" presentation="date-time"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const timeTarget = page.locator('#time-button');
      await expect(timeTarget).toContainText('6:30');

      const firstOfMonth = page.locator('ion-datetime .calendar-day[data-month="1"][data-day="1"]');
      await firstOfMonth.click();
      await page.waitForChanges();

      await expect(timeTarget).toContainText('6:30');
    });
  });

  test.describe(title('datetime-button: wheel'), () => {
    test('should only show a single date button when presentation="date-time" and prefer-wheel="true"', async ({
      page,
    }) => {
      await page.setContent(
        `
        <ion-datetime-button datetime="datetime"></ion-datetime-button>
        <ion-datetime locale="en-US" id="datetime" value="2022-01-01T06:30:00" presentation="date-time" prefer-wheel="true"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      await expect(page.locator('#date-button')).toContainText('Jan 1, 2022 6:30 AM');
      await expect(page.locator('#time-button')).not.toBeVisible();
    });
    test('should only show a single date button when presentation="time-date" and prefer-wheel="true"', async ({
      page,
    }) => {
      await page.setContent(
        `
        <ion-datetime-button datetime="datetime"></ion-datetime-button>
        <ion-datetime locale="en-US" id="datetime" value="2022-01-01T06:30:00" presentation="time-date" prefer-wheel="true"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      await expect(page.locator('#date-button')).toContainText('Jan 1, 2022 6:30 AM');
      await expect(page.locator('#time-button')).not.toBeVisible();
    });
  });
});
