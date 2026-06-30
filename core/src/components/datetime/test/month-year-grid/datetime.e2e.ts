import { expect } from '@playwright/test';
import type { Locator } from '@playwright/test';
import type { E2EPage, E2EPageOptions } from '@utils/test/playwright';
import { configs, test } from '@utils/test/playwright';

interface DatetimeMonthYearGridConfig {
  monthYearPickerView?: 'wheel' | 'grid';
  min?: string;
  max?: string;
}

class DatetimeMonthYearGridFixture {
  readonly page: E2EPage;
  datetime!: Locator;

  constructor(page: E2EPage) {
    this.page = page;
  }

  async goto(config: E2EPageOptions, datetimeConfig: DatetimeMonthYearGridConfig = {}): Promise<Locator> {
    const { monthYearPickerView = 'grid', min, max } = datetimeConfig;

    const minAttr = min ? `min="${min}"` : '';
    const maxAttr = max ? `max="${max}"` : '';

    await this.page.setContent(
      `
      <ion-datetime
        locale="en-US"
        presentation="date"
        value="2022-06-15"
        month-year-picker-view="${monthYearPickerView}"
        ${minAttr}
        ${maxAttr}
      ></ion-datetime>
    `,
      config
    );

    this.datetime = this.page.locator('ion-datetime');
    await this.page.locator('.datetime-ready').waitFor();
    return this.datetime;
  }

  async openPicker(): Promise<void> {
    const toggleButton = this.datetime.locator('.calendar-month-year-toggle');
    await toggleButton.click();
    await this.page.waitForChanges();
  }
}

