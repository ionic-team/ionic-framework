import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('datetime: values'), () => {
    test('should render correct days', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime locale="en-US" presentation="date" day-values="1,2,3"></ion-datetime>
      `,
        config
      );
      await page.waitForSelector('.datetime-ready');

      const items = page.locator('.calendar-day:not([disabled])');

      /**
       * Datetime calendar grid renders 3 months by default,
       * so this ensures that dayValues is applying to all
       * rendered months, not just the initial month.
       */
      await expect(items).toHaveText(['1', '2', '3', '1', '2', '3', '1', '2', '3']);
    });
    test('should render correct months', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime locale="en-US" presentation="month-year" month-values="5,6,10"></ion-datetime>
      `,
        config
      );

      const items = page.locator('.month-column ion-picker-column-option');
      await expect(items).toHaveText(['May', 'June', 'October']);
    });
    test('should render correct years', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime locale="en-US" presentation="month-year" year-values="2022,2021,2020"></ion-datetime>
      `,
        config
      );

      const items = page.locator('.year-column ion-picker-column-option');
      await expect(items).toHaveText(['2022', '2021', '2020']);
    });
    test('should render correct hours', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime locale="en-US" presentation="time" hour-values="1,2,3"></ion-datetime>
      `,
        config
      );

      const items = page.locator('ion-picker-column:first-of-type ion-picker-column-option');
      await expect(items).toHaveText(['1', '2', '3']);
    });
    test('should render correct minutes', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime locale="en-US" presentation="time" minute-values="1,2,3"></ion-datetime>
      `,
        config
      );

      const items = page.locator('ion-picker-column:nth-of-type(2) ion-picker-column-option');
      await expect(items).toHaveText(['01', '02', '03']);
    });
    test.only('should adjust default parts for allowed hour and minute values', async ({ page }) => {
      /**
       * Mock today's date for testing.
       * Playwright does not support this natively
       * so we extend the native Date interface: https://github.com/microsoft/playwright/issues/6347
       */
      await page.setContent(
        `
        <ion-datetime presentation="time" locale="en-US" hour-values="02" minute-values="0,15,30,45"></ion-datetime>

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

      const minuteColumn = page.locator('ion-picker-column').nth(1);
      const minuteItems = minuteColumn.locator('ion-picker-column-option');

      const text = await minuteItems.nth(1).textContent();
      await expect(minuteItems).toHaveText(['00', '15', '30', '45'], { useInnerText: true });
      await expect(minuteColumn).toHaveJSProperty('value', 15);

      const hourColumn = page.locator('ion-picker-column').nth(0);
      const hourItems = hourColumn.locator('ion-picker-column-option');
      await expect(hourItems).toHaveText(['2'], { useInnerText: true });
      await expect(hourColumn).toHaveJSProperty('value', 2);

      /**
       * Since the allowed hour is 2AM, the time period
       * should switch from PM to AM.
       */
      const ampmColumn = page.locator('ion-picker-column').nth(2);
      const ampmItems = ampmColumn.locator('ion-picker-column-option');
      await expect(ampmItems).toHaveText(['AM', 'PM'], { useInnerText: true });
      await expect(ampmColumn).toHaveJSProperty('value', 'am');
    });
    test('should adjust default parts month for allowed month values', async ({ page }) => {
      /**
       * Mock today's date for testing.
       * Playwright does not support this natively
       * so we extend the native Date interface: https://github.com/microsoft/playwright/issues/6347
       */
      await page.setContent(
        `
        <ion-datetime prefer-wheel="true" presentation="date" locale="en-US" month-values="01" hour-values="02" minute-values="0,15,30,45"></ion-datetime>

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

      const monthItems = page.locator('.month-column ion-picker-column-option');
      await expect(monthItems).toHaveText(['January']);
      await expect(monthItems.nth(0)).toHaveClass(/picker-item-active/);
    });
    test('today date highlight should persist even if disallowed from dayValues', async ({ page }) => {
      /**
       * Mock today's date for testing.
       * Playwright does not support this natively
       * so we extend the native Date interface: https://github.com/microsoft/playwright/issues/6347
       */
      await page.setContent(
        `
        <ion-datetime day-values="9" presentation="date" locale="en-US"></ion-datetime>

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

      const todayButton = page.locator('.calendar-day[data-day="10"][data-month="10"][data-year="2022"]');

      await expect(todayButton).toHaveClass(/calendar-day-today/);
    });
  });
});
