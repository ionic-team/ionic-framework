import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { test } from '@utils/test/playwright';

test.describe('datetime: locale', () => {
  let datetimeFixture: DatetimeLocaleFixture;

  test.beforeEach(async ({ page }) => {
    datetimeFixture = new DatetimeLocaleFixture(page);
    await datetimeFixture.goto();
  });

  test.describe('en-US', () => {
    test.beforeEach(async () => {
      await datetimeFixture.setLocale('en-US');
    });

    test('should not have visual regressions', async () => {
      await datetimeFixture.expectLocalizedDatePicker();
    });

    test('month/year picker should not have visual regressions', async () => {
      await datetimeFixture.expectLocalizedMonthYearPicker();
    });

    test('time picker should not have visual regressions', async () => {
      await datetimeFixture.expectLocalizedTimePicker();
    });
  });

  test.describe('ta-IN', () => {
    test.beforeEach(async () => {
      await datetimeFixture.setLocale('ta-IN');
    });

    test('should not have visual regressions', async () => {
      await datetimeFixture.expectLocalizedDatePicker();
    });

    test('month/year picker should not have visual regressions', async () => {
      await datetimeFixture.expectLocalizedMonthYearPicker();
    });

    test('time picker should not have visual regressions', async () => {
      await datetimeFixture.expectLocalizedTimePicker();
    });
  });

  test.describe('ja-JP', () => {
    test.beforeEach(async () => {
      await datetimeFixture.setLocale('ja-JP');
    });

    test('should not have visual regressions', async () => {
      await datetimeFixture.expectLocalizedDatePicker();
    });

    test('month/year picker should not have visual regressions', async () => {
      await datetimeFixture.expectLocalizedMonthYearPicker();
    });

    test('time picker should not have visual regressions', async () => {
      await datetimeFixture.expectLocalizedTimePicker();
    });

    test('should correctly localize calendar day buttons without literal', async ({ page }) => {
      await page.setContent(`
        <ion-datetime locale="ja-JP" presentation="date" value="2022-01-01"></ion-datetime>
      `);

      await page.waitForSelector('.datetime-ready');

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
    test.beforeEach(async () => {
      await datetimeFixture.setLocale('es-ES');
    });

    test('should not have visual regressions', async () => {
      await datetimeFixture.expectLocalizedDatePicker();
    });

    test('month/year picker should not have visual regressions', async () => {
      await datetimeFixture.expectLocalizedMonthYearPicker();
    });

    test('time picker should not have visual regressions', async () => {
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

    const datetimeYears = page.locator('ion-datetime .year-column .picker-item:not(.picker-item-empty)');

    await expect(datetimeYears.nth(0)).toHaveText('٢٠٢٢');
    await expect(datetimeYears.nth(1)).toHaveText('٢٠٢١');
    await expect(datetimeYears.nth(2)).toHaveText('٢٠٢٠');
  });
});

class DatetimeLocaleFixture {
  readonly page: E2EPage;
  locale = 'en-US';

  constructor(page: E2EPage) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(`/src/components/datetime/test/locale`);
  }

  async setLocale(locale: string) {
    this.locale = locale;
    await this.page.locator('select').selectOption(locale);
    await this.page.waitForChanges();
  }

  async expectLocalizedDatePicker() {
    await this.waitForDatetime();

    await this.page.setIonViewport();
    // Captures a screenshot of the datepicker with localized am/pm labels
    expect(await this.page.screenshot()).toMatchSnapshot(
      `datetime-locale-${this.locale}-diff-${this.page.getSnapshotSettings()}.png`
    );
  }

  async expectLocalizedMonthYearPicker() {
    await this.waitForDatetime();
    await this.page.setIonViewport();
    // Opens the month/year picker
    const monthYearButton = this.page.locator('#am .calendar-month-year ion-item');
    await monthYearButton.click();
    await this.page.waitForChanges();
    // Capture a screenshot of the month/year picker with localized month labels.
    expect(await this.page.screenshot()).toMatchSnapshot(
      `datetime-locale-${this.locale}-month-year-diff-${this.page.getSnapshotSettings()}.png`
    );
  }

  async expectLocalizedTimePicker() {
    await this.waitForDatetime();
    await this.page.setIonViewport();
    // Opens the timepicker
    const timePickerButton = this.page.locator('#am .time-body');
    const timePickerPopoverPresentSpy = await this.page.spyOnEvent('ionPopoverDidPresent');
    await timePickerButton.click();
    await timePickerPopoverPresentSpy.next();
    // Capture a screenshot of the time picker with localized am/pm labels
    expect(await this.page.screenshot()).toMatchSnapshot(
      `datetime-locale-${this.locale}-time-diff-${this.page.getSnapshotSettings()}.png`
    );
  }

  private async waitForDatetime() {
    await this.page.locator('#am.datetime-ready').waitFor({ state: 'attached' });
    await this.page.locator('#pm').scrollIntoViewIfNeeded();
    await this.page.locator('#pm.datetime-ready').waitFor({ state: 'attached' });
  }
}
