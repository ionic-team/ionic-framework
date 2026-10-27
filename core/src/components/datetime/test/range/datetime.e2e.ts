import { expect } from '@playwright/test';
import type { Locator } from '@playwright/test';
import type { E2EPage, E2EPageOptions, ScreenshotFn } from '@utils/test/playwright';
import { configs, test } from '@utils/test/playwright';

const RANGE_START = '2022-06-08';
const RANGE_END = '2022-06-18';
const RANGE_VALUE = [RANGE_START, RANGE_END];

interface DatetimeRangeConfig {
  showDefaultTitle?: boolean;
  showDefaultButtons?: boolean;
  showClearButton?: boolean;
  startDateLabel?: string;
  endDateLabel?: string;
  disabled?: boolean;
  readonly?: boolean;
}

class DatetimeRangeFixture {
  readonly page: E2EPage;
  datetime!: Locator;

  constructor(page: E2EPage) {
    this.page = page;
  }

  async goto(config: E2EPageOptions, value?: string[], datetimeConfig?: DatetimeRangeConfig) {
    const { showDefaultTitle, showDefaultButtons, showClearButton, startDateLabel, endDateLabel, disabled, readonly } =
      datetimeConfig ?? {};

    const valueScript = value ? `datetime.value = [${value.map((v) => `'${v}'`).join(',')}];` : '';

    const attrs = [
      'locale="en-US"',
      'presentation="date"',
      'selection-mode="range"',
      showDefaultTitle ? 'show-default-title="true"' : '',
      showDefaultButtons ? 'show-default-buttons="true"' : '',
      showClearButton ? 'show-clear-button="true"' : '',
      startDateLabel ? `start-date-label="${startDateLabel}"` : '',
      endDateLabel ? `end-date-label="${endDateLabel}"` : '',
      disabled ? 'disabled="true"' : '',
      readonly ? 'readonly="true"' : '',
    ]
      .filter(Boolean)
      .join(' ');

    await this.page.setContent(
      `
      <ion-datetime ${attrs}></ion-datetime>
      <script>
        const datetime = document.querySelector('ion-datetime');
        ${valueScript}
      </script>
    `,
      config
    );

    this.datetime = this.page.locator('ion-datetime');
    await this.page.locator('.datetime-ready').waitFor();

    return this.datetime;
  }

  /**
   * Helper to get a day button in the visible month by day number.
   * Uses .calendar-month:nth-child(2) to target the visible (center) month.
   */
  getVisibleDay(day: number) {
    return this.datetime.locator(`.calendar-month:nth-child(2) [data-day="${day}"]`);
  }

  /**
   * Helper to build an ISO date string from a visible day button's data attributes.
   */
  async getISOFromDay(day: Locator) {
    const year = await day.getAttribute('data-year');
    let month = await day.getAttribute('data-month');
    if (month && month.length < 2) month = '0' + month;
    const dayNum = await day.getAttribute('data-day');
    const paddedDay = dayNum && dayNum.length < 2 ? '0' + dayNum : dayNum;
    return `${year}-${month}-${paddedDay}`;
  }

  async expectRangeDatePicker(id: string, screenshot: ScreenshotFn) {
    await expect(this.datetime).toHaveScreenshot(screenshot(`datetime-range-${id}`));
  }
}

/**
 * Visual regression tests across modes and directions.
 */
configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('datetime: range selection (visual regressions)'), () => {
    let fixture: DatetimeRangeFixture;
    test.beforeEach(async ({ page }) => {
      fixture = new DatetimeRangeFixture(page);
    });

    test('committed range should not have visual regressions', async () => {
      await fixture.goto(config, RANGE_VALUE);
      await fixture.expectRangeDatePicker('committed', screenshot);
    });

    test('partial range (start only) should not have visual regressions', async () => {
      await fixture.goto(config, [RANGE_START]);
      await fixture.expectRangeDatePicker('partial', screenshot);
    });

    test('disabled range should not have visual regressions', async () => {
      await fixture.goto(config, RANGE_VALUE, { disabled: true });
      await fixture.expectRangeDatePicker('disabled', screenshot);
    });

    test('readonly range should not have visual regressions', async () => {
      await fixture.goto(config, RANGE_VALUE, { readonly: true });
      await fixture.expectRangeDatePicker('readonly', screenshot);
    });
  });
});

