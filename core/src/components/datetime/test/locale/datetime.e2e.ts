import { expect } from '@playwright/test';
import type { Locator } from '@playwright/test';
import type { E2EPage, E2EPageOptions, ScreenshotFn } from '@utils/test/playwright';
import { configs, test } from '@utils/test/playwright';

/**
 * This is testing text content of the
 * datetime and not layout, so we skip
 * direction tests.
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('datetime: locale'), () => {
    let datetimeFixture: DatetimeLocaleFixture;

    test.beforeEach(async ({ page }) => {
      datetimeFixture = new DatetimeLocaleFixture(page);
    });

    test.describe('en-US', () => {
      test('should not have visual regressions', async () => {
        await datetimeFixture.goto(config, 'en-US', 'date');
        await datetimeFixture.expectLocalizedDatePicker(screenshot);
      });

      test('month/year picker should not have visual regressions', async () => {
        await datetimeFixture.goto(config, 'en-US', 'month-year');
        await datetimeFixture.expectLocalizedMonthYearPicker(screenshot);
      });

      test('time picker should not have visual regressions', async () => {
        await datetimeFixture.goto(config, 'en-US', 'time');
        await datetimeFixture.expectLocalizedTimePicker(screenshot);
      });
    });

    test.describe('ja-JP', () => {
      test('should not have visual regressions', async () => {
        await datetimeFixture.goto(config, 'ja-JP', 'date');
        await datetimeFixture.expectLocalizedDatePicker(screenshot);
      });

      test('month/year picker should not have visual regressions', async () => {
        await datetimeFixture.goto(config, 'ja-JP', 'month-year');
        await datetimeFixture.expectLocalizedMonthYearPicker(screenshot);
      });

      test('time picker should not have visual regressions', async () => {
        await datetimeFixture.goto(config, 'ja-JP', 'time');
        await datetimeFixture.expectLocalizedTimePicker(screenshot);
      });

      test('should correctly localize calendar day buttons without literal', async ({ page }) => {
        await datetimeFixture.goto(config, 'ja-JP', 'date');

        const datetimeButtons = page.locator('ion-datetime .calendar-day:not([disabled])');

        /**
         * Note: The Intl.DateTimeFormat typically adds literals
         * for certain languages. For Japanese, that could look
         * something like "29日". However, we only want the "29"
         * to be shown.
         */
        await expect(datetimeButtons.nth(0)).toHaveText('1');
        await expect(datetimeButtons.nth(1)).toHaveText('2');
        await expect(datetimeButtons.nth(2)).toHaveText('3');
      });
    });

    test.describe('es-ES', () => {
      test('should not have visual regressions', async () => {
        await datetimeFixture.goto(config, 'es-ES', 'date');
        await datetimeFixture.expectLocalizedDatePicker(screenshot);
      });

      test('month/year picker should not have visual regressions', async () => {
        await datetimeFixture.goto(config, 'es-ES', 'month-year');
        await datetimeFixture.expectLocalizedMonthYearPicker(screenshot);
      });

      test('time picker should not have visual regressions', async () => {
        await datetimeFixture.goto(config, 'es-ES', 'time');
        await datetimeFixture.expectLocalizedTimePicker(screenshot);
      });
    });
  });
});

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('ar-EG'), () => {
    test('should correctly localize calendar day buttons', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime locale="ar-EG" presentation="date" value="2022-01-01"></ion-datetime>
      `,
        config
      );

      await page.locator('.datetime-ready').waitFor();

      const datetimeButtons = page.locator('ion-datetime .calendar-day:not([disabled])');

      await expect(datetimeButtons.nth(0)).toHaveText('١');
      await expect(datetimeButtons.nth(1)).toHaveText('٢');
      await expect(datetimeButtons.nth(2)).toHaveText('٣');
    });

    test('should correctly localize year column data', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime prefer-wheel="true" locale="ar-EG" presentation="date" value="2022-01-01" max="2022" min="2022"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetimeYear = page.locator('ion-datetime .year-column ion-picker-column-option').nth(0);
      await expect(datetimeYear).toHaveText('٢٠٢٢');
    });
  });
});

class DatetimeLocaleFixture {
  readonly page: E2EPage;
  locale = 'en-US';
  datetime!: Locator;

  constructor(page: E2EPage) {
    this.page = page;
  }

  async goto(config: E2EPageOptions, locale = 'en-US', presentation = 'date') {
    this.locale = locale;
    await this.page.setContent(
      `
      <ion-datetime
        show-default-title="true"
        show-default-buttons="true"
        locale="${this.locale}"
        presentation="${presentation}"
        value="2022-04-19T04:20:00"
        max="2022"
      ></ion-datetime>
    `,
      config
    );

    this.datetime = this.page.locator('ion-datetime');

    await this.page.locator('.datetime-ready').waitFor();
  }

  async expectLocalizedDatePicker(screenshot: ScreenshotFn) {
    await this.expectLocalizedPicker(screenshot);
  }

  async expectLocalizedMonthYearPicker(screenshot: ScreenshotFn) {
    await this.expectLocalizedPicker(screenshot, 'month-year');
  }

  async expectLocalizedTimePicker(screenshot: ScreenshotFn) {
    await this.expectLocalizedPicker(screenshot, 'time');
  }

  async expectLocalizedPicker(screenshot: ScreenshotFn, modifier?: string) {
    const modifierString = modifier === undefined ? '' : `-${modifier}`;
    await expect(this.datetime).toHaveScreenshot(screenshot(`datetime-locale-${this.locale}${modifierString}-diff`));
  }
}
