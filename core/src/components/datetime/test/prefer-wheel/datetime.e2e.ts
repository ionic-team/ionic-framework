import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  /**
   * When taking screenshots, be sure to
   * set the datetime to size="cover". There
   * are rendering quirks on Linux
   * if the datetime is too small.
   */
  test.describe(title('datetime: wheel rendering'), () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({
        width: 400,
        height: 200,
      });
    });

    test('should not have visual regressions for date wheel', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime size="cover" presentation="date" prefer-wheel="true" value="2019-05-30" max="2022"></ion-datetime>
      `,
        config
      );
      await page.waitForSelector('.datetime-ready');

      await expect(page).toHaveScreenshot(screenshot(`datetime-wheel-date-diff`));
    });
    test('should not have visual regressions for date-time wheel', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime size="cover" presentation="date-time" prefer-wheel="true" value="2019-05-30T16:30:00" max="2022"></ion-datetime>
      `,
        config
      );
      await page.waitForSelector('.datetime-ready');

      await expect(page).toHaveScreenshot(screenshot(`datetime-wheel-date-time-diff`));
    });
    test('should not have visual regressions for time-date wheel', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime size="cover" presentation="time-date" prefer-wheel="true" value="2019-05-30T16:30:00" max="2022"></ion-datetime>
      `,
        config
      );
      await page.waitForSelector('.datetime-ready');

      await expect(page).toHaveScreenshot(screenshot(`datetime-wheel-time-date-diff`));
    });
    test('should render a condense header when specified', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime size="cover" presentation="time-date" prefer-wheel="true" value="2019-05-30T16:30:00" max="2022"><div slot="title">My Custom Title</div></ion-datetime>
      `,
        config
      );
      await page.waitForSelector('.datetime-ready');

      const datetime = page.locator('ion-datetime');

      await expect(datetime).toHaveScreenshot(screenshot(`datetime-wheel-header-diff`));
    });
  });
});

