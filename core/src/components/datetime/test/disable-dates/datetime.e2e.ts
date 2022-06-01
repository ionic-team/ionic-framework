import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';
import type { E2EPage } from '@utils/test/playwright';

const DISABLED_CALENDAR_DAY_SELECTOR = '.calendar-day[disabled]:not(.calendar-day-padding)';

const queryAllDisabledDays = (page: E2EPage, datetimeSelector = 'ion-datetime') => {
  return page.locator(`${datetimeSelector} ${DISABLED_CALENDAR_DAY_SELECTOR}`);
};

const queryAllWorkingMonthDisabledDays = (page: E2EPage, datetimeSelector = 'ion-datetime') => {
  return page.locator(`${datetimeSelector} .calendar-month:nth-child(2) ${DISABLED_CALENDAR_DAY_SELECTOR}`);
};

test.describe('datetime: disable dates', () => {
  /**
   * We need to access testInfo, but Playwright
   * requires that we destructure the first parameter.
   */
  // eslint-disable-next-line no-empty-pattern
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.metadata.rtl === true, 'These tests do not check layout rendering functionality.');
  });
  test.describe('check return values', () => {
    test.beforeEach(async ({ page }) => {
      await page.setContent('<ion-datetime value="2021-10-01"></ion-datetime>');
    });

    test.describe('when isDateEnabled returns true', () => {
      test('calendar days should be enabled', async ({ page }) => {
        const datetime = page.locator('ion-datetime');
        await datetime.evaluate((el: HTMLIonDatetimeElement) => (el.isDateEnabled = () => true));
        await page.waitForChanges();

        const disabledDays = queryAllDisabledDays(page);
        expect(await disabledDays.count()).toBe(0);
      });
    });
    test.describe('when isDateEnabled returns false', () => {
      test('calendar days should be disabled', async ({ page }) => {
        const datetime = page.locator('ion-datetime');
        await datetime.evaluate((el: HTMLIonDatetimeElement) => (el.isDateEnabled = () => false));
        await page.waitForChanges();

        const disabledDays = queryAllDisabledDays(page);
        expect(await disabledDays.count()).toBe(91);
      });
    });
    test.describe('when isDateEnabled returns undefined', () => {
      test('calendar days should be disabled', async ({ page }) => {
        const datetime = page.locator('ion-datetime');
        await datetime.evaluate((el: HTMLIonDatetimeElement) => {
          /**
           * isDateEnabled expects a boolean, but we need
           * to check what happens when users pass in unexpected
           * values which is why we do the ts-ignore.
           */
          // @ts-ignore
          el.isDateEnabled = () => {
            undefined;
          };
        });

        await page.waitForChanges();

        const disabledDays = queryAllDisabledDays(page);
        expect(await disabledDays.count()).toBe(91);
      });
    });
    test.describe('when isDateEnabled returns null', () => {
      test('calendar days should be disabled', async ({ page }) => {
        const datetime = page.locator('ion-datetime');
        await datetime.evaluate((el: HTMLIonDatetimeElement) => {
          /**
           * isDateEnabled expects a boolean, but we need
           * to check what happens when users pass in unexpected
           * values which is why we do the ts-ignore.
           */
          // @ts-ignore
          el.isDateEnabled = () => null;
        });

        await page.waitForChanges();

        const disabledDays = queryAllDisabledDays(page);
        expect(await disabledDays.count()).toBe(91);
      });
    });
  });
  test.describe('check example usages', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/datetime/test/disable-dates');
    });

    test('should disable a specific date', async ({ page }) => {
      const disabledDay = queryAllDisabledDays(page, '#specificDate');

      expect(disabledDay).toHaveText('10');
    });

    test('should disable specific days of the week', async ({ page }) => {
      const disabledDays = queryAllWorkingMonthDisabledDays(page, '#weekends');

      expect(await disabledDays.count()).toEqual(10);
      expect(disabledDays).toHaveText(['2', '3', '9', '10', '16', '17', '23', '24', '30', '31']);
    });

    test('should disable a range of dates', async ({ page }) => {
      const disabledDays = queryAllDisabledDays(page, '#dateRange');

      expect(await disabledDays.count()).toEqual(11);
      expect(disabledDays).toHaveText(['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']);
    });

    test('should disable a month', async ({ page }) => {
      const disabledDays = queryAllDisabledDays(page, '#month');

      expect(await disabledDays.count()).toBe(31);
    });
  });
  test.describe('with a min date range', () => {
    test('should not enable already disabled dates', async ({ page }) => {
      await page.setContent(`
        <ion-datetime min="2021-10-15" value="2021-10-16"></ion-datetime>
        <script>
          const datetime = document.querySelector('ion-datetime');
          datetime.isDateEnabled = () => true;
        </script>
      `);

      const disabledDays = queryAllWorkingMonthDisabledDays(page);

      expect(await disabledDays.count()).toBe(14);
    });
  });
  test.describe('with a max date range', () => {
    test('should not enable already disabled dates', async ({ page }) => {
      await page.setContent(`
        <ion-datetime max="2021-10-15" value="2021-10-16"></ion-datetime>
        <script>
          const datetime = document.querySelector('ion-datetime');
          datetime.isDateEnabled = () => true;
        </script>
      `);

      const disabledDays = queryAllWorkingMonthDisabledDays(page);

      expect(await disabledDays.count()).toBe(16);
    });
  });
});
