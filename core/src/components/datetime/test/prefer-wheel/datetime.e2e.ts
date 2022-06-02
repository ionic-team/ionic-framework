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
});