/**
 * This is testing component functionality which
 * does not vary across modes/directions.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('datetime: preferWheel functionality'), () => {
    test.describe('datetime: date wheel', () => {
      test('should respect the min bounds', async ({ page }) => {
        await page.setContent(
          `
          <ion-datetime presentation="date" prefer-wheel="true" min="2019-05-05" max="2023-10-01" value="2019-05-30"></ion-datetime>
        `,
          config
        );

        await page.waitForSelector('.datetime-ready');

        const dayValues = page.locator('ion-datetime .day-column ion-picker-column-option');
        expect(await dayValues.count()).toEqual(27);
      });
      test('should respect the max bounds', async ({ page }) => {
        await page.setContent(
          `
          <ion-datetime presentation="date" prefer-wheel="true" min="2019-05-05" max="2023-10-01" value="2023-10-01"></ion-datetime>
        `,
          config
        );

        await page.waitForSelector('.datetime-ready');

        const dayValues = page.locator('ion-datetime .day-column ion-picker-column-option');
        expect(await dayValues.count()).toEqual(1);
      });
      test('should respect isDateEnabled preference', async ({ page }) => {
        await page.setContent(
          `
          <ion-datetime presentation="date" prefer-wheel="true" value="2022-01-01"></ion-datetime>
          <script>
            const datetime = document.querySelector('ion-datetime');
            datetime.isDateEnabled = (dateIsoString) => {
              const date = new Date(dateIsoString);
              if (date.getUTCDate() % 2 === 0) {
                return false;
              }
              return true;
            }
          </script>
        `,
          config
        );

        await page.waitForSelector('.datetime-ready');

        const disabledMonths = page.locator('.month-column ion-picker-column-option.option-disabled');
        const disabledYears = page.locator('.year-column ion-picker-column-option.option-disabled');
        const disabledDays = page.locator('.day-column ion-picker-column-option.option-disabled');

        expect(await disabledMonths.count()).toBe(0);
        expect(await disabledYears.count()).toBe(0);
        expect(await disabledDays.count()).toBe(15);
      });
      test('should respect month, day, and year preferences', async ({ page }) => {
        await page.setContent(
          `
          <ion-datetime
            presentation="date"
            prefer-wheel="true"
            value="2022-01-01"
            month-values="4,6"
            day-values="1,2,3,4,5"
            year-values="2022,2020,2019"
          ></ion-datetime>
        `,
          config
        );

        await page.waitForSelector('.datetime-ready');

        const monthValues = page.locator('.month-column ion-picker-column-option');
        const yearValues = page.locator('.year-column ion-picker-column-option');
        const dayValues = page.locator('.day-column ion-picker-column-option');

        expect(await monthValues.count()).toBe(2);
        expect(await yearValues.count()).toBe(3);
        expect(await dayValues.count()).toBe(5);
      });
      test('selecting month should update value when no value is set', async ({ page }) => {
        await page.setContent(
          `
          <ion-datetime
            presentation="date"
            prefer-wheel="true"
          ></ion-datetime>

          <script>
            const mockToday = '2022-10-10T16:22';
            Date = class extends Date {
              constructor(...args) {
                if (args.length === 0) {
                  super(mockToday)
                } else {
                  super(...args);
                }
              }
            }
          </script>
        `,
          config
        );

        await page.waitForSelector('.datetime-ready');

        const ionChange = await page.spyOnEvent('ionChange');
        const monthValues = page.locator('.month-column ion-picker-column-option');

        // Change month value
        await monthValues.nth(0).click();

        await ionChange.next();
      });
      test('selecting day should update value when no value is set', async ({ page }) => {
        await page.setContent(
          `
          <ion-datetime
            presentation="date"
            prefer-wheel="true"
          ></ion-datetime>

          <script>
            const mockToday = '2022-10-10T16:22';
            Date = class extends Date {
              constructor(...args) {
                if (args.length === 0) {
                  super(mockToday)
                } else {
                  super(...args);
                }
              }
            }
          </script>
        `,
          config
        );

        await page.waitForSelector('.datetime-ready');

        const ionChange = await page.spyOnEvent('ionChange');
        const dayValues = page.locator('.day-column ion-picker-column-option');

        // Change day value
        await dayValues.nth(0).click();

        await ionChange.next();
      });
      test('selecting year should update value when no value is set', async ({ page }) => {
        await page.setContent(
          `
          <ion-datetime
            presentation="date"
            prefer-wheel="true"
          ></ion-datetime>
        `,
          config
        );

        await page.waitForSelector('.datetime-ready');

        const ionChange = await page.spyOnEvent('ionChange');
        const yearValues = page.locator('.year-column ion-picker-column-option');

        /**
         * Change year value
         * The 0th index is the current
         * year, so select something other than that.
         */
        await yearValues.nth(10).click();

        await ionChange.next();
      });

      test('should jump to selected date when programmatically updating value', async ({ page }) => {
        await page.setContent(
          `
            <ion-datetime presentation="date" prefer-wheel="true" min="2019-05-05" max="2023-10-01" value="2019-05-30"></ion-datetime>
          `,
          config
        );

        await page.waitForSelector('.datetime-ready');
        const datetime = page.locator('ion-datetime');

        await datetime.evaluate((el: HTMLIonDatetimeElement) => (el.value = '2021-05-25T12:40:00.000Z'));
        await page.waitForChanges();

        const selectedMonth = datetime.locator('.month-column ion-picker-column-option.option-active');
        const selectedDay = datetime.locator('.day-column ion-picker-column-option.option-active');
        const selectedYear = datetime.locator('.year-column ion-picker-column-option.option-active');

        await expect(selectedMonth).toHaveText(/May/);
        await expect(selectedDay).toHaveText(/25/);
        await expect(selectedYear).toHaveText(/2021/);
      });

      test.describe('datetime: date wheel localization', () => {
        test('should correctly localize the date data', async ({ page }) => {
          await page.setContent(
            `
            <ion-datetime
              presentation="date"
              prefer-wheel="true"
              locale="ja-JP"
              min="2022-01-01"
              max="2022-03-01"
              day-values="1,2,3"
              value="2022-01-01"
            ></ion-datetime>
          `,
            config
          );

          await page.waitForSelector('.datetime-ready');

          const monthValues = page.locator('.month-column ion-picker-column-option');
          const dayValues = page.locator('.day-column ion-picker-column-option');
          await expect(monthValues).toHaveText(['1月', '2月', '3月']);
          await expect(dayValues).toHaveText(['1日', '2日', '3日']);
        });
        test('should render the columns according to locale - en-US', async ({ page }) => {
          await page.setContent(
            `
            <ion-datetime
              presentation="date"
              prefer-wheel="true"
              locale="en-US"
              value="2022-01-01"
            ></ion-datetime>
          `,
            config
          );

          await page.waitForSelector('.datetime-ready');

          const columns = page.locator('ion-picker-column');

          await expect(columns.nth(0)).toHaveClass(/month-column/);
          await expect(columns.nth(1)).toHaveClass(/day-column/);
          await expect(columns.nth(2)).toHaveClass(/year-column/);
        });
        test('should render the columns according to locale - en-GB', async ({ page }) => {
          await page.setContent(
            `
            <ion-datetime
              presentation="date"
              prefer-wheel="true"
              locale="en-GB"
              value="2022-01-01"
            ></ion-datetime>
          `,
            config
          );

          await page.waitForSelector('.datetime-ready');

          const columns = page.locator('ion-picker-column');

          await expect(columns.nth(0)).toHaveClass(/day-column/);
          await expect(columns.nth(1)).toHaveClass(/month-column/);
          await expect(columns.nth(2)).toHaveClass(/year-column/);
        });
      });
    });
    test.describe('datetime: date-time wheel', () => {
      test('should respect the min bounds', async ({ page }) => {
        await page.setContent(
          `
          <ion-datetime presentation="date-time" prefer-wheel="true" min="2019-05-05" value="2019-05-10T16:30:00"></ion-datetime>
        `,
          config
        );

        await page.waitForSelector('.datetime-ready');

        const dayValues = page.locator('ion-datetime .date-column ion-picker-column-option');
        expect(await dayValues.count()).toEqual(57);
      });
      test('should respect the max bounds', async ({ page }) => {
        await page.setContent(
          `
          <ion-datetime presentation="date-time" prefer-wheel="true" max="2023-06-10" value="2023-06-05T16:30:00"></ion-datetime>
        `,
          config
        );

        await page.waitForSelector('.datetime-ready');

        const dayValues = page.locator('ion-datetime .date-column ion-picker-column-option');
        expect(await dayValues.count()).toEqual(41);
      });
      test('should respect isDateEnabled preference', async ({ page }) => {
        await page.setContent(
          `
          <ion-datetime presentation="date-time" prefer-wheel="true" value="2022-02-01T16:30:00"></ion-datetime>
          <script>
            const datetime = document.querySelector('ion-datetime');
            datetime.isDateEnabled = (dateIsoString) => {
              const date = new Date(dateIsoString);
              if (date.getUTCDate() % 2 === 0) {
                return false;
              }
              return true;
            }
          </script>
        `,
          config
        );

        await page.waitForSelector('.datetime-ready');

        const disabledDates = page.locator('.date-column ion-picker-column-option.option-disabled');

        expect(await disabledDates.count()).toBe(44);
      });
      test('should respect month, day, and year preferences', async ({ page }) => {
        await page.setContent(
          `
          <ion-datetime
            presentation="date-time"
            prefer-wheel="true"
            value="2022-02-01"
            month-values="2"
            day-values="1,2,3,4,5"
            year-values="2022,2020,2019"
          ></ion-datetime>
        `,
          config
        );

        await page.waitForSelector('.datetime-ready');

        const dateValues = page.locator('.date-column ion-picker-column-option');

        expect(await dateValues.count()).toBe(5);
      });
      test('should correctly localize the date data', async ({ page }) => {
        await page.setContent(
          `
          <ion-datetime
            presentation="date-time"
            prefer-wheel="true"
            locale="ja-JP"
            month-values="2"
            day-values="1,2,3"
            value="2022-02-01"
          ></ion-datetime>
        `,
          config
        );

        await page.waitForSelector('.datetime-ready');

        const dateValues = page.locator('.date-column ion-picker-column-option');
        await expect(dateValues).toHaveText(['2月1日(火)', '2月2日(水)', '2月3日(木)']);
      });
      test('should respect min and max bounds even across years', async ({ page }) => {
        await page.setContent(
          `
          <ion-datetime
            presentation="date-time"
            prefer-wheel="true"
            value="2022-02-01"
            min="2021-12-01"
            max="2023-01-01"
          ></ion-datetime>
        `,
          config
        );

        await page.waitForSelector('.datetime-ready');

        const dateColumn = page.locator('.date-column');
        const dateColumnScrollEl = dateColumn.locator('.picker-opts');
        const dateValues = dateColumn.locator('ion-picker-column-option');

        expect(await dateValues.count()).toBe(90);

        /**
         * Select 1st item to change the dates rendered
         */
        await expect(dateValues.nth(0)).toHaveJSProperty('value', '2022-1-1');
        await dateColumnScrollEl.evaluate((el: HTMLElement) => (el.scrollTop = 0));
        await page.waitForChanges();

        await expect(dateValues.nth(0)).toHaveJSProperty('value', '2021-12-1');
      });
      test('should keep sliding window if default window is within min and max constraints', async ({ page }) => {
        await page.setContent(
          `
          <ion-datetime
            presentation="date-time"
            prefer-wheel="true"
            value="2022-06-01"
            max="2030-01-01"
            min="2010-01-01"
          ></ion-datetime>
        `,
          config
        );

        await page.waitForSelector('.datetime-ready');

        const dayValues = page.locator('.date-column ion-picker-column-option');

        expect(await dayValues.count()).toBe(92);
      });
      test('should narrow sliding window if default window is not within min and max constraints', async ({ page }) => {
        await page.setContent(
          `
          <ion-datetime
            presentation="date-time"
            prefer-wheel="true"
            value="2022-06-01"
            max="2022-05-15"
            min="2022-05-01"
          ></ion-datetime>
        `,
          config
        );

        await page.waitForSelector('.datetime-ready');

        const dayValues = page.locator('.date-column ion-picker-column-option');

        expect(await dayValues.count()).toBe(15);
      });
      test('selecting date should update value when no value is set', async ({ page }) => {
        await page.setContent(
          `
          <ion-datetime
            presentation="date-time"
            prefer-wheel="true"
          ></ion-datetime>
        `,
          config
        );

        await page.waitForSelector('.datetime-ready');

        const ionChange = await page.spyOnEvent('ionChange');
        const dayValues = page.locator('.date-column ion-picker-column-option');

        // Change day/month value
        await dayValues.nth(0).click();

        await ionChange.next();
      });
    });
    test.describe('datetime: time-date wheel', () => {
      test('should respect the min bounds', async ({ page }) => {
        await page.setContent(
          `
          <ion-datetime presentation="time-date" prefer-wheel="true" min="2019-05-05" value="2019-05-10T16:30:00"></ion-datetime>
        `,
          config
        );

        await page.waitForSelector('.datetime-ready');

        const dayValues = page.locator('ion-datetime .date-column ion-picker-column-option');
        expect(await dayValues.count()).toEqual(57);
      });
      test('should respect the max bounds', async ({ page }) => {
        await page.setContent(
          `
          <ion-datetime presentation="time-date" prefer-wheel="true" max="2023-06-10" value="2023-06-05T16:30:00"></ion-datetime>
        `,
          config
        );

        await page.waitForSelector('.datetime-ready');

        const dayValues = page.locator('ion-datetime .date-column ion-picker-column-option');
        expect(await dayValues.count()).toEqual(41);
      });
      test('should respect isDateEnabled preference', async ({ page }) => {
        await page.setContent(
          `
          <ion-datetime presentation="time-date" prefer-wheel="true" value="2022-02-01T16:30:00"></ion-datetime>
          <script>
            const datetime = document.querySelector('ion-datetime');
            datetime.isDateEnabled = (dateIsoString) => {
              const date = new Date(dateIsoString);
              if (date.getUTCDate() % 2 === 0) {
                return false;
              }
              return true;
            }
          </script>
        `,
          config
        );

        await page.waitForSelector('.datetime-ready');

        const disabledDates = page.locator('.date-column ion-picker-column-option.option-disabled');

        expect(await disabledDates.count()).toBe(44);
      });
      test('should respect month, day, and year preferences', async ({ page }) => {
        await page.setContent(
          `
          <ion-datetime
            presentation="time-date"
            prefer-wheel="true"
            value="2022-02-01"
            month-values="2"
            day-values="1,2,3,4,5"
            year-values="2022,2020,2019"
          ></ion-datetime>
        `,
          config
        );

        await page.waitForSelector('.datetime-ready');

        const dateValues = page.locator('.date-column ion-picker-column-option');

        expect(await dateValues.count()).toBe(5);
      });
      test('should correctly localize the date data', async ({ page }) => {
        await page.setContent(
          `
          <ion-datetime
            presentation="time-date"
            prefer-wheel="true"
            locale="ja-JP"
            month-values="2"
            day-values="1,2,3"
            value="2022-02-01"
          ></ion-datetime>
        `,
          config
        );

        await page.waitForSelector('.datetime-ready');

        const dateValues = page.locator('.date-column ion-picker-column-option');

        await expect(dateValues).toHaveText(['2月1日(火)', '2月2日(水)', '2月3日(木)']);
      });
      test('should respect min and max bounds even across years', async ({ page }) => {
        await page.setContent(
          `
          <ion-datetime
            presentation="time-date"
            prefer-wheel="true"
            value="2022-02-01"
            min="2021-12-01"
            max="2023-01-01"
          ></ion-datetime>
        `,
          config
        );

        await page.waitForSelector('.datetime-ready');

        const dateColumn = page.locator('.date-column');
        const dateColumnScrollEl = dateColumn.locator('.picker-opts');
        const dateValues = dateColumn.locator('ion-picker-column-option');

        expect(await dateValues.count()).toBe(90);

        /**
         * Select 1st item to change the dates rendered
         */
        await expect(dateValues.nth(0)).toHaveJSProperty('value', '2022-1-1');
        await dateColumnScrollEl.evaluate((el: HTMLElement) => (el.scrollTop = 0));
        await page.waitForChanges();

        await expect(dateValues.nth(0)).toHaveJSProperty('value', '2021-12-1');
      });
      test('should keep sliding window if default window is within min and max constraints', async ({ page }) => {
        await page.setContent(
          `
        <ion-datetime
          presentation="time-date"
          prefer-wheel="true"
          value="2022-06-01"
          max="2030-01-01"
          min="2010-01-01"
        ></ion-datetime>
      `,
          config
        );

        await page.waitForSelector('.datetime-ready');

        const dayValues = page.locator('.date-column ion-picker-column-option');

        expect(await dayValues.count()).toBe(92);
      });
      test('should narrow sliding window if default window is not within min and max constraints', async ({ page }) => {
        await page.setContent(
          `
        <ion-datetime
          presentation="time-date"
          prefer-wheel="true"
          value="2022-06-01"
          max="2022-05-15"
          min="2022-05-01"
        ></ion-datetime>
      `,
          config
        );

        await page.waitForSelector('.datetime-ready');

        const dayValues = page.locator('.date-column ion-picker-column-option');

        expect(await dayValues.count()).toBe(15);
      });
    });
  });
});
