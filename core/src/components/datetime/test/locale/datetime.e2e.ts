import { expect } from '@playwright/test';
import type { Locator } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { test } from '@utils/test/playwright';

test.describe('datetime: locale', () => {
  let datetimeFixture: DatetimeLocaleFixture;

  test.beforeEach(async ({ page }) => {
    datetimeFixture = new DatetimeLocaleFixture(page);
  });

  test.describe('en-US', () => {
    test('should not have visual regressions', async () => {
      await datetimeFixture.goto('en-US', 'date');
      await datetimeFixture.expectLocalizedDatePicker();
    });

    test('month/year picker should not have visual regressions', async () => {
      await datetimeFixture.goto('en-US', 'month-year');
      await datetimeFixture.expectLocalizedMonthYearPicker();
    });

    test('time picker should not have visual regressions', async () => {
      await datetimeFixture.goto('en-US', 'time');
      await datetimeFixture.expectLocalizedTimePicker();
    });
  });

  test.describe('ja-JP', () => {
    test('should not have visual regressions', async () => {
      await datetimeFixture.goto('ja-JP', 'date');
      await datetimeFixture.expectLocalizedDatePicker();
    });

    test('month/year picker should not have visual regressions', async () => {
      await datetimeFixture.goto('ja-JP', 'month-year');
      await datetimeFixture.expectLocalizedMonthYearPicker();
    });

    test('time picker should not have visual regressions', async () => {
      await datetimeFixture.goto('ja-JP', 'time');
      await datetimeFixture.expectLocalizedTimePicker();
    });

    test('should correctly localize calendar day buttons without literal', async ({ page }) => {
      await datetimeFixture.goto('ja-JP', 'date');

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
      await datetimeFixture.goto('es-ES', 'date');
      await datetimeFixture.expectLocalizedDatePicker();
    });

    test('month/year picker should not have visual regressions', async () => {
      await datetimeFixture.goto('es-ES', 'month-year');
      await datetimeFixture.expectLocalizedMonthYearPicker();
    });

    test('time picker should not have visual regressions', async () => {
      await datetimeFixture.goto('es-ES', 'time');
      await datetimeFixture.expectLocalizedTimePicker();
    });
  });
});

test.describe('ar-EG', () => {
  test.beforeEach(async ({ skip }) => {
    skip.rtl();
    skip.mode('md');
  });

  test('should correctly localize calendar day buttons', async ({ page }) => {
    await page.setContent(`
      <ion-datetime locale="ar-EG" presentation="date" value="2022-01-01"></ion-datetime>
    `);

    await page.waitForSelector('.datetime-ready');

    const datetimeButtons = page.locator('ion-datetime .calendar-day:not([disabled])');

    await expect(datetimeButtons.nth(0)).toHaveText('١');
    await expect(datetimeButtons.nth(1)).toHaveText('٢');
    await expect(datetimeButtons.nth(2)).toHaveText('٣');
  });

  test('should correctly localize year column data', async ({ page }) => {
    await page.setContent(`
      <ion-datetime prefer-wheel="true" locale="ar-EG" presentation="date" value="2022-01-01"></ion-datetime>
    `);
    await page.waitForSelector('.datetime-ready');

    const datetimeYear = page.locator('ion-datetime .year-column .picker-item[data-value="2022"]');

    await expect(datetimeYear).toHaveText('٢٠٢٢');
  });
});

class DatetimeLocaleFixture {
  readonly page: E2EPage;
  locale = 'en-US';
  datetime!: Locator;

  constructor(page: E2EPage) {
    this.page = page;
  }

  async goto(locale = 'en-US', presentation = 'date') {
    this.locale = locale;
    await this.page.setContent(`
      <ion-datetime
        show-default-title="true"
        show-default-buttons="true"
        locale="${this.locale}"
        presentation="${presentation}"
        value="2022-04-19T04:20:00"
        max="2022"
      ></ion-datetime>
    `);

    this.datetime = this.page.locator('ion-datetime');

    await this.page.waitForSelector('.datetime-ready');
  }

  async expectLocalizedDatePicker() {
    await this.expectLocalizedPicker();
  }

  async expectLocalizedMonthYearPicker() {
    await this.expectLocalizedPicker('month-year');
  }

  async expectLocalizedTimePicker() {
    await this.expectLocalizedPicker('time');
  }

  async expectLocalizedPicker(modifier?: string) {
    const modifierString = modifier === undefined ? '' : `-${modifier}`;
    await expect(this.datetime).toHaveScreenshot(
      `datetime-locale-${this.locale}${modifierString}-diff-${this.page.getSnapshotSettings()}.png`
    );
  }
}
