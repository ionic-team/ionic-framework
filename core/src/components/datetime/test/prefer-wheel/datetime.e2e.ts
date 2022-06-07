import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('datetime: date wheel rendering', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto('/src/components/datetime/test/prefer-wheel');

    expect(await page.screenshot()).toMatchSnapshot(`datetime-wheel-date-diff-${page.getSnapshotSettings()}.png`);
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
});