/**
 * Month/year grid picker functionality is the same across modes/directions.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('datetime: monthYearPickerView="grid" (functionality)'), () => {
    let fixture: DatetimeMonthYearGridFixture;

    test.beforeEach(async ({ page }) => {
      fixture = new DatetimeMonthYearGridFixture(page);
    });

    test('host should have datetime-month-year-picker-grid class', async () => {
      const datetime = await fixture.goto(config, { monthYearPickerView: 'grid' });
      await expect(datetime).toHaveClass(/datetime-month-year-picker-grid/);
    });

    test('host should not have datetime-month-year-picker-grid class in wheel mode', async () => {
      const datetime = await fixture.goto(config, { monthYearPickerView: 'wheel' });
      await expect(datetime).not.toHaveClass(/datetime-month-year-picker-grid/);
    });

    test('clicking toggle button should show the grid picker', async ({ page }) => {
      await fixture.goto(config);
      await fixture.openPicker();

      const gridContainer = fixture.datetime.locator('.month-year-grid-container');
      await expect(gridContainer).toBeVisible();
    });

    test('grid should show month cells', async ({ page }) => {
      await fixture.goto(config);
      await fixture.openPicker();

      const monthCells = fixture.datetime.locator('.month-year-grid .month-year-grid-cell');
      // There are 12 months
      await expect(monthCells).toHaveCount(12);
    });

    test('grid should show year cells', async ({ page }) => {
      await fixture.goto(config);
      await fixture.openPicker();

      const yearCells = fixture.datetime.locator('.month-year-grid-years .month-year-grid-cell');
      // There should be multiple years
      await expect(yearCells).toHaveCount(expect.any(Number) as any);
      const count = await yearCells.count();
      expect(count).toBeGreaterThan(0);
    });

    test('clicking a month cell should update the working month', async ({ page }) => {
      await fixture.goto(config);
      const monthYear = fixture.datetime.locator('.calendar-month-year');

      await expect(monthYear).toHaveText(/June 2022/);
      await fixture.openPicker();

      // Click on January (first month cell)
      const januaryCell = fixture.datetime.locator('.month-year-grid .month-year-grid-cell').first();
      await januaryCell.click();
      await page.waitForChanges();

      await expect(monthYear).toHaveText(/January 2022/);
    });

    test('clicking a month cell should close the picker overlay', async ({ page }) => {
      await fixture.goto(config);
      await fixture.openPicker();

      const gridContainer = fixture.datetime.locator('.month-year-grid-container');
      await expect(gridContainer).toBeVisible();

      const januaryCell = fixture.datetime.locator('.month-year-grid .month-year-grid-cell').first();
      await januaryCell.click();
      await page.waitForChanges();

      await expect(gridContainer).not.toBeVisible();
    });

    test('clicking a year cell should update the working year', async ({ page }) => {
      await fixture.goto(config);
      const monthYear = fixture.datetime.locator('.calendar-month-year');

      await fixture.openPicker();

      // Find a year cell that is not 2022 and click it
      const yearCells = fixture.datetime.locator('.month-year-grid-years .month-year-grid-cell');
      const count = await yearCells.count();

      // Find year 2023
      for (let i = 0; i < count; i++) {
        const cell = yearCells.nth(i);
        const text = await cell.textContent();
        if (text?.trim() === '2023') {
          await cell.click();
          await page.waitForChanges();
          await expect(monthYear).toHaveText(/2023/);
          break;
        }
      }
    });

    test('disabled months should respect max constraint', async ({ page }) => {
      await fixture.goto(config, { max: '2022-03-31' });
      await fixture.openPicker();

      // April (index 3, 0-based) through December should be disabled
      const monthCells = fixture.datetime.locator('.month-year-grid .month-year-grid-cell');
      const aprilCell = monthCells.nth(3); // April is index 3
      await expect(aprilCell).toHaveAttribute('disabled', '');
    });

    test('disabled months should respect min constraint', async ({ page }) => {
      await fixture.goto(config, { min: '2022-09-01' });
      await fixture.openPicker();

      // January (index 0) through August (index 7) should be disabled
      const monthCells = fixture.datetime.locator('.month-year-grid .month-year-grid-cell');
      const januaryCell = monthCells.nth(0);
      await expect(januaryCell).toHaveAttribute('disabled', '');
    });

    test('picker should not show wheel picker when monthYearPickerView="grid"', async ({ page }) => {
      await fixture.goto(config, { monthYearPickerView: 'grid' });
      await fixture.openPicker();

      // ion-picker-column-internal should not be present in grid mode
      const wheelPicker = fixture.datetime.locator('ion-picker-column-internal');
      await expect(wheelPicker).not.toBeAttached();
    });

    test('wheel mode should show ion-picker-column when monthYearPickerView="wheel"', async ({ page }) => {
      await fixture.goto(config, { monthYearPickerView: 'wheel' });
      await fixture.openPicker();

      // ion-picker should be present in wheel mode
      const wheelPicker = fixture.datetime.locator('ion-picker');
      await expect(wheelPicker).toBeAttached();
    });

    test('grid cells should display correct month names in locale', async ({ page }) => {
      await fixture.goto(config, { monthYearPickerView: 'grid' });
      await fixture.openPicker();

      const monthCells = fixture.datetime.locator('.month-year-grid .month-year-grid-cell');
      // First cell should be January in en-US
      await expect(monthCells.first()).toContainText('Jan');
    });

    test('currently selected month should be highlighted in the grid', async ({ page }) => {
      await fixture.goto(config);
      await fixture.openPicker();

      // June is the current month (value="2022-06-15"), index 5
      const monthCells = fixture.datetime.locator('.month-year-grid .month-year-grid-cell');
      const juneCell = monthCells.nth(5);

      // The current month cell should have an active/selected class
      await expect(juneCell).toHaveClass(/month-year-grid-cell-active/);
    });
  });
});

/**
 * Visual regressions are tested across all modes and directions.
 */
configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('datetime: monthYearPickerView (visual regressions)'), () => {
    test('grid picker open should not have visual regressions', async ({ page }) => {
      const fixture = new DatetimeMonthYearGridFixture(page);
      await fixture.goto(config, { monthYearPickerView: 'grid' });
      await fixture.openPicker();

      await expect(fixture.datetime).toHaveScreenshot(screenshot('datetime-month-year-grid-open'));
    });

    test('grid picker closed should not have visual regressions', async ({ page }) => {
      const fixture = new DatetimeMonthYearGridFixture(page);
      await fixture.goto(config, { monthYearPickerView: 'grid' });

      await expect(fixture.datetime).toHaveScreenshot(screenshot('datetime-month-year-grid-closed'));
    });
  });
});