/**
 * Functional tests — behavior is the same across modes/directions.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('datetime: range selection (functionality)'), () => {
    let fixture: DatetimeRangeFixture;
    test.beforeEach(async ({ page }) => {
      fixture = new DatetimeRangeFixture(page);
    });

    // ---------------------------------------------------------------
    // Basic range selection
    // ---------------------------------------------------------------

    test('clicking two days should select a range', async ({ page }) => {
      const datetime = await fixture.goto(config);
      const ionChangeSpy = await page.spyOnEvent('ionChange');

      const day8 = fixture.getVisibleDay(8);
      const day18 = fixture.getVisibleDay(18);

      await day8.click();
      await page.waitForChanges();

      // After first click, no ionChange yet (range incomplete)
      expect(ionChangeSpy).not.toHaveReceivedEvent();

      await day18.click();
      await ionChangeSpy.next();

      const startISO = await fixture.getISOFromDay(day8);
      const endISO = await fixture.getISOFromDay(day18);
      await expect(datetime).toHaveJSProperty('value', [startISO, endISO]);
    });

    test('clicking a day before the start should set a new start', async ({ page }) => {
      const datetime = await fixture.goto(config, RANGE_VALUE);

      const day3 = datetime.locator('[data-month="6"][data-day="3"]');
      await day3.click();
      await page.waitForChanges();

      // Clicking before the start resets to a new start — range is now partial
      await expect(day3).toHaveClass(/calendar-day-active/);
    });

    test('clicking a day within an existing range should set a new end', async ({ page }) => {
      const datetime = await fixture.goto(config, RANGE_VALUE);
      const ionChangeSpy = await page.spyOnEvent('ionChange');

      const day12 = datetime.locator('[data-month="6"][data-day="12"]');
      await day12.click();
      await ionChangeSpy.next();

      await expect(datetime).toHaveJSProperty('value', ['2022-06-08', '2022-06-12']);
    });

    test('clicking a day after the end should set a new end', async ({ page }) => {
      const datetime = await fixture.goto(config, RANGE_VALUE);
      const ionChangeSpy = await page.spyOnEvent('ionChange');

      const day22 = datetime.locator('[data-month="6"][data-day="22"]');
      await day22.click();
      await ionChangeSpy.next();

      await expect(datetime).toHaveJSProperty('value', ['2022-06-08', '2022-06-22']);
    });

    // ---------------------------------------------------------------
    // Single-day range
    // ---------------------------------------------------------------

    test('clicking the same day twice should create a single-day range', async ({ page }) => {
      const datetime = await fixture.goto(config);
      const ionChangeSpy = await page.spyOnEvent('ionChange');

      const day10 = fixture.getVisibleDay(10);
      await day10.click();
      await page.waitForChanges();
      await day10.click();
      await ionChangeSpy.next();

      const dayISO = await fixture.getISOFromDay(day10);
      await expect(datetime).toHaveJSProperty('value', [dayISO, dayISO]);
    });

    // ---------------------------------------------------------------
    // CSS classes
    // ---------------------------------------------------------------

    test('range start, end, and in-range days should have correct classes', async () => {
      const datetime = await fixture.goto(config, RANGE_VALUE);

      const day8 = datetime.locator('[data-month="6"][data-day="8"]');
      const day12 = datetime.locator('[data-month="6"][data-day="12"]');
      const day18 = datetime.locator('[data-month="6"][data-day="18"]');
      const day5 = datetime.locator('[data-month="6"][data-day="5"]');

      await expect(day8).toHaveClass(/calendar-day-range-start/);
      await expect(day18).toHaveClass(/calendar-day-range-end/);
      await expect(day12).toHaveClass(/calendar-day-in-range/);
      await expect(day5).not.toHaveClass(/calendar-day-in-range/);
      await expect(day5).not.toHaveClass(/calendar-day-range-start/);
    });

    // ---------------------------------------------------------------
    // Screen reader labels
    // ---------------------------------------------------------------

    test('start and end days should be announced with their labels', async () => {
      const datetime = await fixture.goto(config, RANGE_VALUE);

      const day8 = datetime.locator('[data-month="6"][data-day="8"]');
      const day12 = datetime.locator('[data-month="6"][data-day="12"]');
      const day18 = datetime.locator('[data-month="6"][data-day="18"]');

      await expect(day8).toHaveAttribute('aria-label', 'Wednesday, June 8, Start date');
      await expect(day18).toHaveAttribute('aria-label', 'Saturday, June 18, End date');
      // Days inside the range are not endpoints, so they get no label
      await expect(day12).toHaveAttribute('aria-label', 'Sunday, June 12');
    });

    test('single-day range should be announced as both start and end', async () => {
      const datetime = await fixture.goto(config, [RANGE_START, RANGE_START]);

      const day8 = datetime.locator('[data-month="6"][data-day="8"]');

      await expect(day8).toHaveAttribute('aria-label', 'Wednesday, June 8, Start date, End date');
    });

    test('days should be announced with custom labels', async () => {
      const datetime = await fixture.goto(config, RANGE_VALUE, {
        startDateLabel: 'Check in',
        endDateLabel: 'Check out',
      });

      const day8 = datetime.locator('[data-month="6"][data-day="8"]');
      const day18 = datetime.locator('[data-month="6"][data-day="18"]');

      await expect(day8).toHaveAttribute('aria-label', 'Wednesday, June 8, Check in');
      await expect(day18).toHaveAttribute('aria-label', 'Saturday, June 18, Check out');
    });

    // ---------------------------------------------------------------
    // ionChange event detail
    // ---------------------------------------------------------------

    test('ionChange should emit with array value detail', async ({ page }) => {
      await fixture.goto(config);
      const ionChangeSpy = await page.spyOnEvent('ionChange');

      const day8 = fixture.getVisibleDay(8);
      const day18 = fixture.getVisibleDay(18);

      await day8.click();
      await day18.click();
      await ionChangeSpy.next();

      const startISO = await fixture.getISOFromDay(day8);
      const endISO = await fixture.getISOFromDay(day18);
      expect(ionChangeSpy).toHaveReceivedEventDetail({
        value: [startISO, endISO],
      });
    });

    // ---------------------------------------------------------------
    // Header text
    // ---------------------------------------------------------------

    test('header should show placeholder labels when no range is selected', async () => {
      const datetime = await fixture.goto(config, undefined, { showDefaultTitle: true });
      const header = datetime.locator('.datetime-selected-date');

      await expect(header).toHaveText(/Start date/);
      await expect(header).toHaveText(/End date/);
    });

    test('header should show start date and End date placeholder for partial range', async () => {
      const datetime = await fixture.goto(config, [RANGE_START], { showDefaultTitle: true });
      const header = datetime.locator('.datetime-selected-date');

      await expect(header).toHaveText(/Jun 8/);
      await expect(header).toHaveText(/End date/);
    });

    test('header should show both dates for a complete range', async () => {
      const datetime = await fixture.goto(config, RANGE_VALUE, { showDefaultTitle: true });
      const header = datetime.locator('.datetime-selected-date');

      await expect(header).toHaveText(/Jun 8/);
      await expect(header).toHaveText(/Jun 18/);
    });

    test('header should use custom labels', async () => {
      const datetime = await fixture.goto(config, undefined, {
        showDefaultTitle: true,
        startDateLabel: 'Check in',
        endDateLabel: 'Check out',
      });
      const header = datetime.locator('.datetime-selected-date');

      await expect(header).toHaveText(/Check in/);
      await expect(header).toHaveText(/Check out/);
    });

    // ---------------------------------------------------------------
    // Confirm / Reset / Cancel with buttons
    // ---------------------------------------------------------------

    test('with buttons, value should not update until confirm is called', async ({ page }) => {
      const datetime = await fixture.goto(config, undefined, { showDefaultButtons: true });

      const day8 = fixture.getVisibleDay(8);
      const day18 = fixture.getVisibleDay(18);

      await day8.click();
      await day18.click();
      await page.waitForChanges();

      // Value should not be set until confirmed
      await expect(datetime).toHaveJSProperty('value', undefined);

      const startISO = await fixture.getISOFromDay(day8);
      const endISO = await fixture.getISOFromDay(day18);

      await datetime.evaluate((el: HTMLIonDatetimeElement) => el.confirm());
      await expect(datetime).toHaveJSProperty('value', [startISO, endISO]);
    });

    test('confirm should not close overlay with incomplete range', async ({ page }) => {
      const datetime = await fixture.goto(config, undefined, { showDefaultButtons: true });

      const day8 = fixture.getVisibleDay(8);
      await day8.click();
      await page.waitForChanges();

      // Calling confirm with only start selected should not set value
      await datetime.evaluate((el: HTMLIonDatetimeElement) => el.confirm());
      await expect(datetime).toHaveJSProperty('value', undefined);
    });

    test('reset should clear the range selection', async ({ page }) => {
      const datetime = await fixture.goto(config, RANGE_VALUE, { showDefaultButtons: true });

      await datetime.evaluate((el: HTMLIonDatetimeElement) => el.reset());
      await page.waitForChanges();

      const day8 = datetime.locator('[data-month="6"][data-day="8"]');
      const day18 = datetime.locator('[data-month="6"][data-day="18"]');

      await expect(day8).not.toHaveClass(/calendar-day-range-start/);
      await expect(day18).not.toHaveClass(/calendar-day-range-end/);
    });

    test('clear button should clear the range', async ({ page }) => {
      const datetime = await fixture.goto(config, RANGE_VALUE, {
        showDefaultButtons: true,
        showClearButton: true,
      });

      const doneButton = datetime.locator('#confirm-button');
      const clearButton = datetime.locator('#clear-button');

      await doneButton.click();
      await clearButton.click();
      await page.waitForChanges();

      await expect(datetime).toHaveJSProperty('value', undefined);
    });

    // ---------------------------------------------------------------
    // Programmatic value setting
    // ---------------------------------------------------------------

    test('setting value programmatically should update the calendar', async () => {
      const datetime = await fixture.goto(config);

      await datetime.evaluate((el: HTMLIonDatetimeElement) => {
        el.value = ['2022-06-05', '2022-06-15'];
      });

      const day5 = datetime.locator('[data-month="6"][data-day="5"]');
      const day10 = datetime.locator('[data-month="6"][data-day="10"]');
      const day15 = datetime.locator('[data-month="6"][data-day="15"]');

      await expect(day5).toHaveClass(/calendar-day-range-start/);
      await expect(day15).toHaveClass(/calendar-day-range-end/);
      await expect(day10).toHaveClass(/calendar-day-in-range/);
    });

    // ---------------------------------------------------------------
    // Disabled dates within range
    // ---------------------------------------------------------------

    test('should not allow range spanning a disabled date', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime
          locale="en-US"
          presentation="date"
          selection-mode="range"
        ></ion-datetime>
        <script>
          const datetime = document.querySelector('ion-datetime');
          datetime.value = ['2022-06-01'];
          datetime.isDateEnabled = (dateIsoString) => {
            const date = new Date(dateIsoString);
            return date.getUTCDate() !== 15;
          };
        </script>
      `,
        config
      );

      await page.locator('.datetime-ready').waitFor();
      const datetime = page.locator('ion-datetime');

      const day10 = datetime.locator('[data-month="6"][data-day="10"]');
      const day20 = datetime.locator('[data-month="6"][data-day="20"]');

      await day10.click();
      await page.waitForChanges();
      await day20.click();
      await page.waitForChanges();

      // Range should not span the disabled 15th — should start a new range instead
      await expect(day10).not.toHaveClass(/calendar-day-range-start/);
      await expect(day20).toHaveClass(/calendar-day-active/);
    });

    // ---------------------------------------------------------------
    // Disabled and readonly states
    // ---------------------------------------------------------------

    test('disabled datetime should show range but not allow interaction', async () => {
      const datetime = await fixture.goto(config, RANGE_VALUE, { disabled: true });

      const day8 = datetime.locator('[data-month="6"][data-day="8"]');
      const day18 = datetime.locator('[data-month="6"][data-day="18"]');

      // Range should still be visually displayed
      await expect(day8).toHaveClass(/calendar-day-range-start/);
      await expect(day18).toHaveClass(/calendar-day-range-end/);

      // Days should be disabled
      await expect(day8).toHaveAttribute('disabled', '');
    });

    test('readonly datetime should show range but not allow interaction', async () => {
      const datetime = await fixture.goto(config, RANGE_VALUE, { readonly: true });

      const day8 = datetime.locator('[data-month="6"][data-day="8"]');
      const day18 = datetime.locator('[data-month="6"][data-day="18"]');

      await expect(day8).toHaveClass(/calendar-day-range-start/);
      await expect(day18).toHaveClass(/calendar-day-range-end/);
    });

    // ---------------------------------------------------------------
    // Month/year wheel should not change selection in range mode
    // ---------------------------------------------------------------

    test('using month wheel should not change selection in range mode', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime locale="en-US" selection-mode="range"></ion-datetime>
        <script>
          const datetime = document.querySelector('ion-datetime');
          datetime.value = ['2022-06-08', '2022-06-18'];
        </script>
      `,
        config
      );

      await page.waitForSelector('.datetime-ready');
      const datetime = page.locator('ion-datetime');

      const dropdownButton = page.locator('.calendar-month-year-toggle');
      await dropdownButton.click();
      await page.waitForChanges();

      const monthOption = page.locator('.month-column ion-picker-column-option').nth(0);
      await monthOption.click();
      await page.waitForChanges();

      // Value should remain unchanged — wheel is navigation-only in range mode
      await expect(datetime).toHaveJSProperty('value', RANGE_VALUE);
    });

    test('using year wheel should not change selection in range mode', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime locale="en-US" selection-mode="range"></ion-datetime>
        <script>
          const datetime = document.querySelector('ion-datetime');
          datetime.value = ['2022-06-08', '2022-06-18'];
        </script>
      `,
        config
      );

      await page.waitForSelector('.datetime-ready');
      const datetime = page.locator('ion-datetime');

      const dropdownButton = page.locator('.calendar-month-year-toggle');
      await dropdownButton.click();
      await page.waitForChanges();

      const yearOption = page.locator('.year-column ion-picker-column-option').nth(0);
      await yearOption.click();
      await page.waitForChanges();

      // Value should remain unchanged — wheel is navigation-only in range mode
      await expect(datetime).toHaveJSProperty('value', RANGE_VALUE);
    });
  });
});

/**
 * RTL-specific visual regression tests to verify pill border-radius direction.
 */
configs({ modes: ['ios', 'md'], directions: ['rtl'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('datetime: range selection RTL (visual regressions)'), () => {
    let fixture: DatetimeRangeFixture;
    test.beforeEach(async ({ page }) => {
      fixture = new DatetimeRangeFixture(page);
    });

    test('range pills should be correctly rounded in RTL', async () => {
      await fixture.goto(config, RANGE_VALUE);
      await fixture.expectRangeDatePicker('rtl-pills', screenshot);
    });
  });
});
