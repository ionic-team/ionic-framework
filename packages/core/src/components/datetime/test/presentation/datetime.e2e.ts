import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import type { E2EPage, E2EPageOptions, ScreenshotFn } from '@utils/test/playwright';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('datetime: presentation rendering'), () => {
    let presentationFixture!: DatetimePresentationFixture;
    test.beforeEach(({ page }) => {
      presentationFixture = new DatetimePresentationFixture(page);
    });

    test('should not have visual regressions with date-time presentation', async () => {
      await presentationFixture.goto('date-time', config);
      await presentationFixture.screenshot('datetime-presentation-date-time-diff', screenshot);
    });

    test('should not have visual regressions with time-date presentation', async () => {
      await presentationFixture.goto('time-date', config);
      await presentationFixture.screenshot('datetime-presentation-time-date-diff', screenshot);
    });

    test('should not have visual regressions with time presentation', async () => {
      await presentationFixture.goto('time', config);
      await presentationFixture.screenshot('datetime-presentation-time-diff', screenshot);
    });

    test('should not have visual regressions with date presentation', async () => {
      await presentationFixture.goto('date', config);
      await presentationFixture.screenshot('datetime-presentation-date-diff', screenshot);
    });

    test('should not have visual regressions with month-year presentation', async () => {
      await presentationFixture.goto('month-year', config);
      await presentationFixture.screenshot('datetime-presentation-month-year-diff', screenshot);
    });

    test('should not have visual regressions with month presentation', async () => {
      await presentationFixture.goto('month', config);
      await presentationFixture.screenshot('datetime-presentation-month-diff', screenshot);
    });

    test('should not have visual regressions with year presentation', async () => {
      await presentationFixture.goto('year', config);
      await presentationFixture.screenshot('datetime-presentation-year-diff', screenshot);
    });
  });
});

/**
 * This is testing component event behavior
 * which does not vary across modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('datetime: presentation'), () => {
    test('presentation: time: should emit ionChange', async ({ page }) => {
      await page.goto(`/src/components/datetime/test/presentation`, config);

      const ionChangeSpy = await page.spyOnEvent('ionChange');
      await page.locator('select').selectOption('time');
      await page.waitForChanges();

      await page.locator('text=AM').click();

      await ionChangeSpy.next();

      expect(ionChangeSpy.length).toBe(1);
    });

    test('presentation: month-year: should emit ionChange', async ({ page }) => {
      await page.goto(`/src/components/datetime/test/presentation`, config);

      const ionChangeSpy = await page.spyOnEvent('ionChange');
      await page.locator('select').selectOption('month-year');
      await page.waitForChanges();

      await page.locator('text=April').click();

      await ionChangeSpy.next();

      expect(ionChangeSpy.length).toBe(1);
    });

    test('presentation: month: should emit ionChange', async ({ page }) => {
      await page.goto(`/src/components/datetime/test/presentation`, config);

      const ionChangeSpy = await page.spyOnEvent('ionChange');
      await page.locator('select').selectOption('month');
      await page.waitForChanges();

      await page.locator('text=April').click();

      await ionChangeSpy.next();

      expect(ionChangeSpy.length).toBe(1);
    });

    test('presentation: year: should emit ionChange', async ({ page }) => {
      await page.goto(`/src/components/datetime/test/presentation`, config);

      const ionChangeSpy = await page.spyOnEvent('ionChange');
      await page.locator('select').selectOption('year');
      await page.waitForChanges();

      await page.locator('text=2021').click();

      await ionChangeSpy.next();

      expect(ionChangeSpy.length).toBe(1);
    });

    test('switching presentation should close month/year picker', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime presentation="date"></ion-datetime>
      `,
        config
      );

      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');
      const monthYearButton = page.locator('ion-datetime .calendar-month-year');
      await monthYearButton.click();

      await expect(datetime).toHaveClass(/show-month-and-year/);

      await datetime.evaluate((el: HTMLIonDatetimeElement) => (el.presentation = 'time'));
      await page.waitForChanges();

      await expect(datetime).not.toHaveClass(/show-month-and-year/);
    });
  });
});

/**
 * This is testing time rendering behavior
 * which does not vary across modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('datetime: presentation: time'), () => {
    test('changing value from AM to AM should update the text', async ({ page }) => {
      const timePickerFixture = new TimePickerFixture(page);
      await timePickerFixture.goto('04:20:00', config);

      await timePickerFixture.setValue('11:03:00');
      await timePickerFixture.expectTime(11, 3, 'am');
    });

    test('changing value from AM to PM should update the text', async ({ page }) => {
      const timePickerFixture = new TimePickerFixture(page);
      await timePickerFixture.goto('05:30:00', config);

      await timePickerFixture.setValue('16:40:00');
      await timePickerFixture.expectTime(16, 40, 'pm');
    });

    test('changing the value from PM to AM should update the text', async ({ page }) => {
      const timePickerFixture = new TimePickerFixture(page);
      await timePickerFixture.goto('16:40:00', config);

      await timePickerFixture.setValue('04:20:00');
      await timePickerFixture.expectTime(4, 20, 'am');
    });

    test('changing the value from PM to PM should update the text', async ({ page }) => {
      const timePickerFixture = new TimePickerFixture(page);
      await timePickerFixture.goto('16:40:00', config);

      await timePickerFixture.setValue('19:32:00');
      await timePickerFixture.expectTime(19, 32, 'pm');
    });
  });
});

class DatetimePresentationFixture {
  readonly page: E2EPage;

  private datetime!: Locator;

  constructor(page: E2EPage) {
    this.page = page;
  }

  async goto(presentation: string, config: E2EPageOptions) {
    await this.page.setContent(
      `
      <ion-datetime presentation="${presentation}" value="2010-03-10T13:00:00"></ion-datetime>
    `,
      config
    );
    await this.page.locator('.datetime-ready').waitFor();
    this.datetime = this.page.locator('ion-datetime');
  }

  async screenshot(name: string, screenshotFn: ScreenshotFn) {
    await expect(this.datetime).toHaveScreenshot(screenshotFn(name));
  }
}

class TimePickerFixture {
  readonly page: E2EPage;

  private timePicker!: Locator;

  constructor(page: E2EPage) {
    this.page = page;
  }

  async goto(value: string, config: E2EPageOptions) {
    await this.page.setContent(
      `
      <ion-datetime presentation="time" value="${value}"></ion-datetime>
    `,
      config
    );
    await this.page.locator('.datetime-ready').waitFor();
    this.timePicker = this.page.locator('ion-datetime');
  }

  async setValue(value: string) {
    await this.timePicker.evaluate((el: HTMLIonDatetimeElement, newValue: string) => {
      el.value = newValue;
    }, value);

    await this.page.waitForChanges();
  }

  async expectTime(hour: number, minute: number, ampm: string) {
    const pickerColumns = this.timePicker.locator('ion-picker-column-internal');

    await expect(pickerColumns.nth(0)).toHaveJSProperty('value', hour);
    await expect(pickerColumns.nth(1)).toHaveJSProperty('value', minute);
    await expect(pickerColumns.nth(2)).toHaveJSProperty('value', ampm);
  }
}
