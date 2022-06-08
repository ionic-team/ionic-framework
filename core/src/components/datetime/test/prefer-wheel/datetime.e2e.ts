import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('datetime: date wheel rendering', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.setContent(`
      <ion-datetime presentation="date" prefer-wheel="true" value="2019-05-30"></ion-datetime>
    `);

    const datetime = page.locator('ion-datetime');

    expect(await datetime.screenshot()).toMatchSnapshot(`datetime-wheel-date-diff-${page.getSnapshotSettings()}.png`);
  });
  test('should respect the min bounds', async ({ page }) => {
    await page.setContent(`
      <ion-datetime presentation="date" prefer-wheel="true" min="2019-05-05" max="2023-10-01" value="2019-05-30"></ion-datetime>
    `);

    await page.waitForSelector('.datetime-ready');

    const dayValues = page.locator('ion-datetime .day-column .picker-item[data-value]');
    expect(await dayValues.count()).toEqual(27);
  });
  test('should respect the max bounds', async ({ page }) => {
    await page.setContent(`
      <ion-datetime presentation="date" prefer-wheel="true" min="2019-05-05" max="2023-10-01" value="2023-10-01"></ion-datetime>
    `);

    await page.waitForSelector('.datetime-ready');

    const dayValues = page.locator('ion-datetime .day-column .picker-item[data-value]');
    expect(await dayValues.count()).toEqual(1);
  });
  test('should respect isDateEnabled preference', async ({ page }) => {
    await page.setContent(`
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
    `);

    await page.waitForSelector('.datetime-ready');

    const disabledMonths = page.locator('.month-column .picker-item[disabled]');
    const disabledYears = page.locator('.year-column .picker-item[disabled]');
    const disabledDays = page.locator('.day-column .picker-item[disabled]');

    expect(await disabledMonths.count()).toBe(0);
    expect(await disabledYears.count()).toBe(0);
    expect(await disabledDays.count()).toBe(15);
  });
  test('should respect month, day, and year preferences', async ({ page }) => {
    await page.setContent(`
      <ion-datetime
        presentation="date"
        prefer-wheel="true"
        value="2022-01-01"
        month-values="4,6"
        day-values="1,2,3,4,5"
        year-values="2022,2020,2019"
      ></ion-datetime>
    `);

    await page.waitForSelector('.datetime-ready');

    const monthValues = page.locator('.month-column .picker-item:not(.picker-item-empty)');
    const yearValues = page.locator('.year-column .picker-item:not(.picker-item-empty)');
    const dayValues = page.locator('.day-column .picker-item:not(.picker-item-empty)');

    expect(await monthValues.count()).toBe(2);
    expect(await yearValues.count()).toBe(3);
    expect(await dayValues.count()).toBe(5);
  });
});

test.describe.only('datetime: date-time wheel rendering', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.setContent(`
      <ion-datetime presentation="date-time" prefer-wheel="true" value="2019-05-30T16:30:00"></ion-datetime>
    `);

    const datetime = page.locator('ion-datetime');

    expect(await datetime.screenshot()).toMatchSnapshot(
      `datetime-wheel-date-time-diff-${page.getSnapshotSettings()}.png`
    );
  });
  test('should respect the min bounds', async ({ page }) => {
    await page.setContent(`
      <ion-datetime presentation="date-time" prefer-wheel="true" min="2019-05-05" value="2019-05-10T16:30:00"></ion-datetime>
    `);

    await page.waitForSelector('.datetime-ready');

    const dayValues = page.locator('ion-datetime .date-column .picker-item[data-value]');
    expect(await dayValues.count()).toEqual(57);
  });
  test('should respect the max bounds', async ({ page }) => {
    await page.setContent(`
      <ion-datetime presentation="date-time" prefer-wheel="true" max="2023-06-10" value="2023-06-05T16:30:00"></ion-datetime>
    `);

    await page.waitForSelector('.datetime-ready');

    const dayValues = page.locator('ion-datetime .date-column .picker-item[data-value]');
    expect(await dayValues.count()).toEqual(41);
  });
  test('should respect isDateEnabled preference', async ({ page }) => {
    await page.setContent(`
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
    `);

    await page.waitForSelector('.datetime-ready');

    // TODO: Change this to [disabled] after sync
    const disabledDates = page.locator('.date-column .picker-item.picker-item-disabled');

    expect(await disabledDates.count()).toBe(44);
  });
  test('should respect month, day, and year preferences', async ({ page }) => {
    await page.setContent(`
      <ion-datetime
        presentation="date-time"
        prefer-wheel="true"
        value="2022-02-01"
        month-values="2"
        day-values="1,2,3,4,5"
        year-values="2022,2020,2019"
      ></ion-datetime>
    `);

    await page.waitForSelector('.datetime-ready');

    const dateValues = page.locator('.date-column .picker-item:not(.picker-item-empty)');

    expect(await dateValues.count()).toBe(5);
  });
  test('should correctly localize the date data', async ({ page }) => {
    await page.setContent(`
      <ion-datetime
        presentation="date-time"
        prefer-wheel="true"
        locale="ja-JP"
        month-values="2"
        day-values="1,2,3"
        value="2022-02-01"
      ></ion-datetime>
    `);

    await page.waitForSelector('.datetime-ready');

    const dateValues = page.locator('.date-column .picker-item:not(.picker-item-empty)');

    expect(dateValues).toHaveText(['2月1日(火)', '2月2日(水)', '2月3日(木)']);
  });
});
